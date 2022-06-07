const sqlConnection = require("../services/sqlConnection")//a2 import korisu executeQuery use koribole 

module.exports = {
    listCategories: function(callback){
        var sql = "SELECT ID as categoryId, Name as name FROM Categories";
        var values = [];
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    }
}


// sqlConnection
//    .executeQuery(
//         query that will be executed, 
//         the parameters for sql query, 
//         function that you want to execute in case the query executes
//     );