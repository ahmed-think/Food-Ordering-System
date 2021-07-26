const express = require('express')
const router = express.Router()
const order = require('../modules/order')
const rest = require('../modules/resturant')
const multer = require('multer')
var upload = multer({ dest: __dirname + '/images/resturants' });
router.get('/viewallresturants', (req, res) => {
    rest.find()
        .populate('items', 'name pic type description price catagory')
        .populate('items.catagory', 'name pic')
        .exec((err, doc) => {
            if (err) console.log(err);
            else res.send(doc)
        })
})

router.post('/addresturants', upload.single('image'), (req, res) => {
    const data = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.num,
        pic: req.file.filename,
    }
    rest.create(data, (err, doc) => {
        if (err) console.log(err)
        else res.send(doc)
    })
})

router.post('/changestatus', (req, res) => {
    rest.findById(req.body.id).exec((err, re) => {
        if (err) console.log(err);
        else {
            if (re.status === req.body.status) {
                res.send({ msg: "already done this action" })
            } else {
                rest.findByIdAndUpdate(req.body.id, { status: req.body.status }, { new: true })
                    .populate('items', 'name pic type description price catagory')
                    .populate('items.catagory', 'name pic')
                    .exec((err, doc) => {
                        if (err) console.log(err);
                        else res.send(doc)
                    })
            }
        }
    })
})

router.post('/updateresturant', (req, res) => {
    rest.findByIdAndUpdate(req.body.id, req.body, { new: true })
        .populate('items', 'name pic type description price catagory')
        .populate('items.catagory', 'name pic')
        .exec((err, doc) => {
            if (err) console.log(err);
            else res.send(doc)
        })
})

router.post('/searchorder', (req, res) => {
    order.find({ resturant: req.body.restid })
        .populate('item')
        .populate('item.itemid')
        .populate('Status')
        .sort({createdDate:-1})
        .exec((err, doc) => {
            if (err) console.log(err)
            else res.send(doc)
        })
})

module.exports = router