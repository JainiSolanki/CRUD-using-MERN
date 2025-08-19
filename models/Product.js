const mongoose = require('mongoose')

var ProductSchema = mongoose.Schema({
    pname:String,
    pdetails:String,
    pprice:Number
})

var ProductModel = mongoose.model('products',ProductSchema)
module.exports = ProductModel;
