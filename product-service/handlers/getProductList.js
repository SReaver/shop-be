const products = require('../products.json')
module.exports = async () => {
  return {
		headers: {
			"content-type": "application/json"
		},
    statusCode: 200,
    body: JSON.stringify(products)
  };
}