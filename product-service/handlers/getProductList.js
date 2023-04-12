import products from '../products.json' assert { type: `json` };
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

export const getProductList = async () => {
  return {
		headers: {
			"Access-Control-Allow-Credentials": true,
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
    statusCode: 200,
    body: JSON.stringify(products)
  };
}