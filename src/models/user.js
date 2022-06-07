const sqlConnection = require("../services/sqlConnection");
const bcrypt = require("bcryptjs");
const auth = require("../util/auth");
const { response } = require("express");

module.exports = {

    adduser: function(data, callback) {

        var sql = "insert into Users (Username, Password, CreatedAt, UpdatedAt)values (?,?,now(),now());"
        var values = []; //taking parameters for ?
        console.log(data)
        values.push(data.username);
        values.push(data.password);
        //values.push(data.usertype);

        sqlConnection.executeQuery(sql, values, function(error, result){
            callback(error, result);
        });
        
    },


    encryptedAdduser: function(data,callback){
        var sql = "insert into Users (Username, Password, CreatedAt, UpdatedAt)values (?,?,now(),now());"
        let values = []; //taking parameters for ?
        values.push(data.username);

        bcrypt.hash(data.password,8,function(err,hash){
            if(err){
                console.log(err);
                return;
            }

            values.push(hash)
            


            sqlConnection.executeQuery(sql, values, function(error, result){
                callback(error, result);
            });
        })


        
        
    },
    
    getUserSignupDetails(data,callback){
        let sql = "SELECT * FROM Users WHERE Username = ?"
        let values = [];
        values.push(data.username)

        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },


    login : function(data,callback){
        let sql = "SELECT ID as UserId,Username, UserType FROM Users WHERE Username = ? and Password = ?"
        let values = [];
        values.push(data.username)
        values.push(data.password)

        sqlConnection.executeQuery(sql,values,function(err,result){
            callback(err,result);
        });
    },

    encryptedlogin : function(data,callback){
        let sql = "SELECT ID as UserId,Username, UserType,Password FROM users WHERE Username = ?"
        let values = [];
        values.push(data.username)


        sqlConnection.executeQuery(sql,values,function(err,result){
            if(result.length == 0){
                callback(err,[]);
            }
            else
            {
                const isValidpass = bcrypt.compareSync(data.password, result[0].Password);

                if(isValidpass){
                    const token = auth.newToken
                    (result);
                    const response = [
                        {
                            UserId: result[0].UserId,
                            Username: result[0].Username,
                            UserType: result[0].UserType,
                            authToken: token
                        }
                    ]
                    callback(err,response);
                }
                else{
                    callback(err,[]);
                }
            }
        });
    },
    getUserById: function(id, cb) {
        let sql = `SELECT ID as UserId, Username, UserType 
                   FROM Users WHERE 
                   ID = ?`;
        let values = [];
        values.push(id);
        sqlConnection.executeQuery(sql, values, function(err, result) {
            cb(err, result);
        });
    }

}