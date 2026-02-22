
const express = require("express")

const app = express()

const PORT = 5000
const db = require("./server/config/db")
const cors = require('cors')
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json({limit:'50mb'}))
app.use(express.static('./server/public/'))

const routes = require('./server/routes/apiRoutes')
app.use('/api',routes)
const adminadd = require("./server/config/seeder")
adminadd.adminreg();
app.use(express.urlencoded({extended:true}))
app.use(express.static('./build'))
app.get('/',(req,res)=>{
    res.json({
    
        status:200,
        success:true,
        message:"api hit "
    })
})

app.listen(PORT, (err => {
    if (err) {
        console.log("error in server", err);
    }
    else {
        console.log("server is running",PORT);

    }
}))


