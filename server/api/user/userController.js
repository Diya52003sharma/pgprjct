const User = require("./userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const key = "123#";

const login = (req, res) => {
    let errMsg = [];

    if (!req.body.email)
        errMsg.push("Email is required");

    if (!req.body.password)
        errMsg.push("Password is required");

    if (errMsg.length > 0) {
        return res.json({
            success: false,
            status: 422,
            messages: errMsg
        });
    }

    User.findOne({ email: req.body.email })
        .then((userdata) => {

            console.log(userdata);

            if (userdata == null) {
                return res.json({
                    success: false,
                    status: 404,
                    message: "User Not Found"
                });
            }

            if (userdata.status == false) {
                return res.json({
                    success: false,
                    status: 422,
                    message: "Your account is blocked! Please contact admin."
                });
            }

            bcrypt.compare(req.body.password, userdata.password, function (err, ismatch) {

                if (err) {
                    return res.json({
                        success: false,
                        status: 500,
                        message: "Internal Server Error"
                    });
                }

                if (!ismatch) {
                    return res.json({
                        success: false,
                        status: 422,
                        message: "Password is wrong"
                    });
                }

                console.log("Login Successfully");

                let payload = {
                    _id: userdata._id,
                    email: userdata.email,
                    name: userdata.name
                };

                const token = jwt.sign(payload, key);

                return res.json({
                    success: true,
                    status: 200,
                    message: "Login Successfully",
                    token: token,
                    data: userdata
                });

            });

        })
        .catch((err) => {

            console.log(err);

            return res.json({
                success: false,
                status: 500,
                message: "Internal Server Error"
            });

        });
};


const changePassword = (req, res) => {

    let errMsg = [];

    if (!req.body.userId)
        errMsg.push("UserId is required");

    if (!req.body.currentpassword)
        errMsg.push("Current password is required");

    if (!req.body.newpassword)
        errMsg.push("New password is required");

    if (errMsg.length > 0) {
        return res.json({
            success: false,
            status: 422,
            message: errMsg
        });
    }

    User.findOne({ _id: req.body.userId })
        .then((userdata) => {

            if (userdata == null) {
                return res.json({
                    success: false,
                    status: 404,
                    message: "User not found"
                });
            }

            if (!bcrypt.compareSync(req.body.currentpassword, userdata.password)) {

                return res.json({
                    success: false,
                    status: 422,
                    message: "Current password is wrong"
                });

            }

            userdata.password = bcrypt.hashSync(req.body.newpassword, 10);

            userdata.save()
                .then(() => {

                    return res.json({
                        success: true,
                        status: 200,
                        message: "Password updated successfully"
                    });

                })
                .catch((err) => {

                    console.log(err);

                    return res.json({
                        success: false,
                        status: 500,
                        message: "Internal Server Error"
                    });

                });

        })
        .catch((err) => {

            console.log(err);

            return res.json({
                success: false,
                status: 500,
                message: "Internal Server Error"
            });

        });

};

module.exports = {
    login,
    changePassword
};