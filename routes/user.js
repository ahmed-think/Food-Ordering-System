const express = require('express')
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const usar = require('../modules/user');
var users = [];
var user = [];
const multer = require('multer')
var upload = multer({ dest: __dirname + '/images/user/' });
const encrypt = function (pass) {
  var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
  var mystr = mykey.update(`${pass}`, 'utf8', 'hex')
  return mystr += mykey.final('hex');
  ;
}
const decrypt = (pass) => {
  var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
  var mystr = mykey.update(`${pass}`, 'hex', 'utf8')
  return mystr += mykey.final('utf8');
}
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rashid.sj91@gmail.com',
    pass: 'shahidjamal'
  }
});
const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false })
var unblock = []
var block = []



router.post('/adduser',upload.single('image'), (req, res) => {
  const pass = req.body.pasword
  const f=req.body.adname
  if (users.length == 0 && req.body.email != usar.find({ email: req.body.email })) {
    let d={
      adname:f,
      address:req.body.address
    }
    const signup = new usar({
      name: req.body.name,
      phone: req.body.number,
      email: req.body.email,
      pic: req.file.filename,
      pasword: encrypt(pass),
      address:d,
    })
    signup.save((err, result) => {
      if (err) console.log(err)
      else console.log(result);
    })
    users.push(signup)
  } else {
    users.forEach(ele => {
      if (ele.email === req.body.email) {
        res.send("email exist")
      } else if (req.body.email != usar.find({ email: req.body.email })) {
        let d={
          adname:f,
          address:req.body.address
        }
        const signup = new usar({
          name: req.body.name,
          email: req.body.email,
          phone: req.body.number,
          pasword: encrypt(pass),
          pic: req.files.filename,
          address:d,
        })
        users.push(signup)
      }
    })
  }


  const a = {
    email: req.body.email,
    reqotp: otp
  }
  console.log(otp);
  var mailOptions = {
    from: 'rashid.sj91@gmail.com',
    to: `${req.body.email}`,
    subject: 'Sending Email using Node.js',
    text: `${otp}`
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


  users.forEach(e => {
    if (e.status === "unblock") {
      unblock.push(e);
    } else if (e.status === "block") {
      block.push(e)
    }
  })


  user.push(a)
  res.send(users);
})




router.post('/login', (req, res) => {
  var pass;
  // console.log( pas=decrypt("863c0a4c597abd9777f968ff57c61aae"));
  async function a() {
    pass = await usar.findOne({ email: req.body.email }, 'email pasword verification status', async function (err, re) {
      if (err) {
        console.log(err);
      } else {
        return (re.pasword);
      }
    })
    if (req.body.email !== pass.email) {
      res.send("invalid email")
    } else if (req.body.pasword !== decrypt(pass.pasword)) {
      res.send("invalid pasword")
    } else if (pass.verification === false) {
      res.send("please verify your email")
    } else if (pass.status !== "unblock") {
      res.send("you are blocked by admin")
    } else {

      usar.updateOne({ email: req.body.email }, { isloggedin: "true" }, function (err, doc) {
        if (err) {
          console.log(err)
        } else {
          console.log(doc);
        }
      })
      res.send("successfully logged in")
    }
  };
  a();

})



router.post('/verify', (req, res) => {
  for (const x of user) {
    if (x.email === req.body.email && x.reqotp === req.body.otp) {
      usar.findOneAndUpdate({ email: req.body.email }, { verification: "true" },{new:true}).exec((err, doc) =>{
        if (err) {
          console.log(err)
        } else {
          res.send(doc);
        }
      })

    }
  }
})


router.post('/view all users', (req, res) => {
  // console.log(users);
  for (const x of user) {
    // console.log(x);
    if (x.email === req.body.email && x.reqotp === req.body.otp) {
      for (const t of users) {
        console.log(t);
        if (t.useremail === x.email) {
          t.authurization = true
        }
      }
    } else if (x.email === req.body.email && x.reqotp !== req.body.otp) {
      res.send("wrong otp")
    }
  }
  res.send(users)
})

router.post('/update', (req, res) => {
  let o=req.body
  console.log(o);
  usar.findByIdAndUpdate(req.body.id, req.body, { new: true })
    .exec((err, doc) => {
      if (err) console.log(err)
      else res.send(doc)
    })
})

router.post('/addadress', (req, res) => {
  let d={
    adname:req.body.adname,
    address:req.body.address
  }
  usar.findByIdAndUpdate(req.body.id, { $push: { address: d  } }, { new: true })
    .exec((err, doc) => {
      if (err) console.log(err)
      else res.send(doc)
    })
})

router.post('/deleteaddress', (req, res) => {
  usar.findByIdAndUpdate(req.body.id, { $pull: { address:{adname:req.body.name} } }, { new: true })
    .exec((err, doc) => {
      if (err) console.log(err)
      else res.send( doc)
    })
})

router.post('/forgetpasword', (req, res) => {
  const pass= encrypt(req.body.pasword)
  if (req.body.email !== null) {
    usar.findOneAndUpdate({ email: req.body.email},{pasword:pass},{new:true}).exec((err,doc)=>{
      if(err) console.log(err)
      else res.send({msg:"done",data:doc})
    })
  }
})



router.get('/viewall',(req,res)=>{
  usar.find()
  .populate("orders")
  .exec((err,doc)=>{
    if(err) console.log(err);
    else res.send(doc)
  })
})
module.exports = router




