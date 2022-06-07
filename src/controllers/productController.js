const Product = require("../models/product");
const { httpCodes } = require("../constants/backendConfig");

module.exports = {

    listProducts : function(req, res){
        var data = req.body;
        var responseData = {
            success: false,
            msg: "InValid params for fetching products"
        };
        Product.listProducts(data, function(err, result) {
            if(err) {
               return res.status(httpCodes.internalServerError).send(responseData);
            }
            
            responseData.msg = "Successfully fetched product";
            responseData.success = true;
            responseData.products = result;
            return res.status(httpCodes.success).send(responseData);
        });
    },

    addProduct: function(req, res) {
        var data = req.body;
        var responseData = {
            success: false,
            msg: "InValid params for adding products"
        }; 
        if(data.name && data.price && data.description && data.categoryId 
            && data.vendorId) {
                Product.addProduct(data, function(err, result){
                    if(err){
                        responseData.msg = "Error in adding product";
                        return res.status(httpCodes.internalServerError).send(responseData);
                    }

                    responseData.success = true;
                    responseData.msg = "Successfully added product";
                    responseData.products = result
                    return res.status(httpCodes.success).send(responseData);
                }); 
        }else{
            return res.status(httpCodes.badRequest).send(responseData);       
        }
    },
    
};