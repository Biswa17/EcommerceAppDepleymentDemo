const { httpCodes } = require("../constants/backendConfig");
const OrderDetails = require("../models/orderDetails");
const Order = require("../models/orderDetails");
const Product = require("../models/product");
const OrderItem = require("../models/orderItem");
const e = require("express");



module.exports = {

    listOrderDetails:function(req,res){
        var data = req.body
        var responseData = {
            sucess : false,
            msg : "InValid params for fetching OrderDetails"
        };

        //calling the model
        if(data.user_id){
        Order.listOrderDetails(data, function(err,result){
            if(err){
                responseData.msg = "Error in fetcing OrderDetails"
                return res.status(httpCodes.internalServerError).send(responseData)
            }
            
            
            // if no err comes we add data to our object 
            // orderDetails:[] where we add result vales ie the sql query
            responseData.sucess = true;
            responseData.msg = "sucessfully fetched orderDetails";
            responseData.orderDetails = result;
            return res.status(httpCodes.success).send(responseData)
        });
        }
        else{
            return res.status(httpCodes.badRequest).send(responseData); 
        }
    },

    createOrder : function(req,res){
        let data = req.body;
        let responseData = {
            success: false,
            msg: "Invalid params for creating order"
        };
        if(data.userId && data.productId) {
            data.quantity = 1;
            Product.getProductDetails(data, function(err, result) {
                if(err) {
                    console.log("error in fetching products",err);
                    responseData.msg = "Error in creating the order";
                    return res.status(500).send(responseData);
                }
                OrderDetails.findOrderByUser(data, function (err1, result1) {
                    if(err1) {
                        console.log("error in finding user order",err1);
                        responseData.msg = "Error in creating the order";
                        return res.status(500).send(responseData);
                    }
                    if(result1.length > 0) {
                        data.total = parseInt(result1[0].total) + parseInt(result[0].price);
                        data.orderId = result1[0].ID;
                        OrderDetails.updateOrder(data, function (err2, result2) {
                            if(err2) {
                                console.log("error in editting order",err2);
                                responseData.msg = "Error in creating the order";
                                return res.status(500).send(responseData);
                            }
                            OrderItem.addOrderItem(data, function (err3, result3) {
                                if(err3) {
                                    console.log("error in adding orderitem",err);
                                    responseData.msg = "Error in creating the order";
                                    return res.status(500).send(responseData);
                                }
                                responseData.msg = "Successfully created an order";
                                responseData.success = true;
                                responseData.orderDetails = {
                                    orderId: result1[0].ID
                                }
                                return res.status(200).send(responseData);
                            })
                        });
                    } else {
                        data.total = parseInt(result[0].price, 10);
                        OrderDetails.addOrder(data, function(err2, result2) {
                            if(err2) {
                                console.log("error in adding new order",err);
                                responseData.msg = "Error in creating the order";
                                return res.status(500).send(responseData);
                            }
                            //console.log()
                            data.orderId = result2.insertId;
                            OrderItem.addOrderItem(data, function (err3, result3) {
                                if(err3) {
                                    console.log("error in adding orderitem",err);
                                    responseData.msg = "Error in creating the order";
                                    return res.status(500).send(responseData);
                                }
                                responseData.msg = "Successfully created an order";
                                responseData.success = true;
                                responseData.orderDetails = {
                                    orderId: result2.insertId
                                }
                                return res.status(200).send(responseData);
                            })
                        })
                    }
                })
            })
        }
        else{
            return res.status(500).send(responseData);
        }
        },

        editOrder: function(req,res){
            let data = req.body;
            let responseData = {
                success: false,
                msg: "Invalid params for updating order"
            };
            if(data.orderId && data.userId && data.productId){
                Product.getProductDetails(data, function(err,product){
                    if(err){
                        console.log(err);
                        responseData.msg = "unable to fetch product"
                        return res.status(httpCodes.internalServerError).send(responseData);
                    }
                    OrderDetails.getOrderDetails(data, function(err1,orderDetails){
                        if(data.remove){
                            if (err1){
                                console.log(err1);
                                return res.status(httpCodes.internalServerError).send(responseData);
                            }
                            OrderItem.editOrderItem(data, function(err2,orderItem){
                                if(err2){
                                    console.log(err2);
                                    return res.status(httpCodes.internalServerError).send(responseData)
                                }
                                
                                data.total = orderDetails[0].total - (product[0].price * parseInt(data.quantity, 10))
                                OrderDetails.updateOrder(data,function(err3, updateOrder){
                                    if(err3){
                                        console.log(err2);
                                        return res.status(httpCodes.internalServerError).send(responseData);
                                    }
                                    responseData.success = true;
                                    responseData.msg = "sucessfully updated order1"
                                    return res.status(httpCodes.success).send(responseData)
                                })
                            })

                        }
                        else{
                            if (err1){
                                console.log(err1);
                                return res.status(httpCodes.internalServerError).send(responseData);
                            }
                            OrderItem.editOrderItem(data, function(err2,orderItem){
                                if(err2){
                                    console.log(err2);
                                    return res.status(httpCodes.internalServerError).send(responseData)
                                }
                                let productTotal = 0;
                                orderDetails.forEach(item =>{
                                    if(item.productId == data.productId){
                                        productTotal += item.price * item.quantity;
                                    }
                                });
                                data.total  = orderDetails[0].total - productTotal + (product[0].price * parseInt(data.quantity, 10))

                                responseData.success = true;
                                responseData.msg = "sucessfully updated order2"
                                return res.status(httpCodes.success).send(responseData)

                            })
                        
                        }
                    
                    })
                })
            }
            else{
                return res.status(httpCodes.badRequest).send(responseData)
            }
        }
    
}
