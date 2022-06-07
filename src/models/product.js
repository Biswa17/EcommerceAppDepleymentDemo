const sqlConnection = require("../services/sqlConnection");

// /product/1/details body: {"query": "SonyTV"} -> Get response for items which have substring SONYTV
 
module.exports = {

    listProducts: function(data, callback) {

        var sql = "SELECT ID as productId, Name as name, Price as price FROM Products";
        var values = []; //taking parameters for ? 
        if(data.categoryId) {
            sql += " WHERE CategoryId = ?"
            values.push(data.categoryId);
            if(data.query) {
                sql += " AND LOCATE('" + data.query + "', Name)";
            }
            if(data.minPrice) {
                sql += " AND PRICE >= " + parseInt(data.minPrice, 10);
            }
            if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
                sql += "AND PRICE <= " + parseInt(data.maxPrice, 10);
            } 
        }else if(data.query){ //SEARCH 
            sql += "WHERE LOCATE('" + data.query + "', Name)";
            if(data.minPrice) {
                sql += " AND PRICE >= " + parseInt(data.minPrice, 10);
            }
            if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
                sql += "AND PRICE <= " + parseInt(data.maxPrice, 10);
            } 
        }else if(data.minPrice) { //FILTER
            //sql = SELECT ID as productId, Name as name, Price as price FROM Products  
            sql += " WHERE PRICE >= " + parseInt(data.minPrice, 10);
            if(data.maxPrice && parseInt(data.maxPrice, 10) > 0) {
                sql += "AND PRICE <= " + parseInt(data.maxPrice, 10);
            } 
        }else if(data.maxPrice && parseInt(data.maxPrice, 10) > 0){
            sql += "WHERE PRICE <= " + parseInt(data.maxPrice, 10);
        }

        sqlConnection.executeQuery(sql, values, function(error, result){
            callback(error, result);
        });
    },

    addProduct: function(data, callback) {
        var sql = "INSERT INTO Products (Name, Price, Description, "
            + "CategoryID, VendorID, CreatedAt, UpdatedAt) "
        + "VALUES (?, ?, ?, ?, ?, now(), now())";
        //now() takes the current timestamp
        var values = [];
        values.push(data.name);
        values.push(data.price);
        values.push(data.description);
        values.push(data.categoryId);
        values.push(data.vendorId);
        sqlConnection.executeQuery(sql, values, function(err, result){
            callback(err,result);
        });
    },

    getProductDetails: function(data,callback){
        var sql = "SELECT p.name AS name, p.Price as price, p.Description as description,if((SELECT COUNT(*) FROM OrderDetails as od LEFT JOIN OrderItems as oi ON oi.OrderID = od.ID WHERE oi.productID = p.ID AND od.UserId = ? AND od.OrderStatus = 1) > 0, 1, 0) AS addedToCart FROM Products AS p WHERE p.ID = ? LIMIT 1;"

        var values = [];
        values.push(data.userId);
        values.push(data.productId);
        sqlConnection.executeQuery(sql, values, function(err, result){
            callback(err,result);
        });
    }
};
