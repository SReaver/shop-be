import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import {PublishCommand } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from 'uuid';
import { ddbDocClient } from "../libs/ddbDocClient.js";
import {snsClient } from "./libs/snsClient.js";

const getParams = data => {
	const items = data.map(item => ({
		PutRequest: {
			Item: {
				id: uuidv4(),
				price: item.price,
				title: item.title,
				description: item.description
			},
		},
	}))
	return {
		RequestItems: {
			products: items
		}
	}
};

export const catalogBatchProcess = async (event) => {
	const products = event.Rocords.map(({ body }) => JSON.parse(body));
	console.log('products: ', products)
	try {
		const data = await ddbDocClient.send(new BatchWriteCommand(getParams(products)));
		await snsClient.send(new PublishCommand({
			Message: "All products imported!", // MESSAGE_TEXT
			TopicArn: process.env.SNS_ARN, //TOPIC_ARN,
			Subject: 'Import Service'
		}));
		console.log("Success, items inserted", data);
		return data;
	} catch (err) {
		console.log("Error", err);
	}
}