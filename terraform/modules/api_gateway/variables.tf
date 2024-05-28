variable "api_name"{
    type = string
    description = "Name of the API Gateway created"
    default = "rollerstats-api"
}
variable "api_gateway_region" {
  type        = string
  description = "The region in which to create/manage resources"
} //value comes from main.tf
variable "api_gateway_account_id" {
  type        = string
  description = "The account ID in which to create/manage resources"
} //value comes from main.tf
variable "rest_api_stage_name" {
  type        = string
  description = "The name of the API Gateway stage"
}

variable "handler_code_bucket_name"{
  type = string
}
variable "handler_code_key"{
  type = string
}

variable "asset_bucket_name"{
  type = string
}
variable "asset_bucket_arn"{
  type = string
}
variable "userpool_id"{
  type = string
}

variable "lambda_execution_role_arn"{
  type = string
}


variable "source_code_hash"{
  type=string
}

variable "authorizer_arn"{
  type=string
}

variable "connect_integration_uri" {
  default = ""
}

variable "disconnect_integration_uri" {
  default = ""
}

variable "sendmessage_integration_uri" {
  default = ""
}

variable "connect_lambda_function_name" {
  default = ""
}

variable "sendmessage_lambda_function_name" {
  default = ""
}

variable "disconnect_lambda_function_name" {
  default = ""
}
