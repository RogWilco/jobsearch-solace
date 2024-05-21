provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key


  default_tags {
    tags = {
      project = "uhura"
    }
  }
}

locals {
  aws_ec2_instance_connect_cidr = "13.52.6.112/29"
}

# Logging
# ============================================================================

resource "aws_cloudwatch_log_group" "uhura_logGroup" {
  name              = "uhura"
  retention_in_days = 5
}

# Networking
# ============================================================================

resource "aws_default_vpc" "default_vpc" {}

resource "aws_default_subnet" "default_subnet" {
  availability_zone = var.aws_default_availability_zone
}

# RDS
# ============================================================================

resource "aws_db_instance" "uhura_db" {
  identifier                 = "uhura-db"
  instance_class             = "db.t3.micro"
  engine                     = "postgres"
  engine_version             = "16.2"
  auto_minor_version_upgrade = true
  storage_type               = "gp2"
  allocated_storage          = 20
  port                       = var.db_port
  db_name                    = var.db_name
  username                   = var.db_username
  password                   = var.db_password
  parameter_group_name       = aws_db_parameter_group.uhura_db_pg.name
  publicly_accessible        = true
  skip_final_snapshot        = true
}

resource "aws_db_parameter_group" "uhura_db_pg" {
  family = "postgres16"
  name   = "uhura-db-pg"

  # parameter {
  #   name  = "rds.force_ssl"
  #   value = "0"
  # }

  tags = {
    Name = "default.postgres16"
  }
}

# ECR Repositories
# ============================================================================

resource "aws_ecr_repository" "uhura_client_ecr" {
  name                 = "uhura-client"
  image_tag_mutability = "MUTABLE"

  tags = {
    Name = "uhura-client:ecr"
  }
}

resource "aws_ecr_repository" "uhura_service_ecr" {
  name                 = "uhura-service"
  image_tag_mutability = "MUTABLE"

  tags = {
    Name = "uhura-service:ecr"
  }
}

# ECS
# ============================================================================

resource "aws_ecs_cluster" "uhura_cluster" {
  name = "uhura-cluster"

  tags = {
    Name = "uhura:cluster"
  }
}

resource "aws_ecs_task_definition" "uhura_client_task" {
  family                   = "uhura-client"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = <<DEFINITION
  [
  {
    "name": "uhura-client",
    "image": "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/uhura-client:latest",
    "essential": true,
    "environment": [
      {
        "name": "UHURA_SERVICE_URL",
        "value": "${var.service_url}"
      },
      {
        "name": "UHURA_CLIENT_PORT",
        "value": "${var.client_port}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${aws_cloudwatch_log_group.uhura_logGroup.name}",
        "awslogs-stream-prefix": "ecs",
        "awslogs-region": "${var.aws_region}"
      }
    },
    "portMappings": [
      {
        "containerPort": ${var.client_port},
        "hostPort": ${var.client_port}
      }
    ],
    "memory": 512,
    "cpu": 256
  }
  ]
DEFINITION

  tags = {
    Name = "uhura-client:task"
  }
}

resource "aws_ecs_service" "uhura_client" {
  name            = "uhura-client"
  cluster         = aws_ecs_cluster.uhura_cluster.id
  task_definition = aws_ecs_task_definition.uhura_client_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_default_subnet.default_subnet.id]
    assign_public_ip = true
  }

  tags = {
    Name = "uhura-client:service"
  }
}

resource "aws_ecs_task_definition" "uhura_service_task" {
  family                   = "uhura-service"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = <<DEFINITION
  [
  {
    "name": "uhura-service",
    "image": "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/uhura-service:latest",
    "essential": true,
    "environment": [

      {
        "name": "DB_TYPE",
        "value": "${aws_db_instance.uhura_db.engine}"
      },
      {
        "name": "DB_HOST",
        "value": "${aws_db_instance.uhura_db.address}"
      },
      {
        "name": "DB_PORT",
        "value": "${aws_db_instance.uhura_db.port}"
      },
      {
        "name": "DB_NAME",
        "value": "${aws_db_instance.uhura_db.db_name}"
      },
      {
        "name": "DB_USERNAME",
        "value": "${aws_db_instance.uhura_db.username}"
      },
      {
        "name": "DB_PASSWORD",
        "value": "${var.db_password}"
      },
      {
        "name": "DB_SYNC",
        "value": "true"
      },
      {
        "name": "SERVICE_PORT",
        "value": "${var.service_port}"
      }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "${aws_cloudwatch_log_group.uhura_logGroup.name}",
        "awslogs-stream-prefix": "ecs",
        "awslogs-region": "${var.aws_region}"
      }
    },
    "portMappings": [
      {
        "containerPort": ${var.service_port},
        "hostPort": ${var.service_port}
      }
    ],
    "memory": 512,
    "cpu": 256
  }
]
DEFINITION

  tags = {
    Name = "uhura-service:task"
  }
}

resource "aws_ecs_service" "uhura_service" {
  name            = "uhura-service"
  cluster         = aws_ecs_cluster.uhura_cluster.id
  task_definition = aws_ecs_task_definition.uhura_service_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_default_subnet.default_subnet.id]
    assign_public_ip = true
  }

  tags = {
    Name = "uhura-service:service"
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "uhjson-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      },
    ]
  })

  tags = {
    Name = "uhjson-ecs-task-execution-role"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
