export const setRespose = (code, body) => ({
	headers: {
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
	statusCode: code,
	body: JSON.stringify(body),
	isBase64Encoded: false
})