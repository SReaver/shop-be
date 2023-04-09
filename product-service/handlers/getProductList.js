import products from '../products.json' assert { type: `json` };

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