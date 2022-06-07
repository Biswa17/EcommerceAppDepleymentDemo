const productModel = require("../../src/models/product")
const productController = require("../../src/controllers/productController") 
const {mockRequest, mockResponse} = require("../mocker")
const jestMock = require("jest-mock")


const testPayload = [
    {
        "id": 1,
        "name":"Sony Bravia",
        "price": 10000
    },
    {
        "id": 2,
        "name":"Samsung s10",
        "price": 50000
    }
];

test('All product should return all products',async ()=>{
    const req = mockRequest();
    const res = mockResponse();
    const spy = jestMock.spyOn(productModel,'listProducts').mockImplementation((data,callback) =>{
        callback(null, testPayload)
    })
    await productController.listProducts(req,res);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    var responseData = {}
    responseData.msg = "Successfully fetched product";
    responseData.success = true;
    responseData.products = testPayload;
    expect(res.send).toHaveBeenCalledWith(responseData)
})


test('Product controller should return error on all product listing',async ()=>{
    const req = mockRequest();
    const res = mockResponse();
    const spy = jestMock.spyOn(productModel,'listProducts').mockImplementation((data,callback) =>{
        callback(new Error("this is an error"), null )
    })
    await productController.listProducts(req,res);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    var responseData = {
        success: false,
        msg: "InValid params for fetching products"
    };
    expect(res.send).toHaveBeenCalledWith(responseData)
})


test("Product controller should not call add product", async()=>{
    const req = mockRequest();
    const res = mockResponse();
    const spy = jestMock.spyOn(productModel,'addProduct').mockImplementation((data,callback) =>{
        callback(null, true )
    })

    await productController.addProduct(req,res);

    expect(spy).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(400);
})

test("Product controller retuens success on adding a product", async()=>{
    const req = mockRequest();
    const res = mockResponse();
    req.body = {
        name: "test",
        price: 1000,
        description: "Test desc",
        vendorId: 1,
        categoryId: 1
    }
    const spy = jestMock.spyOn(productModel,'addProduct').mockImplementation((data,callback) =>{
        callback(null, true )
    })

    await productController.addProduct(req,res);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    var responseData = {}
    responseData.msg = "Successfully added product";
    responseData.success = true;
    responseData.products = true;
    expect(res.send).toHaveBeenCalledWith(responseData)
})

test("Product controller returns error on adding a product", async()=>{
    const req = mockRequest();
    const res = mockResponse();
    req.body = {
        name: "test",
        price: 1000,
        description: "Test desc",
        vendorId: 1,
        categoryId: 1
    }
    const spy = jestMock.spyOn(productModel,'addProduct').mockImplementation((data,callback) =>{
        callback(new Error("this is error"), null )
    })

    await productController.addProduct(req,res);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    var responseData = {}
    responseData.msg = "Error in adding product";
    responseData.success = false;
    expect(res.send).toHaveBeenCalledWith(responseData)
})