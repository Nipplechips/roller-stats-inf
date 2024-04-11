output "lambda_execution_role_arn" { 
  value = aws_iam_role.lambda_execution_role.arn 
}

output "source_code_hash" {
  value = data.archive_file.lambda_code.output_base64sha256
}

output "handler_code_key" {
  value = aws_s3_object.lambda_code.key
}