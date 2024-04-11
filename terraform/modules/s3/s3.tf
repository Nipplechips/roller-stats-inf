
# Bucket for application to store/retrieve assets
resource "aws_s3_bucket" "asset_bucket" {
  bucket = var.s3_assets_bucket_name
}
# making the s3 bucket private as it houses the lambda code:
resource "aws_s3_bucket_public_access_block" "acl_blockpublic_assets" {
  bucket = aws_s3_bucket.asset_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
resource "aws_s3_bucket_ownership_controls" "acl_preferowner_assets" {
  bucket = aws_s3_bucket.asset_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}
resource "aws_s3_bucket_acl" "lambda_bucket_acl" {
  depends_on = [
	aws_s3_bucket_public_access_block.acl_blockpublic_assets,
	aws_s3_bucket_ownership_controls.acl_preferowner_assets,
  ]

  bucket = aws_s3_bucket.asset_bucket.id
  acl    = "private"
}


# An s3 bucket to store code assets in
resource "aws_s3_bucket" "code_deploy_bucket" {
  bucket = var.s3_code_deployment_bucket_name
}

# making the s3 bucket private as it houses the lambda code
resource "aws_s3_bucket_public_access_block" "acl_blockpublic_code" {
  bucket = aws_s3_bucket.code_deploy_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}
resource "aws_s3_bucket_ownership_controls" "acl_preferowner_code" {
  bucket = aws_s3_bucket.code_deploy_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}
resource "aws_s3_bucket_acl" "code_deploy_bucket_acl" {
  depends_on = [
    aws_s3_bucket_public_access_block.acl_blockpublic_code,
    aws_s3_bucket_ownership_controls.acl_preferowner_code,
  ]

  bucket = aws_s3_bucket.code_deploy_bucket.id
  acl    = "private"
}