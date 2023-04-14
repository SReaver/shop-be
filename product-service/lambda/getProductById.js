import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { validate as uuidValidate } from 'uuid';
import { ddbClient } from "../ddbClient.js";

const setRespose = (code, body) => ({
	headers: {
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
	},
	statusCode: code,
	body: JSON.stringify(body),
	isBase64Encoded: false
})

const returnParams = (tableName, key, id) => (
	{
		TableName: tableName,
		Key: {
			[key]: { S: id }
		}
	}
);

export const getProductById = async (event) => {
	const { pathParameters: { id }} = event;
	if (!uuidValidate(id)) {
		return setRespose(404, {
			message: `Incorrect id: ${id}`
		})
	}

	const paramsProduct = returnParams('products', 'id', id);
	const paramsStock = returnParams('stocks', 'product_id', id);

	return Promise.all([
		ddbClient.send(new GetItemCommand(paramsProduct)),
		ddbClient.send(new GetItemCommand(paramsStock))
	])
		.then(([productItem, stockItem]) => {
			if (!productItem?.Item || !stockItem?.Item) {
				return setRespose(404, {
					message: 'Product not found'
				})
			} else {
				return setRespose(200, {
					body: JSON.stringify(Object.assign(productItem.Item, stockItem.Item))
				})
			}
		})
		.catch(err => {
			return setRespose(500, {
				message: err.message
			})
		})
}