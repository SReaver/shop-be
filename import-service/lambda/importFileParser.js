import csv from 'csv-parser'
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const importFileParser = async event => {
	const client = new S3Client({ region: "eu-west-1" })
	const bucket = event.Records[0].s3.bucket.name;
	const filename = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: filename
	});

	try {
		const data = await client.send(command);
		data.Body
			.pipe(csv())
			.on('data', (chunk) => {
				console.log(chunk)
			})
			.on('error', (err) => {
				console.log('Error streamin CSV file: ', err.message);
			});
	} catch (err) {
		console.error(err);
	}
}