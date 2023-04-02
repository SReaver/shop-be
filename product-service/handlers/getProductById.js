const products = require('../products.json')
module.exports = async (event) => {
	const {pathParameters: { id }} = event;
	const findedProduct = await products.filter(product => product.id === id )[0]

	if (!findedProduct){
		return await { 
			statusCode: 404,
			body: {
				message: 'Product not found'
			}
		}
	} else {
		return await {
			statusCode: 200,
			body:	findedProduct
		};
	}
}