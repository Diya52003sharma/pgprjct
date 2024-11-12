const key ="123#"
var jwt =require("jsonwebtoken")
module.exports=(req,res,next)=>
{
    const token =req.headers["authorization"]
    jwt.verify(token,key,function(err,data)
{
    if(err !=null)
    {
        res.json({
            message:"unauthorized",
            success:false,
            status:422
        })
    }
    else{
        next();
    }
})
}