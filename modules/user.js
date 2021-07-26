const mongoose=require('mongoose')

const AddressModel=new mongoose.Schema({
     adname:String,
     address:String
})
const UserModel=new mongoose.Schema({
    name: String,
    email: String,
    phone:Number,
    pasword:String,
    address:[AddressModel],
    orders:[{type:mongoose.Schema.Types.ObjectId,ref:'order'}],
    verification:{type:Boolean,default:false},
    status:{type:String,default:"unblock"},
    isloggedin:{type:Boolean,default:false}
})

module.exports= mongoose.model('users',UserModel)