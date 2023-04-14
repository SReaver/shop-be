import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient.js";
import { setRespose } from '../libs/utils.js'

export const getProductList = async () => {
	try {
		const { Items: products } = await ddbDocClient.send(new ScanCommand({ TableName: "products" }));
		const { Items: stocks } = await ddbDocClient.send(new ScanCommand({ TableName: "stocks" }));

		for (const product of products) {
			const findedProductInStock = stocks.find(stock => stock.product_id === product.id);
			product.count = findedProductInStock.count;
			if (!findedProductInStock) {
				return setRespose(404, { message: 'Cannot find product in stock' })
			}
		}
		return setRespose(200, products);
	} catch (error) {
		return setRespose(500, error.message);
	}
}