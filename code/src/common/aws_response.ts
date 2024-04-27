function apiResponse(data:any, err?: any, responseCode?: number){
    return {
		statusCode: responseCode || 200,
		headers: {
			"Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,PUT,GET"
		},
		body: JSON.stringify( err || data)
	};
}

export {
    apiResponse
};