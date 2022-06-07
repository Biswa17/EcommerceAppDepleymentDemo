const { httpCodes } = require("../constants/backendConfig");
const Category = require("../models/category");
module.exports = {

    listCategories:function(req,res){
        var responseData = {
            success : false,
            msg : "Error in fetching categories"
        };

        //calling the model
        Category.listCategories(function(err,result){
            if(err){
                return res.status(httpCodes.internalServerError).send(responseData)
            }
            
            
            // if no err comes we add data to our object 
            // categories:[] where we add result vales ie the sql query
            responseData.success = true;
            responseData.msg = "sucessfully fetched categories";
            responseData.categories = result;
            return res.status(httpCodes.success).send(responseData)
        });
        
    }
}