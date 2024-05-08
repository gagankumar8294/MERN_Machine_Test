import express from 'express';
import ProductController  from './src/controllers/product.controller.js';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';
import validateRequest from './src/middlewares/validation.middleware.js';
import UserController from './src/controllers/user.controller.js';
import { uploadFile } from './src/middlewares/file-upload.middleware.js';
import session from 'express-session';
import { auth } from './src/middlewares/auth.middleware.js';
import cookieParser from 'cookie-parser';
import { setLastVisit } from './src/middlewares/lastVisit.middleware.js';

const server = express();

server.use(cookieParser());


//sessions
server.use(
    session({
        secret: 'SecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
)

server.use(express.urlencoded({ extended: true }));

server.set("view engine", "ejs");
server.set("views", path.join(path.resolve(), 'src', 'views'));

server.use(expressEjsLayouts);
server.use(express.static('public'));

const productController = new ProductController();
const usersController = new UserController();

server.get('/',server.use(setLastVisit), auth, productController.getProducts);
server.get('/addproduct', auth, productController.getAddForm);
server.get('/update-product/:id', auth, productController.getUpdateProductView);
server.get('/register', usersController.getRegister);
server.get('/login', usersController.getLogin);
server.get('/logout', usersController.logout);
server.post('/delete-product/:id',auth, productController.deleteProduct);
server.post('/login', usersController.postLogin);
server.post('/register', usersController.postRegister);
server.post('/update-product',auth, productController.postUpdateProduct)
server.post('/',auth, uploadFile.single('imageUrl'),validateRequest, productController.addProduct);


server.use(express.static('src/views'))

server.listen(3400);