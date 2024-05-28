import { Handler } from 'aws-lambda';
import { jwtDecode } from 'jwt-decode'



export const handler: Handler = async (event, context) => {
    console.log("Testing:")
    console.log(JSON.stringify({event, context}));

    try {
        const tokenDecode: any = jwtDecode(event.headers.Authorization);
        console.log("JWT Token", tokenDecode);

        console.log("Query params:", JSON.stringify(event.queryStringParameters));
        console.log("Event body", JSON.parse(event.body));
    } catch (error) {
        console.warn("Nothing to do with this error in a test handler", error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify('Welcome to the API'),
    };
};