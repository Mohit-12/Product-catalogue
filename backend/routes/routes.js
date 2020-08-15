const path = require('path');
const express = require('express');
const { body } = require('express-validator');

const productController = require('../controllers/products.controller');
const cartController = require('../controllers/carts.controller');

const router = express.Router();

router.post('/product/create', [ body('title').isString().isLength({ max: 50 }).trim(), body('price').isNumeric().isLength({ max: 5 })],productController.create);
router.get('/product/', productController.getAll);
router.get('/product/:id', productController.getById);
router.put('/product/:id', [ body('title').isString().isLength({ max: 50 }).trim(), body('price').isNumeric().isLength({ max: 5 })], productController.update);
router.delete('/product/:id', productController.delete);

router.post('/cart/create', cartController.create);
router.get('/cart/', cartController.getAll);
router.get('/cart/:id', cartController.getById);
router.put('/cart/:id', cartController.update);
router.delete('/cart/:id', cartController.delete);


module.exports = router;
