variable "name" {
  type        = string
  description = "The name of the Lambda function"
}
variable "source_code_hash" {
  type        = string
  description = "SHA Hash of source code used to determine changes"
}

variable "lambda_execution_role_arn" {
  type = string
}

variable "env_vars" {
  type = any
}

variable "handler_config" {
    type = object({
        s3_bucket = string,
        s3_key = string
        handler = optional(string, "test/handler")
        timeout = optional(number, 5)
        memory_size = optional(number, 128)
        runtime = optional(string, "nodejs16.x")
    })
}
