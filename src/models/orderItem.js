const sqlConnection =  require("../services/sqlConnection")


module.exports = {
    addOrderItem: function(data,callback){
        var sql = "insert into orderitems(OrderID,ProductID,Quantity,CreatedAt,UpdatedAt) values(?,?,?,now(),now());"
        var values = [];
        values.push(data.orderId)
        values.push(data.productId);
        values.push(data.quantity);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },

    editOrderItem: function(data,callback){
        var sql = "UPDATE OrderItems SET Quantity = ?, UpdatedAt = now() WHERE OrderId = ? AND ProductID = ?"
        var values = [];
        values.push(data.quantity)
        values.push(data.orderId);
        values.push(data.productId);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },

    deleteOrderItem: function(data,callback){
        var sql = "DELETE FROM OrderItems WHERE OrderId = ? AND ProductID = ?"
        var values = [];
        values.push(data.orderId)
        values.push(data.productId);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },

    getOrderItems: function(data,callback){
        var sql = "SELECT * FROM OrderItems WHERE OrderId = ? AND ProductID = ?"
        var values = [];
        values.push(data.orderId)
        values.push(data.productId);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    }
}