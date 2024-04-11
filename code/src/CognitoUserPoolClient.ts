
import { AdminGetUserCommand, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { IUserPoolClient } from "./common/aws/services/IUserPoolClient";

const client = new CognitoIdentityProviderClient({ region: "REGION" });
class CognitoUserPoolClient implements IUserPoolClient {

    private _userPoolId: string;
    constructor(userPoolId: string) {
        console.debug(`Creating CognitoUserPoolClient: ${userPoolId}`)
        this._userPoolId = userPoolId;
    }

    async getUserByUsername(username: string) {

        const command: AdminGetUserCommand = new AdminGetUserCommand({
            Username: username,
            UserPoolId: this._userPoolId
        }); 
        try {
            return await client.send(command);
        } catch (error) {
            console.error(error);
        }
    }
}

export { CognitoUserPoolClient }