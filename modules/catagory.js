const mongoose=require('mongoose')

const catModel=new mongoose.Schema({
    name:String,
    status:{type:String,default:"unblock"},
    pic:String,
    items:[{type:mongoose.Schema.Types.ObjectId,ref:'items'}],
    resturants:{type:mongoose.Schema.Types.ObjectId,ref:'resturants'}
})

module.exports=mongoose.model('catagories',catModel)