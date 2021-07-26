const mongoose=require('mongoose')

const ItemModel=new mongoose.Schema({
    itemid:{type:mongoose.Schema.Types.ObjectId,ref:'items'},
    quantity:Number
})

const StatusModel=new mongoose.Schema({
    numb:Number,
        status:{type:String,default:"pending"},
        date:{
            type:Date,
            default:Date.now()
        }
    
})

const OrderModel=new mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    itemscount:Number,
    address:String,
    total:Number,
    resturant:{type:mongoose.Schema.Types.ObjectId,ref:'resturants'},
    item:[ItemModel],
    Status:[StatusModel],      //pending, rejected, accepted, delivered
    createdDate:{
        type:Date,
        default:Date.now()
    }
})


module.exports=mongoose.model('order',OrderModel)