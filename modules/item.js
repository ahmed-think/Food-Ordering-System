const mongoose=require('mongoose')


const ItemModel= new mongoose.Schema(
    {
        name:String,
        pic:String,
        type:String,
        description:String,
        price:Number,
        status:{type:String,default:'unblock'},
        catagory:{type:mongoose.Schema.Types.ObjectId,ref:'catagories'},
        resturant:{type:mongoose.Schema.Types.ObjectId,ref:'resturants'}
    }
)

module.exports=mongoose.model('items',ItemModel)