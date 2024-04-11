output "asset_bucket_arn" {
  value = aws_s3_bucket.asset_bucket.arn
}

output "asset_bucket_name" {
  value = var.s3_assets_bucket_name
}

output "code_bucket_arn" {
  value = aws_s3_bucket.code_deploy_bucket.arn
}

output "code_bucket_id" {
  value = aws_s3_bucket.code_deploy_bucket.id
}

output "code_bucket_name" {
  value = var.s3_code_deployment_bucket_name
}

