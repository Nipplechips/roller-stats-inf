module "global_settings_apiv2"{
    source = "../global_constants"
}

 module "api_gateway" {
  source = "terraform-aws-modules/apigateway-v2/aws"

  name          = "${module.global_settings_apiv2.deployment_name_and_stage}"
  description   = "Roller Stats HTTP API Gateway"
  protocol_type = "HTTP"

  cors_configuration = {
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
    allow_methods = ["*"]
    allow_origins = ["*"]
  }

  # Custom domain
  create_api_domain_name = false
  # domain_name                 = "terraform-aws-modules.modules.tf"
  # domain_name_certificate_arn = "arn:aws:acm:eu-west-1:052235179155:certificate/2b3a7ed9-05e1-4f9e-952b-27744ba06da6"

  # Access logs
  create_default_stage_access_log_group = true
  default_stage_access_log_group_retention_in_days = 7
  default_stage_access_log_format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId $context.integrationErrorMessage"

  # Routes and integrations
  integrations = {
      "POST /statbook/footage" = {
      lambda_arn             = module.link_footage_with_statbook.lambda_function_arn
      payload_format_version = "2.0"
    }

    "POST /statbook" = {
      lambda_arn             = module.update_statbook_metadata.lambda_function_arn
      payload_format_version = "2.0"
    }

    "GET /statbook" = {
      lambda_arn = module.lambda_function_get_statbooks.lambda_function_arn
      detailed_metrics_enabled = true
      authorizer_key = "cognito"
      authorization_type = "JWT"
      authorizer_type = "JWT"      
    }

    # "$default" = {
    #   lambda_arn = module.lambda_function_get_statbooks.lambda_function_arn
    # }
  }

  authorizers = {
    "cognito" = {
      authorizer_type  = "JWT"
      identity_sources = ["$request.header.Authorization"]
      name             = "${module.global_settings_apiv2.deployment_stage}-apigw-userpool-jwt-authorizer"
      audience         = [var.userpool_client_id]
      issuer           = "https://${var.userpool_endpoint}"
    }
  }

}

resource "aws_iam_policy" "lambda_execution_policy" {
  name="roller-stats-api-lambda-execution-policy"
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
       {
            "Effect": "Allow",
            "Action": [
                "execute-api:ManageConnections"
            ],
            "Resource": "arn:aws:execute-api:eu-west-1:730335293816:xo75rwpe9i/*"
        },
    ]
  })
}

module "lambda_function_get_statbooks" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${module.global_settings_apiv2.deployment_name_and_stage}-get-statbooks"
  s3_bucket        = module.global_settings_apiv2.lambda_builds_bucket_name
  handler       = "statbook/get/handler.handler"
  runtime = module.global_settings_apiv2.default_lambda_runtime

  source_path = "../code/dist"

  store_on_s3 = true
  publish = true
  layers = [
    var.node_modules_layer_arn,
  ]

  attach_policy = true
  policy = aws_iam_policy.lambda_execution_policy.arn

  cloudwatch_logs_retention_in_days = 7

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  environment_variables = {
    asset_bucket_name = "${module.global_settings_apiv2.application_assets_bucket_name}"
  }
}

module "update_statbook_metadata" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${module.global_settings_apiv2.deployment_name_and_stage}-update-statbook-metadata"
  s3_bucket        = module.global_settings_apiv2.lambda_builds_bucket_name
  handler       = "statbook/put/handler.handler"
  runtime = module.global_settings_apiv2.default_lambda_runtime

  source_path = "../code/dist"

  store_on_s3 = true
  publish = true
  layers = [
    var.node_modules_layer_arn,
  ]

  attach_policy = true
  policy = aws_iam_policy.lambda_execution_policy.arn

  cloudwatch_logs_retention_in_days = 7

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  environment_variables = {
    asset_bucket_name = "${module.global_settings_apiv2.application_assets_bucket_name}"
  }
}

module "link_footage_with_statbook" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "${module.global_settings_apiv2.deployment_name_and_stage}-link-footage-with-statbook"
  s3_bucket        = module.global_settings_apiv2.lambda_builds_bucket_name
  handler       = "statbook/footage/put/handler.handler"
  runtime = module.global_settings_apiv2.default_lambda_runtime
  timeout = 180
  memory_size = 512

  source_path = "../code/dist"

  store_on_s3 = true
  publish = true
  layers = [
    var.node_modules_layer_arn,
  ]

  attach_policy = true
  policy = aws_iam_policy.lambda_execution_policy.arn

  cloudwatch_logs_retention_in_days = 7

  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service    = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }

  environment_variables = {
    asset_bucket_name = "${module.global_settings_apiv2.application_assets_bucket_name}"
  }
}