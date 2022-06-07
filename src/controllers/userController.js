const User = require("../models/user");
const { httpCodes } = require("../constants/backendConfig");
const auth = require("../util/auth")

module.exports = {

    addUser : function(req, res){
        var data = req.body;
        var responseData = {
            success: false,
            msg: "InValid params for fetching products"
        };
        if(data.username && data.password)
        {
            User.getUserSignupDetails(data, function(err,result){
                if(err){
                    console.log(err)
                    responseData.msg = "Error in signup"
                    return res.status(httpCodes.internalServerError).send(responseData)
                }
                if (result.length > 0){
                    responseData.msg = "User already exist"
                    return res.status(httpCodes.internalServerError).send(responseData)
                }
                else{
                    responseData.msg = "failed to signup"
                    User.encryptedAdduser(data, function(err, result) {
                        if(err) {
                           return res.status(httpCodes.internalServerError).send(responseData);
                        }
                        
                        responseData.msg = "added new user";
                        responseData.success = true;
                        responseData.data ={
                            username: data.username
                        };
                        return res.status(httpCodes.success).send(responseData);
                    });
                }
        
            })
        }
        else{
            return res.status(httpCodes.badRequest).send(responseData)
        }
    },

    signin : function(req,res){
        var data = req.body;
        var responseData = {
            success: false,
            msg: "InValid params for fetching products"
        };
        if(data.username && data.password){
            User.encryptedlogin(data,function(err,result){
                if(err) {
                    responseData.msg = "failed to login"
                    return res.status(httpCodes.internalServerError).send(responseData);
                }
                if(result.length == 0){
                    responseData.msg = "Invalid email or password"
                    return res.status(httpCodes.internalServerError).send(responseData)
                }
                else{
                    responseData.msg = "login sucessfull";
                    responseData.success = true;
                    responseData.data = result;
                    return res.status(httpCodes.success).send(responseData);
                }

            });

        }
        else{
            return res.status(httpCodes.badRequest).send(responseData)
        }
    },

    isAuthenticated: function(req,res,next){
        const token = req.headers.auth;
        let response;
        let responseData;

        try{
            response = auth.verifyToken(token)
        }
        catch(err){
            console.log(err);
            responseData.msg = "Invalid Token";
            return res.status(401).send(responseData)
        }
        User.getUserById(response.id,function(err,result){
            if(err) {
                return res.status(401).send({message: "Invalid user"});
            }
            req.user = result;
            next();
        })
        
    }
}