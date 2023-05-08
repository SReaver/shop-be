import csv from 'csv-parser';
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "../libs/sqsClient.js";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const importFileParser = async event => {
	const s3Client = new S3Client({ region: "eu-west-1" })
	const bucket = event.Records[0].s3.bucket.name;
	const filename = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: filename
	});

	try {
		const data = await s3Client.send(command);
		data.Body
			.pipe(csv())
			.on('data', async (chunk) => await sqsClient.send(new SendMessageCommand({
				MessageBody: chunk,
				QueueUrl: 'https://sqs.eu-west-1.amazonaws.com/747711022835/catalogItemsQueue'
			}))
			)
			.on('error', (err) => {
				console.log('Error streamin CSV file: ', err.message);
			})
	} catch (err) {
		console.error(err);
	}
}