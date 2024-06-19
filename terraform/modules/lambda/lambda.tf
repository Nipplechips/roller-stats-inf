module "global_settings" {
  source = "../global_constants"
}

resource "aws_iam_policy" "lambda_execution_policy" {
  name        = "roller-stats-lambda-execution-policy"
  description = "Policy required for cloud tasks"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:*"
        ],
        "Resource" : "arn:aws:logs:*:*:*"
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
  compatible_runtimes = [module.global_settings.default_lambda_runtime]

  source_path = [
    {
      path : "../code/node_modules"
      prefix_in_zip = "nodejs/node_modules"
    }
  ]

  store_on_s3 = true
  s3_bucket   = module.global_settings.lambda_builds_bucket_name
}

module "convert_statbook_to_json_lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${module.global_settings.deployment_name_and_stage}-convert-statbook-to-json"
  s3_bucket     = module.global_settings.lambda_builds_bucket_name
  handler       = "statbook/s3_handler.s3Handler"
  runtime       = module.global_settings.default_lambda_runtime
  timeout       = 30
  memory_size   = 256

  source_path = "../code/dist"

  store_on_s3 = true
  publish     = true
  layers = [
    module.lambda_layer_node_modules.lambda_layer_arn,
  ]

  attach_policy = true
  policy        = aws_iam_policy.lambda_execution_policy.arn

  cloudwatch_logs_retention_in_days = 7

  environment_variables = {
    asset_bucket_name = "${module.global_settings.application_assets_bucket_name}"
  }
}

module "consume_dynamodb_activity_stream" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${module.global_settings.deployment_name_and_stage}-consume-dynamodb-activity-stream"
  s3_bucket     = module.global_settings.lambda_builds_bucket_name
  handler       = "dynamodb/consume_stream/handler.handler"
  runtime       = module.global_settings.default_lambda_runtime

  source_path = [
    {
      path : "../code/dist/dynamodb/consume_stream",
      prefix_in_zip = "dynamodb/consume_stream"
    },
    {
      path : "../code/dist/common"
      prefix_in_zip = "common"
    }
  ]

  store_on_s3 = true
  publish     = true
  layers = [
    module.lambda_layer_node_modules.lambda_layer_arn
  ]

  attach_policy = true
  policy        = aws_iam_policy.lambda_execution_policy.arn
  # attach_policy_statements = true
  # policy_statements = {
  #   s3_read = {
  #     effect    = "Allow",
  #     actions   = ["s3:HeadObject", "s3:GetObject"],
  #     resources = ["arn:aws:s3:::${module.global_settings_socket_api.application_assets_bucket_name}/*"]
  #   },
  #    dynamo_put = {
  #     effect    = "Allow",
  #     actions   = ["dynamodb:PutItem"],
  #     resources = ["${var.db_table_arn}"]
  #   }
  # }

  cloudwatch_logs_retention_in_days = 7

  event_source_mapping = {
    dynamodb = {
      event_source_arn           = var.table_stream_arn
      starting_position          = "LATEST"
      # filter_criteria = [
      #   {
      #     pattern = jsonencode({
      #       eventName : ["INSERT"]
      #     })
      #   },
      #   {
      #     pattern = jsonencode({
      #       data : {
      #         Temperature : [{ numeric : [">", 0, "<=", 100] }]
      #         Location : ["Oslo"]
      #       }
      #     })
      #   }
      # ]
    }
  }

  allowed_triggers = {
    dynamodb = {
      principal  = "dynamodb.amazonaws.com"
      source_arn = var.table_stream_arn
    }
  }

  environment_variables = {
    table_name = "${var.db_table_name}"
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
  depends_on = [aws_lambda_permission.allow_bucket]
}
resource "aws_s3_bucket_notification" "xlsx_object_bucket_notification" {
  bucket = var.app_asset_bucket_name

  lambda_function {
    lambda_function_arn = module.convert_statbook_to_json_lambda_function.lambda_function_arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".xlsx"
  }

  depends_on = [
    null_resource.wait_for_lambda_trigger,
    module.convert_statbook_to_json_lambda_function,
    aws_lambda_permission.allow_bucket
  ]
}
