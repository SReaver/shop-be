import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { ddbClient } from "../ddbClient.js";

const headers = {
	"Access-Control-Allow-Credentials": true,
	"Access-Control-Allow-Origin": "*",
	"Content-Type": "application/json",
}
const getProductParams = (title, price, description) => ({
  TableName: "products",
  Item: {
    id: { S: uuidv4() },
    price: { N: price },
		title: { S: title },
		description: { S: description }
  },
});
export const createProduct = async (event) => {
	console.log(event)
	const {title, price, description} = JSON.parse(event.body);
	console.log(title, price, description);
  try {
    const data = await ddbClient.send(new PutItemCommand(getProductParams(title, +price, description)));
    console.log(data);
    return data;
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
}