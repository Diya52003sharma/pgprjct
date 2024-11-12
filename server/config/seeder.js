const User =require("../api/user/userModel")
const bcrypt = require("bcryptjs")
const saltround=10
adminreg=()=>{
    User.findOne({email:"admin@gmail.com"})
    .then(userdata=>
    {
        if(userdata ==null)
        {
            let userObj =new User()
            userObj.email ="admin@gmail.com"
            userObj.password=bcrypt.hashSync("123",saltround)
            userObj.userType =1
            userObj.name="admin"
            userObj.save()
            .then((data)=>
            {
                console.log("admin registered")
            })
            .catch((err)=>{
                console.log(err);
                
                
            })
        }
        else
        {
            console.log("admin already exists");
        }
    })
    .catch(err=>{
        console.log(err)
    })
}
module.exports ={adminreg}