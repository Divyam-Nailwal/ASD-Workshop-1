const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "..", "db.json");

async function getAll() {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function getById(id) {
  const products = await getAll();
  const numericId = Number(id);
  return products.find((item) => item.id === numericId || String(item.id) === String(id)) || null;
}

async function saveAll(products) {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");
}

async function create(productData) {
  const products = await getAll();
  const maxId = products.reduce((max, p) => {
    const num = Number(p.id);
    return !isNaN(num) && num > max ? num : max;
  }, 0);
  const numericPrice = typeof productData.price === "string" && !isNaN(Number(productData.price))
    ? Number(productData.price)
    : productData.price;
  const newProduct = {
    ...productData,
    id: productData.id !== undefined ? Number(productData.id) : maxId + 1,
    price: numericPrice
  };
  products.push(newProduct);
  await saveAll(products);
  return newProduct;
}

async function update(id, productData) {
  const products = await getAll();
  const numericId = Number(id);
  const index = products.findIndex((p) => p.id === numericId || String(p.id) === String(id));
  if (index === -1) {
    return null;
  }
  const numericPrice = typeof productData.price === "string" && !isNaN(Number(productData.price))
    ? Number(productData.price)
    : productData.price !== undefined ? productData.price : products[index].price;
  const updatedProduct = {
    ...productData,
    id: numericId,
    price: numericPrice
  };
  products[index] = updatedProduct;
  await saveAll(products);
  return updatedProduct;
}

async function patch(id, productData) {
  const products = await getAll();
  const numericId = Number(id);
  const index = products.findIndex((p) => p.id === numericId || String(p.id) === String(id));
  if (index === -1) {
    return null;
  }
  const numericPrice = typeof productData.price === "string" && !isNaN(Number(productData.price))
    ? Number(productData.price)
    : productData.price !== undefined ? productData.price : products[index].price;
  const updatedProduct = {
    ...products[index],
    ...productData,
    id: numericId,
    ...(productData.price !== undefined ? { price: numericPrice } : {})
  };
  products[index] = updatedProduct;
  await saveAll(products);
  return updatedProduct;
}

async function remove(id) {
  const products = await getAll();
  const numericId = Number(id);
  const index = products.findIndex((p) => p.id === numericId || String(p.id) === String(id));
  if (index === -1) {
    return null;
  }
  const [deletedProduct] = products.splice(index, 1);
  await saveAll(products);
  return deletedProduct;
}

module.exports = {
  getAll,
  getAllProducts: getAll,
  getById,
  getProductById: getById,
  saveAll,
  create,
  createProduct: create,
  update,
  updateProduct: update,
  patch,
  patchProduct: patch,
  remove,
  delete: remove,
  deleteProduct: remove
};
