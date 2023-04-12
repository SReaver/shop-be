import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "../ddbClient.js";

const headers = {
	"Access-Control-Allow-Credentials": true,
	"Access-Control-Allow-Origin": "*",
	"Content-Type": "application/json",
}

export const params = {
  // Specify which items in the results are returned.
  // FilterExpression: "Subtitle = :topic AND Season = :s AND Episode = :e",
  // // Define the expression attribute value, which are substitutes for the values you want to compare.
  // ExpressionAttributeValues: {
  //   ":topic": { S: "SubTitle2" },
  //   ":s": { N: "1" },
  //   ":e": { N: "2" },
  // },
  // // Set the projection expression, which the the attributes that you want.
  // ProjectionExpression: "Season, Episode, Title, Subtitle",
  TableName: "products",
};

export const getProductList = async () => {
	try {
		const data = await ddbClient.send(new ScanCommand(params));
		return {
			headers,
			statusCode: 200,
			body: JSON.stringify(data.Items)
		};
	} catch (error) {
		return {
			headers,
			statusCode: 500,
			body: JSON.stringify(error.message)
		};
	}
}