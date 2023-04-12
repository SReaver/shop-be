import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "../ddbClient.js";

const returnParams = (id) => ({
  TableName: "products",
  Key: {
    KEY_NAME: { N: "id" },
  },
  ProjectionExpression: id,
});

export const getProductById = async (event) => {
	const { pathParameters: { id }} = event;
	const params = returnParams(id)
	const findedProduct = await ddbClient.send(new GetItemCommand(params));
	const headers = {
		"Access-Control-Allow-Credentials": true,
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	}
	return { 
		headers,
		statusCode: 200,
		body: JSON.stringify({
			message: id
		})
	}
	if (!findedProduct){
		return { 
			headers,
			statusCode: 404,
			body: JSON.stringify({
				message: 'Product not found'
			})
		}
	} else {
		return {
			headers,
			statusCode: 200,
			body:	JSON.stringify(findedProduct)
		};
	}
}