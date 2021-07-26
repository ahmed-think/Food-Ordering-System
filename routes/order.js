const express = require('express')
const router = express.Router()
const order = require('../modules/order')
const user = require('../modules/user')
const item=require('../modules/item')
router.post('/createorder', (req, res) => {
    let i = {
        itemid: req.body.itemid,
        quantity: req.body.quantity
    }
let t={
numb:req.body.numb
}
    user.findById(req.body.userid).exec((err, doc) => {
        if (err) console.log(err);
        else {
            console.log("c");
            for (let c of doc.address) {
            console.log("s");

                    if (c.adname===req.body.address) {
            console.log("a");
                        let data = {
                                userid: req.body.userid,
                                item: i,
                                resturant:req.body.restid,
                                address: c.address,
                                Status:t
                            }
                            order.create(data, (er, dc) => {
                                if (err) console.log(er);
                                else res.send(dc)
                            })
                    }
            }
        }
    })
})

router.post('/changestatus', (req, res) => {
    let data = {
        status: req.body.status
    }
    order.findByIdAndUpdate(req.body.id, { $push: { Status: data } }, { new: true })
        .populate('userid', 'name pic phone')
        .populate('item.itemid','name pic price type description')
        // .populate('item.itemid')
        // .populate('Status')
        .exec((err, doc) => {
            if (err) console.log(err);
            else if (req.body.status === "rejected" || req.body.status === "accepted") {
                user.findByIdAndUpdate(req.body.userid, { $push: { orders: doc._id } }).exec((er, dc) => {
                    if (er) console.log(er);
                    else {
                        console.log(dc);
                        res.send(doc)
                    }
                })
            }
        })
})


router.get('/viewallorders', (req, res) => {
    order.find().populate('userid', 'name pic phone')
    .populate('item')
    .populate('item.itemid')
    .populate('Status')
    .exec((err, doc) => {
        if (err) console.log(err)
        else res.send(doc)
    })
})

module.exports = router