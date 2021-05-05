const express = require("express");
const router = express.Router();
const clientController = require('../controllers/clients')
router.get("/", clientController.renderProductsPage);
router.post('/cart',clientController.addToCart)
router.get('/cart',clientController.renderCartPage)
router.get('/checkout',clientController.renderCheckoutPage)
router.get('/index',clientController.renderHomePage)
router.get('/orders',clientController.renderOrdersPage)
router.get('/productDetails/:productId',clientController.renderProdDetailsPage)
router.post('/remove-item',clientController.removeItem)
module.exports = router;
