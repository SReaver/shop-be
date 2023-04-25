import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { parseUrl } from "@aws-sdk/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Hash } from "@aws-sdk/hash-node";
import { fromEnv } from "@aws-sdk/credential-providers";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { setRespose } from '../libs/utils.js'

const createPresignedUrlWithoutClient = async ({ region, bucket, key }) => {
	const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
	const presigner = new S3RequestPresigner({
		credentials: fromEnv(),
		region,
		sha256: Hash.bind(null, "sha256"),
	});

	const signedUrlObject = await presigner.presign(
		new HttpRequest({ ...url, method: "PUT" })
	);
	return formatUrl(signedUrlObject);
};

export const importProductsFile = async event => {
	const { queryStringParameters: { name } } = event;
	try {
		const noClientUrl = await createPresignedUrlWithoutClient({
			region: 'eu-west-1',
			bucket: 'files-upload-for-macshop',
			key: `uploaded/${name}`,
		});

		return setRespose(200, noClientUrl);
	} catch (error) {
		return setRespose(500, {
			message: error.message
		})
	}
}