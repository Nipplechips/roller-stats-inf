module "global_settings" {
  source = "../global_constants"
}

data "archive_file" "lambda_code" {
  type        = "zip"
  source_dir  = "../code/dist"
  output_path = "${path.module}/function_code.zip"

  depends_on = [null_resource.dummy_trigger, null_resource.node_modules_layer_packaging]
}

data "archive_file" "node_modules" {
  type        = "zip"
  source_dir  = "../code/nodejs"
  output_path = "${path.module}/dependencies.zip"

  depends_on = [null_resource.dummy_trigger, null_resource.node_modules_layer_packaging]
}

resource "aws_lambda_layer_version" "node_modules" {
	  layer_name       = "${module.global_settings.deployment_name_and_stage}-node_modules_layer"
	  description      = "node_modules layer for application functions"
	  s3_bucket        = var.code_deployment_bucket_name
	  s3_key           = "dependencies.zip"
	  source_code_hash = data.archive_file.node_modules.output_base64sha256
	
	  compatible_runtimes = ["nodejs16.x"]
	  depends_on = [
	    aws_s3_object.node_modules,
	  ]
}
# Dummy resource to ensure archive is created at apply stage
resource null_resource dummy_trigger {
  triggers = {
    timestamp = timestamp()
  }
}
resource "null_resource" "node_modules_layer_packaging" {
	  triggers = {
	    updated_at = timestamp()
	  }
	

	  provisioner "local-exec" {
	    command = <<EOF
	    npm run build
	    EOF

	    working_dir = "./"
	  }
}

# Make an s3 object which is the node_modules dependencies zip
resource "aws_s3_object" "node_modules" {
  bucket = var.code_deployment_bucket_name
  key    = "dependencies.zip"
  source = data.archive_file.node_modules.output_path
  etag   = filemd5(data.archive_file.node_modules.output_path)

  depends_on = [
    null_resource.node_modules_layer_packaging,
    data.archive_file.node_modules
  ]
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

# Role which allows API Gateway to write to CloudWatch logs
resource "aws_api_gateway_account" "main" {
  cloudwatch_role_arn = aws_iam_role.api_gateway_logging_role.arn
}
resource "aws_iam_role" "api_gateway_logging_role" {
  name = "api-gateway-logs-role"
  assume_role_policy = jsonencode({
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
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
resource "aws_iam_role_policy_attachment" "aws_api_gateway_logging_role_attachment" {
  role=aws_iam_role.api_gateway_logging_role.name
  policy_arn="arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
}
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


resource "aws_lambda_function" "connect" {
  
  function_name = "${module.global_settings.deployment_name_and_stage}-footagereview-connect"
  s3_bucket        = var.code_deployment_bucket_name
  s3_key           = aws_s3_object.lambda_code.key
  source_code_hash = data.archive_file.lambda_code.output_base64sha256
  handler       = "footage/connect/handler.handler"
  layers = [aws_lambda_layer_version.node_modules.arn]
  role             = aws_iam_role.lambda_execution_role.arn
  runtime       = "nodejs16.x"
  depends_on    = [aws_iam_role_policy_attachment.aws_lambda_basic_execution_role_attachment]
}

resource "aws_lambda_function" "SendMessage" {
  function_name = "${module.global_settings.deployment_name_and_stage}-footagereview-sendmessage"
  s3_bucket        = var.code_deployment_bucket_name
  s3_key           = aws_s3_object.lambda_code.key
  source_code_hash = data.archive_file.lambda_code.output_base64sha256
  role             = aws_iam_role.lambda_execution_role.arn
  handler       = "test/handler.handler"
  runtime       = "nodejs16.x"
  depends_on    = [aws_iam_role_policy_attachment.aws_lambda_basic_execution_role_attachment]
}

resource "aws_lambda_function" "disconnect" {
  function_name = "${module.global_settings.deployment_name_and_stage}-footagereview-disconnect"
  s3_bucket        = var.code_deployment_bucket_name
  s3_key           = aws_s3_object.lambda_code.key
  source_code_hash = data.archive_file.lambda_code.output_base64sha256
  role             = aws_iam_role.lambda_execution_role.arn
  handler       = "test/handler.handler"
  runtime       = "nodejs16.x"
  depends_on    = [aws_iam_role_policy_attachment.aws_lambda_basic_execution_role_attachment]
}

resource "aws_lambda_function" "Broadcast" {
  function_name = "${module.global_settings.deployment_name_and_stage}-footagereview-broardcast"
  s3_bucket        = var.code_deployment_bucket_name
  s3_key           = aws_s3_object.lambda_code.key
  source_code_hash = data.archive_file.lambda_code.output_base64sha256
  role             = aws_iam_role.lambda_execution_role.arn
  handler       = "test/handler.handler"
  runtime       = "nodejs16.x"
  depends_on    = [aws_iam_role_policy_attachment.aws_lambda_basic_execution_role_attachment]
}

resource "aws_cloudwatch_log_group" "connect_logs" {
  name              = "/aws/lambda/${aws_lambda_function.connect.function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "sendmessage_logs" {
  name              = "/aws/lambda/${aws_lambda_function.SendMessage.function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "disconnect_logs" {
  name              = "/aws/lambda/${aws_lambda_function.disconnect.function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "broadcast_logs" {
  name              = "/aws/lambda/${aws_lambda_function.Broadcast.function_name}"
  retention_in_days = 7
}
