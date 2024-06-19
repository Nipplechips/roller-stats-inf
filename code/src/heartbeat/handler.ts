export const handler = async (event:any, context:any) => {
    console.log("Testing:")
    console.log(JSON.stringify({event, context}));
    return {
        statusCode: 200,
        body: JSON.stringify(event),
    };
};