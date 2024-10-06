module.exports = (temp, product) => {
  let output = temp
    .replace(/{{PRODUCT_ID}}/g, product.id)
    .replace(/{{PRODUCT_NAME}}/g, product.productName)
    .replace(/{{PRODUCT_IMAGE}}/g, product.image)
    .replace(/{{PRODUCT_ORIGIN}}/g, product.from)
    .replace(/{{PRODUCT_NUTRIENTS}}/g, product.nutrients)
    .replace(/{{PRODUCT_PRICE}}/g, product.price)
    .replace(/{{PRODUCT_QTY}}/g, product.quantity)
    .replace(/{{PRODUCT_DESCRIPTION}}/g, product.description)
    .replace(/{{PRODUCT_NOT_ORGANIC}}/g, product.organic ? '' : 'not-organic');

  return output;
};
