provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      project = "uhura"
    }
  }
}

locals {
  aws_ec2_instance_connect_cidr = "13.52.6.112/29"
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

# Networking
# ============================================================================

resource "aws_vpc" "uhura_vpc" {
  cidr_block       = "10.0.0.0/16"
  instance_tenancy = "default"

  tags = {
    Name = "uhura:vpc"
  }
}

resource "aws_internet_gateway" "uhura_gateway" {
  vpc_id = aws_vpc.uhura_vpc.id

  tags = {
    Name = "uhura:gateway"
  }
}

resource "aws_subnet" "uhura_subnet_private" {
  vpc_id                  = aws_vpc.uhura_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = false
  availability_zone       = "us-west-1b"

  tags = {
    Name = "uhura:subnet:private"
  }
}

resource "aws_route_table" "uhura_route_table_private" {
  vpc_id = aws_vpc.uhura_vpc.id

  tags = {
    Name = "uhura:route_table:private"
  }
}

resource "aws_route_table_association" "uhura_route_table_association_private" {
  subnet_id      = aws_subnet.uhura_subnet_private.id
  route_table_id = aws_route_table.uhura_route_table_private.id
}

resource "aws_subnet" "uhura_subnet_public" {
  vpc_id                  = aws_vpc.uhura_vpc.id
  cidr_block              = "10.0.0.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-west-1b"

  tags = {
    Name = "uhura:subnet:public"
  }
}

resource "aws_route_table" "uhura_route_table_public" {
  vpc_id = aws_vpc.uhura_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.uhura_gateway.id
  }

  tags = {
    Name = "uhura:route_table:public"
  }
}

resource "aws_route_table_association" "uhura_route_table_association_public" {
  subnet_id      = aws_subnet.uhura_subnet_public.id
  route_table_id = aws_route_table.uhura_route_table_public.id
}

resource "aws_security_group" "uhura_sg_default" {
  name        = "uhura-sg-default"
  description = "Allows inbound and outbound traffic from the VPC"
  vpc_id      = aws_vpc.uhura_vpc.id
  depends_on  = [aws_vpc.uhura_vpc]

  tags = {
    Name = "uhura:sg-default"
  }
}

resource "aws_security_group_rule" "uhura_sgrule_inbound_allowSsh" {
  description = "Allow SSH"
  type        = "ingress"
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = [
    "${var.authorized_ip}/32",
    "${local.aws_ec2_instance_connect_cidr}"
  ]
  security_group_id = aws_security_group.uhura_sg_default.id
}

resource "aws_security_group_rule" "uhura_sgrule_inbound_allowHttp" {
  description       = "Allow HTTP"
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.uhura_sg_default.id
}

resource "aws_security_group_rule" "uhura_sgrule_inbound_allowHttps" {
  description       = "Allow HTTPS"
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.uhura_sg_default.id
}

resource "aws_security_group_rule" "uhura_sgrule_outbound_allowAll" {
  description       = "Allow all outbound traffic"
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.uhura_sg_default.id
}

# EC2 Instances
# ============================================================================

resource "aws_instance" "uhura_service_ec2" {
  ami                         = var.ami
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.uhura_subnet_public.id
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.uhura_sg_default.id]

  root_block_device {
    delete_on_termination = true
    volume_size           = 50
    volume_type           = "gp2"
  }

  depends_on = [aws_security_group.uhura_sg_default]

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io
              sudo docker run -d -p 3000:3000 525999333867.dkr.ecr.us-west-1.amazonaws.com/uhura-service:latest
              EOF

  tags = {
    Name = "uhura-service:ec2"
  }
}

resource "aws_instance" "uhura_client_ec2" {
  ami                         = var.ami
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.uhura_subnet_public.id
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.uhura_sg_default.id]

  root_block_device {
    delete_on_termination = true
    volume_size           = 50
    volume_type           = "gp2"
  }

  depends_on = [aws_security_group.uhura_sg_default]

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y docker.io
              sudo docker run -d -p 3000:3000 525999333867.dkr.ecr.us-west-1.amazonaws.com/uhura-client:latest
              EOF

  tags = {
    Name = "uhura-client:ec2"
  }

}

# IAM
# ============================================================================

resource "aws_iam_instance_profile" "uhura_iam_profile_ec2" {
  name = "uhura-instance-profile-ec2"
  role = aws_iam_role.uhura_iam_role_ec2.name
}

resource "aws_iam_role" "uhura_iam_role_ec2" {
  name               = "uhura-role-ec2"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "uhura_iam_role_policy_attachment_ec2" {
  role       = aws_iam_role.uhura_iam_role_ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# resource "aws_instance" "uhura_client" {
#   ami           = var.ami
#   instance_type = "t2.micro"
#   # key_name      = var.key_name
#   # subnet_id     = var.subnet_id

#   vpc_security_group_ids = [aws_security_group.allow_http.id]

#   tags = {
#     Name = "uhura-client"
#   }

#   provisioner "local-exec" {
#     command = "echo ${aws_instance.uhura_client.public_ip} > client_ip.txt"
#   }
# }
