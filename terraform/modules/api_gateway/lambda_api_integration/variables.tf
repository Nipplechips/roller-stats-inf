variable "name"{
  type = string
}

variable "resource_id"{
    type = string
    description = "ID of rest api resource to attach lambda to"
}

variable "lambda_execution_role_arn" {
  type = string
}

variable "lambda_environment" {
  type = any
}

variable "source_code_hash" {
  type        = string
  description = "SHA Hash of source code used to determine changes"
}

variable "handler_config" {
    type = object({
        s3_bucket = string,
        s3_key = string
        handler = string,
        runtime = string #"nodejs16.x"
    })
}

variable "api_config" {
    type = object({
        api_id = string,
        http_method = string,
        http_path = string
    })
}

variable "auth_config" {
    type = object({
        authorization = string,
        authorizer_id = string
    })
    default = {
      authorization = "NONE",
      authorizer_id = ""
    }
}

