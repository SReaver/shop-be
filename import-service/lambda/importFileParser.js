import { setRespose } from '../utils.js'
export const importFileParser = async event => {

	console.log("Incoming Event: ", JSON.stringify(event));
	const bucket = event.Records[0].s3.bucket.name;
	const filename = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
	const message = `File is uploaded in - ${bucket} -> ${filename}`;
	console.log(message);


	const readableStream = await s3.getObject({ Bucket: bucket, Key: filename }).createReadStream();
	let file='';
	readableStream.on('data', (chunk) => {
		console.log(`Received ${chunk.length} bytes of data.`);
		file+=chunk
	});
	readableStream.on('end', () => {
		console.log(file);
	});
	readableStream.on('error', (err) => {
		return setRespose(500, {error: err.message})
	});

	return setRespose(200, {file})
}