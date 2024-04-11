resource "aws_lambda_function" "lambda_function" {
  function_name    = var.name
  s3_bucket        = var.handler_config.s3_bucket
  s3_key           = var.handler_config.s3_key
  handler          = var.handler_config.handler
  source_code_hash = var.source_code_hash
  role             = var.lambda_execution_role_arn
  runtime          = var.handler_config.runtime
  timeout = 5
  environment {
    variables = var.env_vars
  }
}

resource "aws_cloudwatch_log_group" "lambda_fn_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_function.function_name}"
  retention_in_days = 7
}