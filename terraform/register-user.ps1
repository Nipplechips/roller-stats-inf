$POOL_ID = "eu-west-1_PaU3VooNR"
$CLIENT_ID = "1dh84sf5081qskgo3f9e0ghkoc"
$USER_NAME = "Testington"
$NAME = "TestName"
$PASSWORD = "P@55w0rd!23"
$EMAIL = "testing@test.com"
$REGION = "eu-west-1"
$AWSPROFILE = "drd_dev"
aws cognito-idp sign-up --profile $AWSPROFILE --region $REGION --client-id $CLIENT_ID --username $USER_NAME --password $PASSWORD --user-attributes Name=name,Value=$NAME Name=email,Value=$EMAIL
aws cognito-idp admin-confirm-sign-up --profile $AWSPROFILE --region $REGION --user-pool-id $POOL_ID --username $USER_NAME