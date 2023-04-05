const products = require('../products.json')
module.exports = async (event) => {
	const { pathParameters: { id }} = event;
	const findedProduct = products.filter(product => product.id === id )[0]
	const headers = {
		"content-type": "application/json"
	}
	if (!findedProduct){
		return { 
			headers,
			statusCode: 404,
			body: JSON.stringify({
				message: 'Product not found'
			})
		}
	} else {
		return {
			headers,
			statusCode: 200,
			body:	JSON.stringify(findedProduct)
		};
	}
}