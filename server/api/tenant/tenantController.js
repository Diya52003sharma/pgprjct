const Tenant = require("./tenantModel");
const User = require("../user/userModel");
const bcrypt = require("bcryptjs");
const tenantModel = require("./tenantModel");
const saltround = 10;

register = async (req, res) => {
    var errMsg = [];

    // Validate input fields
    if (!req.body.name) errMsg.push("Name is required");
    if (!req.body.email) errMsg.push("Email is required");
    if (!req.body.password) errMsg.push("Password is required");
    if (!req.body.address) errMsg.push("Address is required");
    if (!req.body.contact) errMsg.push("Contact is required");

    // If there are validation errors, return them
    if (errMsg.length > 0) {
        return res.status(422).json({
            message: errMsg,
            success: false
        });
    } else {
        try {
            // Check if a user already exists with the same email
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(422).json({
                    message: "User already exists with the same email",
                    success: false
                });
            }

            // If user doesn't exist, create new user
            let userObj = new User();
            userObj.name = req.body.name;
            userObj.email = req.body.email;
            userObj.userType = 3;
            const hashedPassword = await bcrypt.hash(req.body.password, saltround);
            userObj.password = hashedPassword;
            // Save the user to the database
            const savedUser = await userObj.save();
            // Create and save the tenant information
            let pgObj = new Tenant();
            pgObj.userId = savedUser._id;
            pgObj.name = req.body.name;
            pgObj.email = req.body.email;
            pgObj.address = req.body.address;
            pgObj.contact = req.body.contact;

            const savedTenant = await pgObj.save();

            // If everything is successful, send a response
            res.status(200).json({
                message: "Tenant Registered successfully!!",
                success: true
            });

        } catch (err) {
            console.error(err);  // Log the error for debugging
            res.status(500).json({
                message: "Something went wrong",
                success: false
            });
        }
    }
};
getSingle = (req, res) => {
    tenantModel.findOne({userId: req.body._id})
        .then(pgOwnerData => {
            // console.log(pgOwnerData);
            
            res.json({
                status: 200,
                success: true,
                message: "PG Owner data loaded successfully",
                data: pgOwnerData
            });
        })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err
            });
        });
}
getall = (req, res) => {
    tenantModel.find()
        .then(pgOwnerData => {
            res.json({
                status: 200,
                success: true,
                message: "PG Owner data loaded successfully",
                data: pgOwnerData
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err
            });
        });
}
updateProfile = (req, res) => {
    let errmsgs = [];

    if (!req.body._id) {
        errmsgs.push("_id is required");
    }

    if (errmsgs.length > 0) {
        return res.status(422).send({
            message: errmsgs,
            status: 422,
            success: false
        });
    }

    User.findOne({ _id: req.body._id })
        .then(userdata => {
            if (userdata === null) {
                res.status(404).send({
                    message: "User not found",
                    success: false,
                    status: 404
                });
            } else {
                // Update the userdata fields
                if (req.body.email) {
                    userdata.email = req.body.email;
                }
                if (req.body.name) {
                    userdata.name = req.body.name;
                }
                if (req.body.status) {
                    userdata.status = req.body.status;
                }
                userdata.save()
                    .then(updateddata => {
                        tenantModel.findOne({ userId: req.body._id })
                            .then(pgowenerdata => {
                                if (pgowenerdata === null) {
                                    res.status(404).send({
                                        message: "Tenant  not found",
                                        success: false,
                                        status: 404
                                    });
                                } else {
                                    if (req.body.email) {
                                        pgowenerdata.email = req.body.email;
                                    }
                                    if (req.body.name) {
                                        pgowenerdata.name = req.body.name;
                                    }
                                    if (req.body.contact) {
                                        pgowenerdata.contact = req.body.contact;
                                    }
                                    if (req.body.address) {
                                        pgowenerdata.address = req.body.address;
                                    }
                                    if (req.body.status) {
                                        pgowenerdata.status = req.body.status;
                                    }
                                    pgowenerdata.save()
                                        .then((data) => {
                                            res.json({
                                                message: "Profile updated successfully",
                                                status: 200,
                                                data: data,
                                                success: true
                                            });
                                        })
                                        .catch((err) => {
                                            res.json({
                                                message: "Internal server error",
                                                status: 500,
                                                errmsg: err,
                                                success: false
                                            })
                                        })

                                }
                            })
                    })
                    .catch(err => {
                        res.json({
                            message: "Internal server error",
                            status: 500,
                            errmsg: err,
                            success: false
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Internal server error",
                status: 500,
                errmsg: err,
                success: false
            });
        });
}
module.exports = { register,add,getall,updateProfile,getSingle };
