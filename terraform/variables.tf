variable "aws_account_id" {
  description = "AWS account ID to be referenced when creating resources"
  type        = string
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
}

variable "ami" {
  description = "AMI to use for EC2 instances"
  type        = string
}

variable "authorized_ip" {
  description = "IP address to authorize for SSH access"
  type        = string
}
