const mongoose= require('mongoose')

const ResturantModel=new mongoose.Schema({
    name:String,
    address:String,
    phone:Number,
    pic:String,
    status:{type:String,default:"enable"},
    items:[{type:mongoose.Schema.Types.ObjectId,ref:'items'}],
    catagory:[{type:mongoose.Schema.Types.ObjectId,ref:'catagories'}]
})

module.exports=mongoose.model('resturants',ResturantModel)