const express = require("express");
const router = express.Router();

const clientController = require('../controllers/clients')
// Authentication middleware
const isAuth = require('../middleware/is-auth')


/**
 * Note all routes are under /clients/
 */
// Render shop route page
router.get("/", clientController.renderProductsPage);
//  // Render add to cart page
 router.post('/cart', isAuth ,clientController.addToCart)

router.get('/cart', isAuth ,clientController.renderCartPage)

router.post('/createorder', isAuth,clientController.postOrder)

router.get('/index',clientController.renderHomePage)

router.get('/orders', isAuth ,clientController.renderOrdersPage)

router.get("/productDetails/:productId",clientController.renderProdDetailsPage)

router.post('/remove-item', isAuth ,clientController.removeItem)

router.get('/orders/:invoiceId', isAuth ,clientController.getInvoice)

module.exports = router;
