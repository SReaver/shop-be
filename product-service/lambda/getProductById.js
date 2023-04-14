import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { validate as uuidValidate } from 'uuid';

import { ddbDocClient } from "../libs/ddbDocClient.js";
import { setRespose, getSearchParams } from '../libs/utils.js'

export const getProductById = async (event) => {
	const { pathParameters: { id } } = event;
	if (!uuidValidate(id)) {
		return setRespose(400, {
			message: `Incorrect format of id: ${id}`
		})
	}

	const paramsProduct = getSearchParams('products', 'id', id);
	const paramsStock = getSearchParams('stocks', 'product_id', id);

	return Promise.all([
		ddbDocClient.send(new GetCommand(paramsProduct)),
		ddbDocClient.send(new GetCommand(paramsStock))
	])
		.then(([productItem, stockItem]) => {
			const { Item: product } = productItem;
			const { Item: stock } = stockItem;

			if (!product || !stock) {
				return setRespose(404, {
					message: 'Product not found'
				})
			} else {
				return setRespose(200, { ...product, count: stock.count })
			}
		})
		.catch(err => {
			return setRespose(500, {
				message: err.message
			})
		})
}