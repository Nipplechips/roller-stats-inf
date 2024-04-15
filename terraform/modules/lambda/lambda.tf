# using archive_file data source to zip the lambda code
module "global_settings" {
  source = "../global_constants"
}

data "archive_file" "lambda_code" {
  type        = "zip"
  source_dir  = "../code/dist"
  output_path = "${path.module}/function_code.zip"
}

# Make an s3 object which is the zipped code base
resource "aws_s3_object" "lambda_code" {
  bucket = var.code_deployment_bucket_name
  key    = "function_code.zip"
  source = data.archive_file.lambda_code.output_path
  etag   = filemd5(data.archive_file.lambda_code.output_path)

  depends_on = [
    data.archive_file.lambda_code
  ]
}

# role allowing lambda to assume roles
resource "aws_iam_role" "lambda_execution_role" {
  name = "roller-stats-lambda-assume-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_policy" "policy" {
  name="roller-stats-lambda-execution-policy"
  description = "Policy required for cloud tasks"
  policy =  jsonencode({
    Version = "2012-10-17"
    Statement = [
        {
            "Effect": "Allow",
            "Action": [
                "logs:*"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        },
      {
        Action = [
          "cognito-idp:AdminGetUser",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "s3:*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}
# ???
resource "aws_iam_role_policy_attachment" "aws_lambda_basic_execution_role_attachment" {
  role=aws_iam_role.lambda_execution_role.name
  policy_arn=aws_iam_policy.policy.arn
}

resource "aws_lambda_function" "convert_statbook_to_json_lambda_function" {
  function_name    = "${module.global_settings.deployment_name_and_stage}_s3event-convert-statbook-to-json"
  s3_bucket        = var.code_deployment_bucket_name
  s3_key           = aws_s3_object.lambda_code.key
  handler          = "statbook/s3_handler.s3Handler"
  source_code_hash = data.archive_file.lambda_code.output_base64sha256
  role             = aws_iam_role.lambda_execution_role.arn
  runtime          = "nodejs16.x"
  timeout = 30
  memory_size = 256
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.convert_statbook_to_json_lambda_function.arn
  principal     = "s3.amazonaws.com"
  source_arn    = var.app_asset_bucket_arn
}

resource "aws_cloudwatch_log_group" "lambda_fn_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.convert_statbook_to_json_lambda_function.function_name}"
  retention_in_days = 7
}

resource "null_resource" "wait_for_lambda_trigger" {
  depends_on   = [aws_lambda_permission.allow_bucket]

}
resource "aws_s3_bucket_notification" "xlsx_object_bucket_notification" {
  bucket = var.app_asset_bucket_name

  lambda_function {
    lambda_function_arn = aws_lambda_function.convert_statbook_to_json_lambda_function.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix = ".xlsx"
  }

  depends_on = [
    null_resource.wait_for_lambda_trigger,
    aws_lambda_function.convert_statbook_to_json_lambda_function,
    aws_lambda_permission.allow_bucket
  ]
}
