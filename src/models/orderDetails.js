const sqlConnection = require("../services/sqlConnection")//a2 import korisu executeQuery use koribole 

module.exports = {
    listOrderDetails: function(data,callback){
        var sql = "select * from OrderDetails as OD inner join Users as U on OD.UserID = U.ID where OD.UserID = ?;";
        var values = [];
        values.push(data.userId)
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },

    findOrderByUser : function (data,callback){
        var sql = "Select ID, Total AS total  from orderdetails where UserID = ? and OrderStatus = 1 LIMIT 1"
        var values = [];
        values.push(data.userId);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },

    addOrder: function (data,callback){
        var sql = "insert into orderdetails(Total,UserID,OrderStatus,CreatedAt,UpdatedAt) values(?,?,1,now(),now());"
        let values = [];
        values.push(data.total);
        values.push(data.userId);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },

    updateOrder: function(data,callback){
        var sql = "update orderdetails SET Total = ?, OrderStatus = 1, UpdatedAt = now() Where ID = ?"
        let values = []
        if(data.payment){
            sql = "Update OrderDetails SET OrderStatus = 2, UpdatedAt = now() where ID = ?"
        }
        else{
            values.push(data.total);
        }
        values.push(data.orderId);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },
    getOrderDetails(data,callback){
        var sql = "SELECT OD.id as orderId, OD.Total as total,p.ID as productId, p.Name  as productName, p.Price as price, oi.Quantity as quantity FROM orderdetails as OD LEFT JOIN orderItems as oi ON od.ID = oi.OrderID LEFT JOIN Products AS p ON P.ID = oi.ProductID WHERE od.userID = ? and od.OrderStatus = 1"
        let values = []
        values.push(data.userId);
        values.push(data.orderstatus);
        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    }
}