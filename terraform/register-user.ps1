$POOL_ID = "eu-west-1_WcW3kR08r"
$CLIENT_ID = "7568rr42q5v2lapj9rr87njs4m"
$USER_NAME = "Testington"
$NAME = "TestName"
$PASSWORD = "P@55w0rd!23"
$EMAIL = "testing@test.com"
$REGION = "eu-west-1"
$AWSPROFILE = "drd_dev"
aws cognito-idp sign-up --profile $AWSPROFILE --region $REGION --client-id $CLIENT_ID --username $USER_NAME --password $PASSWORD --user-attributes Name=name,Value=$NAME Name=email,Value=$EMAIL
aws cognito-idp admin-confirm-sign-up --profile $AWSPROFILE --region $REGION --user-pool-id $POOL_ID --username $USER_NAME