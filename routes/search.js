const express=require('express')
const router=express.Router()
const cat=require('../modules/catagory')
const item=require('../modules/item')
router.post('/',(req,res)=>{
    if(req.body.catid){
        cat.findById(req.body.catid)
        .populate('items','name pic type description price resturant')
        .populate('items.resturant','name address phone pic')
        .exec((err,doc)=>{
            if(err) console.log(err);
            else res.send(doc)
        })
    }
    else{
        item.find(req.body)
        .populate('catagory','name pic')
        .populate('resturant','name address phone pic')
        .exec((err, doc) => {
            if (err) console.log(err);
            else res.send(doc)
        })
    }
})

module.exports=router