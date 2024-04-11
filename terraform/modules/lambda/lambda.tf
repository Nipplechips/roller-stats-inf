# using archive_file data source to zip the lambda code
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
#  etag   = filemd5(data.archive_file.lambda_code.output_path)

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
    ]
  })
}
# ???
resource "aws_iam_role_policy_attachment" "aws_lambda_basic_execution_role_attachment" {
  role=aws_iam_role.lambda_execution_role.name
  policy_arn=aws_iam_policy.policy.arn
}
