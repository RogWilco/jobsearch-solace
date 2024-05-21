variable "aws_account_id" {
  description = "AWS account ID to be referenced when creating resources"
  type        = string
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
}

variable "aws_default_availability_zone" {
  description = "AWS Default Availability Zone"
  type        = string
}

variable "aws_access_key" {
  description = "AWS Access Key ID"
  type        = string
}

variable "aws_secret_key" {
  description = "AWS Secret Access Key"
  type        = string
  sensitive   = true
}

variable "ami" {
  description = "AMI to use for EC2 instances"
  type        = string
}

variable "authorized_ip" {
  description = "IP address to authorize for SSH access"
  type        = string
}

variable "client_url" {
  description = "URL at which the client can be reached"
  type        = string
}

variable "client_port" {
  description = "Port for the client to listen on"
  type        = number
  default     = 80
}

variable "service_url" {
  description = "URL for the client to connect to the service"
  type        = string
}

variable "service_port" {
  description = "Port for the service to listen on"
  type        = number
  default     = 80
}

variable "db_port" {
  description = "Port for the RDS database"
  type        = number
  default     = 5432
}

variable "db_name" {
  description = "Name of the default RDS database"
  type        = string
  default     = "uhura"
}

variable "db_username" {
  description = "Username for the RDS database"
  type        = string
  default     = "uhura"
}

variable "db_password" {
  description = "Password for the RDS database"
  type        = string
  sensitive   = true
}
