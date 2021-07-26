const express = require('express')
const router = express.Router()
const item = require('../modules/item')
const multer = require('multer')
const cat=require('../modules/catagory')
const rest=require('../modules/resturant')

var upload = multer({ dest: __dirname + '/images/items' });
router.get('/viewallitems', (req, res) => {
    item.find()
        .populate('catagory','name pic')
        .populate('resturant','namke address phone pic')
        .exec((err, doc) => {
            if (err) console.log(err);
            else res.send(doc)
        })
})

router.post('/additem', upload.single('image'), (req, res) => {
    const data = {
        name: req.body.name,
        price: req.body.price,
        pic: req.file.filename,
        type:req.body.type,
        description:req.body.description,
        catagory:req.body.catid,
        resturant: req.body.restid
    }
    item.create(data, (err, doc) => {
        if (err) console.log(err)
        else {
cat.findByIdAndUpdate(req.body.catid,{$push:{items:doc._id}},{new:true}).exec((er,dc)=>{
    if(er)console.log(er);
    else console.log(dc);
})
rest.findByIdAndUpdate(req.body.restid,{$push:{items:doc._id}},{new:true}).exec((err,dcc)=>{
    if(err)console.log(err);
    else console.log(dcc);
})
setTimeout(() => {
    res.send(doc)
}, 100);
        }
    })
})

router.post('/changestatus', (req, res) => {
    item.findById(req.body.id).exec((err, re) => {
        if (err) console.log(err);
        else {
            if (re.status === req.body.status) {
                res.send({ msg: "already done this action" })
            } else {
                item.findByIdAndUpdate(req.body.id, { status: req.body.status }, { new: true })
                .populate('catagory','name pic')
                .populate('resturant','namke address phone pic')
                    .exec((err, doc) => {
                        if (err) console.log(err);
                        else res.send(doc)
                    })
            }
        }
    })
})

router.post('/updateitem', (req, res) => {
    item.findByIdAndUpdate(req.body.id, req.body, { new: true })
    .populate('catagory','name pic')
    .populate('resturant','namke address phone pic')
        .exec((err, doc) => {
            if (err) console.log(err);
            else res.send(doc)
        })
})

module.exports = router