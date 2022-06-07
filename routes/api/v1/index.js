const express = require("express");
var router = express.Router();
const userController = require("../../../src/controllers/userController");
const categoryController = require("../../../src/controllers/categoryController");
const productController = require("../../../src/controllers/productController");
const orderController = require("../../../src/controllers/orderController");


router.post("/category/all", categoryController.listCategories);
router.post("/product/all", productController.listProducts);
router.post("/product/add", productController.addProduct);

router.post("/order/details",orderController.listOrderDetails)
router.post("/order/add", orderController.createOrder)
router.post("/order/edit", orderController.editOrder)

router.post("/user/signup", userController.addUser)
router.post("/user/login", userController.signin)

module.exports = router;
