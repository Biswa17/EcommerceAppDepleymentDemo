const orderDetails = require("../../src/models/orderDetails")
const orderItem = require("../../src/models/orderItem")
const productModel = require("../../src/models/product")
const orderController = require("../../src/controllers/orderController") 
const {mockRequest, mockResponse} = require("../mocker")
const jestMock = require("jest-mock")


const productPayload = [{
    name : "sony bravia",
    price: 100000,
    description : "coloured tv"
}]

const orderPayload = [{ID:1, total:100000}]

test('order controller should return bad request on create order', async () => {
    const req = mockRequest();
    req.body = {
        userId: 1
    };
    const res = mockResponse();

    await orderController.createOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    let responseData = {
        success: false,
        msg: "Invalid params for creating order"
    };
    expect(res.send).toHaveBeenCalledWith(responseData);
});

test("order controller should return error on create order", async()=>{
    const req = mockRequest();
    req.body = {
        userId: 1,
        productId:1
    };
    const res = mockResponse();

    const spyonproduct = jestMock.spyOn(productModel,"getProductDetails").mockImplementation((data,callback)=>{
        callback(new Error("this is an error"),null)
    })
    await orderController.createOrder(req,res);
    expect(spyonproduct).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500);
    let responseData = {
        success: false,
    };
    responseData.msg = "Error in creating the order";
    expect(res.send).toHaveBeenCalledWith(responseData);
})

test("Order controller should create order", async()=>{
    const req = mockRequest();
    req.body = {
        userId: 1,
        productId:1
    };
    const res = mockResponse();

    const productSpy = jestMock.spyOn(productModel,"getProductDetails").mockImplementation((data,callback)=>{
        callback(null, productPayload);
    })
    const findOrderSpy = jestMock.spyOn(orderDetails,"findOrderByUser").mockImplementation((data,callback)=>{
        callback(null,orderPayload)
    })
    const editOrderSpy = jestMock.spyOn(orderDetails,"updateOrder").mockImplementation((data,callback)=>{
        callback(null,null)
    }) 

    const addOrderSpy = jestMock.spyOn(orderItem, 'addOrderItem').mockImplementation((data, callback) => {
        callback(null, null);
    });



    await orderController.createOrder(req, res);
    expect(productSpy).toHaveBeenCalled();
    expect(findOrderSpy).toHaveBeenCalled();
    expect(editOrderSpy).toHaveBeenCalled();
    expect(addOrderSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    responseData = {}
    responseData.msg = "Successfully created an order";
    responseData.success = true;
    responseData.orderDetails = {orderId: orderPayload[0].ID}
    expect(res.send).toHaveBeenCalledWith(responseData);
    

})