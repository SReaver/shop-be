const products = require('../products.json')
module.exports = async () => {
  return await {
    statusCode: 200,
    body: products
  };
}