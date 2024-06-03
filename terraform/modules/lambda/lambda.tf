module "global_settings" {
  source = "../global_constants"
}

resource "aws_iam_policy" "lambda_execution_policy" {
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
          "s3:*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

module "lambda_layer_node_modules" {
  source = "terraform-aws-modules/lambda/aws"

  create_layer = true

  layer_name          = "${module.global_settings.deployment_name_and_stage}-node_modules_layer"
  description         = "node_modules layer for application functions"
  compatible_runtimes = ["nodejs16.x"]

  source_path = "../code/dependencies"

  store_on_s3 = true
  s3_bucket   = module.global_settings.lambda_builds_bucket_name
}

module "convert_statbook_to_json_lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${module.global_settings.deployment_name_and_stage}-convert-statbook-to-json"
  s3_bucket        = module.global_settings.lambda_builds_bucket_name
  handler       = "statbook/s3_handler.s3Handler"
  runtime       = "nodejs16.x"
  timeout = 30
  memory_size = 256

  source_path = "../code/dist"

  store_on_s3 = true
  publish = true
  layers = [
    module.lambda_layer_node_modules.lambda_layer_arn,
  ]

  attach_policy = true
  policy = aws_iam_policy.lambda_execution_policy.arn

  cloudwatch_logs_retention_in_days = 7

  environment_variables = {
    asset_bucket_name = "${module.global_settings.application_assets_bucket_name}"
  }
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "${module.convert_statbook_to_json_lambda_function.lambda_function_name}-AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.convert_statbook_to_json_lambda_function.lambda_function_name
  principal     = "s3.amazonaws.com"
  source_arn    = var.app_asset_bucket_arn
}

resource "null_resource" "wait_for_lambda_trigger" {
  depends_on   = [aws_lambda_permission.allow_bucket]
}
resource "aws_s3_bucket_notification" "xlsx_object_bucket_notification" {
  bucket = var.app_asset_bucket_name

  lambda_function {
    lambda_function_arn = module.convert_statbook_to_json_lambda_function.lambda_function_arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix = ".xlsx"
  }

  depends_on = [
    null_resource.wait_for_lambda_trigger,
    module.convert_statbook_to_json_lambda_function,
    aws_lambda_permission.allow_bucket
  ]
}