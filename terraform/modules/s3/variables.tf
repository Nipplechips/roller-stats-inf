variable "s3_assets_bucket_name" {
  type        = string
  description = "The name of the S3 bucket to store assets"
  default     = "rollerstats-asset" // must be unique - change this to something unique
}
variable "s3_code_deployment_bucket_name" {
  type        = string
  description = "The name of the S3 bucket to store app code"
  default     = "rollerstats-code" // must be unique - change this to something unique
}