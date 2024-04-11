function apiResponse(data:any, err?: any, responseCode?: number){
    return {
		statusCode: responseCode || 200,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify( err || data)
	};
}

export {
    apiResponse
};