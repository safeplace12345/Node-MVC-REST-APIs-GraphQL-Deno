const express = require("express");
const router = express.Router();
const clientController = require('../controllers/clients')
router.get("/", clientController.renderProductsPage);
router.get('/cart',clientController.renderCartPage)
router.get('/checkout',clientController.renderCheckoutPage)
router.get('/index',clientController.renderHomePage)
module.exports = router;
