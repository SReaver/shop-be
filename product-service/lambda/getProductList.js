import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../libs/ddbDocClient.js";
import { setRespose } from '../libs/utils.js'

const params = {
  TableName: "products",
};

export const getProductList = async () => {
	try {
		const data = await ddbDocClient.send(new ScanCommand(params));
		return setRespose(200, data.Items);
	} catch (error) {
		return setRespose(500, error.message);
	}
}