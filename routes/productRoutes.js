const express = require("express");
const productController = require("../controllers/productController");
const { cacheMiddleware, invalidateCacheMiddleware } = require("../middleware/cache");

const router = express.Router();

router.get("/", cacheMiddleware, productController.getAllProducts);
router.get("/products", cacheMiddleware, productController.getAllProducts);
router.get("/:id", cacheMiddleware, productController.getProductById);
router.get("/products/:id", cacheMiddleware, productController.getProductById);
router.post("/", invalidateCacheMiddleware, productController.createProduct);
router.post("/products", invalidateCacheMiddleware, productController.createProduct);
router.put("/:id", invalidateCacheMiddleware, productController.updateProduct);
router.put("/products/:id", invalidateCacheMiddleware, productController.updateProduct);
router.patch("/:id", invalidateCacheMiddleware, productController.patchProduct);
router.patch("/products/:id", invalidateCacheMiddleware, productController.patchProduct);
router.delete("/:id", invalidateCacheMiddleware, productController.deleteProduct);
router.delete("/products/:id", invalidateCacheMiddleware, productController.deleteProduct);

module.exports = router;
