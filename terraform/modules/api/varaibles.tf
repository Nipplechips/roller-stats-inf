variable "userpool_client_id" {
  type = string
}
variable "userpool_endpoint" {
  type = string
}
variable "lambda_execution_role_arn" {  
  type = string  
}
variable "node_modules_layer_arn" {
  type = string
}
variable "source_code_hash" {
  type = string
}