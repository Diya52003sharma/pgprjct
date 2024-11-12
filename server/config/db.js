const mongoose = require("mongoose")


const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});
const db = process.env.DB;
mongoose.connect(db,{
    useNewUrlParser :true
})
.then(()=>{console.log('MongoDb connected....');})
.catch((err)=>{console.log(err);})