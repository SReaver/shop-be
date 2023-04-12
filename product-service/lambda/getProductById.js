import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "../ddbClient.js";

const headers = {
	"Access-Control-Allow-Credentials": true,
	"Access-Control-Allow-Origin": "*",
	"Content-Type": "application/json",
}

const returnParams = (id) => (
 {
		TableName: "products",
		Key: {
			'id': {S: id}
		}
	}
);

export const getProductById = async (event) => {
	const { pathParameters: { id }} = event;
	const params = returnParams(id)
	let findedProduct;

	try {
		findedProduct = await ddbClient.send(new GetItemCommand(params));
	} catch (error) {
		return { 
			headers,
			statusCode: 500,
			body: JSON.stringify({
				message: error.message,
				id
			})
		}
	}

	if (!findedProduct?.Item){
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
			body:	JSON.stringify(findedProduct.Item)
		};
	}
}