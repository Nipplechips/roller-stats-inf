variable "code_deployment_bucket_name" {
  type        = string
  description = "The NAME of the S3 bucket to store the Lambda function code"
}
variable "app_asset_bucket_name" {
  type        = string
  description = "The NAME of the S3 bucket to store application assets"
}
variable "app_asset_bucket_arn" {
  type        = string
  description = "The NAME of the S3 bucket to store application assets"
}
variable "table_stream_arn" {
  type = string
}
variable "db_table_name" {
  type = string
}