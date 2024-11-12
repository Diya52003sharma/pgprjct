const User = require("./userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const key = "123#"
login = (req,res)=>{
    var errMsg =[]
    
    if(!req.body.email)
        errMsg.push("email is required")
    if(!req.body.password)
        errMsg.push("passsword is required")
    if(errMsg.length>0){
        res.json({
            status:422,
            success:false,
            messages:errMsg
        })
    }
    else{
        User.findOne({email:req.body.email})
        .then((userdata)=>{
            console.log(userdata);
            if(userdata == null){
                res.json({
                    message:"User Not found",
                    success:false,
                    status:404
                })
            }
            if(userdata.status == "false"){
                res.json({
                    message:"Your account is Blocked!! please contact to admin for Active your account!!!",
                    success:false,
                    status:422
                }) 
            }
            else{
                if(userdata.status==true){
                    bcrypt.compare(req.body.password,userdata.password,function(err,ismatch){
                        if(!ismatch){
                            // console.log("passsword is wrong");
                            res.json({
                                success:false,
                                status:422,
                                message:"password is wrong"
                            })
                            
                        }
                        else{
                            console.log("login successfully");
                            let payload = {
                                _id:userdata._id,
                                email:userdata.email,
                                name:userdata.name
                            }
                           const token = jwt.sign(payload,key)
    
                            res.json({
                                success:true,
                                status:200,
                                message:"Login Successfully",
                                token:token,
                                data:userdata
                              
                            })
                            
                        }
                    })
                }
                else{
                    res.json({
                        message:"User Inactive Please contact to admin!!",
                        success:false,
                        status:404
                    })

                }
                // login logic
            }
            
        })  
        .catch(err=>{
            console.log(err);
            res.json({
                message:"Internel Server Error",
                success:false,
                status:500
            })
            
        })
    }

}
changePassword = (req,res)=>{
    var errMsg = []
    if(!req.body.userId)
        errMsg.push("userId is required")
    if(!req.body.currentpassword)
        errMsg.push("current password is required")
    if(!req.body.newpassword)
        errMsg.push("new password is required")
    if(errMsg.length>0){
        res.send({
            success:false,
            status:422,
            message:errMsg
        })
    }
    else{
        User.findOne({_id:req.body.userId})
        .then((userdata)=>{ 
                if(userdata == null){
                    res.send({
                        success:false,
                        status:404,
                        message:"user not found"
                    })
                }
                else{
                    // change password
                    if(bcrypt.compareSync(req.body.currentpassword,userdata.password)){
                        // update password
                        userdata.password = bcrypt.hashSync(req.body.newpassword,10)
                        userdata.save()
                        .then(updateddata =>{
                            res.send({
                                success:true,
                                status:200,
                                message:"password updated"
                            })
                        })
                        .catch(err=>{
                            res.json({
                                success:false,
                                status:500,
                                message:"Internel server error"
                            })
                        })

                    }
                    else{
                            // wrong password
                            res.json({
                                success:false,
                                status:422,
                                message:"Current password is wrong"
                            })
                    }

                }
        })
        .catch(err=>{
            res.json({
                success:false,
                status:500,
                message:"internel server error"
            })
        })

    }
  
}

module.exports = {login,changePassword}
