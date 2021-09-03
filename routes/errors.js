const router = require("express").Router()

const errorController = require("../controllers/error")


router.get("/404" , errorController.get404Page)

router.get("/500" , errorController.get500Page)


module.exports = router