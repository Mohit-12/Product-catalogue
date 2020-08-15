const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
};

exports.create = (req, res, next) => {
    console.log(req.body);
    try {
        const image = req.file;
        if (image==undefined || image == null) {
            next('Please Add image')
        }
        getProductsFromFile((products)=>{ 
            req.body.id = Math.random().toString();
            req.body.imageUrl = image.path; 
            if (products){
                pd = products.find(p => p.title.toLowerCase() === req.body.title.toLowerCase());
                if (pd == undefined){  
                    products.push(req.body);
                } else {
                    next('Product already exists!!');
                }
            } else {
                products = [req.body];
            }
            fs.writeFile(p, JSON.stringify(products), err => {
                if (!err) {
                    res.send({ message: 'Prodect Created Successfully!!'});
                  } else {
                    next('Not Added Successfully!');
                  }
            });
        });

    } catch(err) {
        next(err)
    }
}
exports.getAll = (req, res, next) => {
    try {
        getProductsFromFile((products)=>{ 
            res.send(products)
        });
    } catch (err){
        next(err)
    }
}
exports.getById = (req, res, next) => {
    try {
        getProductsFromFile((products)=>{ 
            const product = products.find(p => p.id === req.params.id)
            if (product){
                res.send(product);
            } else {
                next('Product Not Exists');
            }
        });
    } catch (err) {
        next(err);
    }
    
}
exports.update = (req, res, next) => {
    try {
        const image = req.file;
        getProductsFromFile((products)=>{  
            if (products){
                pd = products.find(p => p.id === req.params.id);
                if (pd == undefined){  
                    next('Product not Found!!');
                } else {
                    if (image == undefined || image == null) {
                        req.body.imageUrl = pd.imageUrl;
                    } else {
                        req.body.imageUrl = image.path
                    }
                    const updatedProducts = products.filter(prod => prod.id !== req.params.id);
                    updatedProducts.push(req.body);
                    fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                        if (!err) {
                            res.send({ message: 'Prodect Updated Successfully!!'});
                        } else {
                            next('Not Updated Successfully!');
                        }
                    });
                }
            } else {
                next('Product not Found!!');
            }
        });
    } catch(err) {
        next(err)
    }
}
exports.delete = (req, res, next) => {
    try {
        getProductsFromFile((products)=>{  
            if (products){
                pd = products.find(p => p.id === req.params.id);
                if (pd == undefined){  
                    next('Product not Found!!');
                } else {
                    const updatedProducts = products.filter(prod => prod.id !== req.params.id);
                    fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                        if (!err) {
                            res.send({ message: 'Prodect Deleted Successfully!!'});
                        } else {
                            next('Not Deleted Successfully!');
                        }
                    });
                }
            } else {
                next('Product not Found!!');
            }
        });
    } catch(err) {
        next(err)
    }
}
