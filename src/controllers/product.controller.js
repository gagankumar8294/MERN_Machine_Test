import path from 'path';
import ProductModel from '../models/product.model.js';

export default class ProductController {
    getProducts(req, res, next){
        var products = ProductModel.get();
        res.render("index", { products, ueserEmail: req.session.userEmail })
    }

    getAddForm(req, res){
        return res.render("new-product", {errorMessage:null, ueserEmail: req.session.userEmail}); // data is optional
    }

    getUpdateProductView(req, res){
        const id = req.params.id; // reading product id from the body
        const productFound = ProductModel.getById(id); // calling model to get the product
        if(productFound){
            res.render('update-product', {product:productFound, errorMessage:null, ueserEmail: req.session.userEmail });// if product found render the view
        }
        else {
            res.status(401).send("Product not found");
        }
    }

    postUpdateProduct(req, res) {
        ProductModel.update(req.body)
        var products = ProductModel.get(); 
        res.render('index', { products });
    }

    addProduct(req, res, next){
        const {name, desc, price} = req.body;
        const imageUrl = 'images/'+ req.file.filename;
         ProductModel.add(name, desc, price, imageUrl);
        var products = ProductModel.get(); 
        res.render("index", { products,  userEmail: req.session.userEmail })
    }

    deleteProduct(req, res, next){
        const id = req.params.id;
        const productFound = ProductModel.getById(id);
        if(!productFound) {
            return res.status(401).send('product not found');
        }
        ProductModel.delete(id);
        var products = ProductModel.get();
        res.render('index', { products });
    }
}