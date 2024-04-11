import { Handler } from 'aws-lambda';
import {jwtDecode} from 'jwt-decode'



export const handler: Handler = async (event, context) => {
    console.log("Testing:")
    console.log({event, context});

    const tokenDecode: any = jwtDecode(event.headers.Authorization);
    console.log("JWT Token", tokenDecode);

    return  {
        statusCode: 200,
        body: JSON.stringify('Welcome to Tile View ' + tokenDecode.email || tokenDecode.sub + "!"),
    };
};