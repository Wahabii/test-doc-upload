const express=require('express'); 
const mongoose =require('mongoose'); 
const Product = require('../models/product.model');
const multer =require('multer');
//const upload=multer({dest:'uploads/'});


const router = express.Router();

//connected to mongodb
mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true } )
.then(() => console.log('login success.. '))
.catch((err)=> console.log(err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, false);
    } else {
        cb(new Error('Only .jpeg or .png files are accepted'), true);   
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});


