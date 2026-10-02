const productService = require("../services/productService");
const { clearCache } = require("../middleware/cache");

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to read products" });
  }
}

async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to read product" });
  }
}

async function createProduct(req, res) {
  try {
    const newProduct = await productService.createProduct(req.body);
    clearCache();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
}

async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const updatedProduct = await productService.updateProduct(id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    clearCache();
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
}

async function patchProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const updatedProduct = await productService.patchProduct(id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    clearCache();
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to patch product" });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    clearCache();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
}

module.exports = {
  getAllProducts,
  getAll: getAllProducts,
  getProductById,
  getById: getProductById,
  createProduct,
  create: createProduct,
  updateProduct,
  update: updateProduct,
  patchProduct,
  patch: patchProduct,
  deleteProduct,
  delete: deleteProduct,
  remove: deleteProduct
};
