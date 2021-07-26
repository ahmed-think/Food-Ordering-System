const express =require('express')
const app= express();
const mongoose=require('mongoose')

const mongoDB = 'mongodb://localhost/OrderingSystem';
mongoose.connect(mongoDB, {useNewUrlParser: true});
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
    
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/user',require('./routes/user'))
app.use('/resturant',require('./routes/resturant'))
app.use('/search',require('./routes/search'))
app.use('/order',require('./routes/order'))
app.use('/item',require('./routes/item'))
app.use('/catagory',require('./routes/catagory'))

const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{console.log(`Server started at port ${PORT}`)})