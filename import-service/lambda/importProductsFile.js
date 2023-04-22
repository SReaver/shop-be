import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { setRespose } from '../utils.js'

const createPresignedUrlWithClient = async ({ region, bucket, key }) => {
	const client = new S3Client({ region });
	const command = new GetObjectCommand({ Bucket: bucket, Key: key });
	return getSignedUrl(client, command, { expiresIn: 3600 });
};

export const importProductsFile = async event => {
	// return setRespose(200, {
	// 	message: event.queryStringParameters.name
	// })
	let fileName;
	try {
		const { queryStringParameters: { name } } = event;
		fileName = name;
	} catch (error) {
		return setRespose(500, { message: error.message })
	}


	try {
		const clientUrl = await createPresignedUrlWithClient({
      region: 'eu-west-1',
      bucket: 'uploaded',
      key: `uploaded/${fileName}`,
    });

		return setRespose(200, clientUrl);
	} catch (error) {
		return setRespose(500, {
			message: error.message
		})
	}
}