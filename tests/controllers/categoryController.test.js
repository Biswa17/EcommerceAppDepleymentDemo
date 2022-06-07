const categoryModel = require("../../src/models/category")
const categoryController = require("../../src/controllers/categoryController") 
const {mockRequest, mockResponse} = require("../mocker")
const jestMock = require("jest-mock")

testPayload =[
    {
        categoryId:1,
        name:"ELectronics"
    },
    {
        categoryId:2,
        name:"Cloths"
    }

]


test('All categories should be returned',async ()=>{
    const req = mockRequest();
    const res = mockResponse();
    const spy = jestMock.spyOn(categoryModel,'listCategories').mockImplementation((callback) =>{
        callback(null, testPayload)
    })


    await categoryController.listCategories(req,res);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    var responseData = {}
    responseData.msg = "sucessfully fetched categories";
    responseData.success = true;
    responseData.categories = testPayload;
    expect(res.send).toHaveBeenCalledWith(responseData)
})

test('Category controller should be return error',async ()=>{
    const req = mockRequest();
    const res = mockResponse();
    const spy = jestMock.spyOn(categoryModel,'listCategories').mockImplementation((callback) =>{
        callback(new Error(" this is an error"), null)
    })


    await categoryController.listCategories(req,res);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    var responseData = {
        success : false,
        msg : "Error in fetching categories"
    };
    expect(res.send).toHaveBeenCalledWith(responseData)
})