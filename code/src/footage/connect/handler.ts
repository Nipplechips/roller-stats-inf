export const handler = async (event:any, context:any) => {
    console.log("Node path:", process.env.NODE_PATH);
    console.log("Client connected to websocket:")
    console.log(JSON.stringify({event, context}));    
    
    return {statusCode: 200};
};