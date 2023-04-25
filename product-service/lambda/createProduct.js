import { PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { ddbDocClient } from "../libs/ddbDocClient.js";
import { setRespose } from '../libs/utils.js'

const getProductParams = (id, title, price, description) => ({
	TableName: "products",
	Item: {
		id,
		price,
		title,
		description
	},
});

export const createProduct = async (event) => {
	const { title, price, description, count } = JSON.parse(event.body);
	const id = uuidv4();

	try {
		await ddbDocClient.send(new PutCommand(getProductParams(id, title, price.toString(), description)))
	} catch (error) {
		return setRespose(500, {
			message: `Cannot save product: ${error.message}`
		})
	}


	try {
		await ddbDocClient.send(new PutCommand({ TableName: 'stocks', Item: { product_id: id, count: count.toString() } }))
	} catch (error) {
		try {
			await ddbDocClient.send(new DeleteCommand({ TableName: 'products', Key: { id } }))
		} catch (error) {
			return setRespose(500, {
				message: `Cannot delete product after unsuccessfull insert: ${error.message}`
			})
		}
		return setRespose(500, {
			message: `Cannot save product count in stock: ${error.message}`
		})
	}
	return setRespose(201, {
		message: `Product successfully saved.`
	})
}