const express = require('express')
const router = express.Router()
const cat = require('../modules/catagory')
const rest=require('../modules/resturant')
const multer = require('multer')
var upload = multer({ dest: __dirname + '/images/catagory' });
router.get('/viewallcatogory', (req, res) => {
    cat.find()
        .populate('items','name pic type description price resturant')
        .populate('items.resturant','name pic type description price catagory')
        .exec((err, doc) => {
            if (err) console.log(err);
            else res.send(doc)
        })
})

router.post('/addcatagory', upload.single('image'), (req, res) => {
    const data = {
        name: req.body.name,
        items: req.body.items,
        pic: req.file.filename,
        resturants: req.body.resturants
    }
    cat.create(data, (err, doc) => {
        if (err) console.log(err)
        else {
rest.findByIdAndUpdate(req.body.resturants,{$push:{catagory:doc._id}}).exec((err,dcc)=>{
    if(err)console.log(err);
    else console.log(dcc);
})
res.send(doc)
        }
    })
})

router.post('/changestatus', (req, res) => {
    cat.findById(req.body.id).exec((err, re) => {
        if (err) console.log(err);
        else {
            if (re.status === req.body.status) {
                res.send({ msg: "already done this action" })
            } else {
                cat.findByIdAndUpdate(req.body.id, { status: req.body.status }, { new: true })
                .populate('items','name pic type description price resturant')
                .populate('items.resturant','name pic type description price catagory')
                    .exec((err, doc) => {
                        if (err) console.log(err);
                        else res.send(doc)
                    })
            }
        }
    })
})

router.post('/updatecatagory', (req, res) => {
    cat.findByIdAndUpdate(req.body.id, req.body, { new: true })
    .populate('items','name pic type description price resturant')
    .populate('items.resturant','name pic type description price catagory')
        .exec((err, doc) => {
            if (err) console.log(err);
            else res.send(doc)
        })
})

module.exports = router