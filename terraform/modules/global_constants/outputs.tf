variable "region" {
  type        = string
  description = "The region in which to create/manage resources"
  default     = "eu-west-1"
}
#  770653959623
variable "account_id" {
  type        = string
  description = "The account ID in which to create/manage resources"
  default     = "730335293816"
}

variable "deployment_name"{
    type = string
    default="rollerstats"
}
variable "deployment_stage"{
    type = string
    default="dev"
}

# OUTPUT
output "deployment_stage"{
    value = var.deployment_stage
}
output "deployment_name"{
    value = var.deployment_name
}

output "deployment_name_and_stage"{
  value = "${var.deployment_name}-${var.deployment_stage}"
}

output "region"{
    value = var.region
}

output "account_id"{
  value = var.account_id
}