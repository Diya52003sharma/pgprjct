const Pgowner = require("./pgownerModel");
const User = require("../user/userModel")
const bcrypt = require("bcryptjs")
const saltround = 10
register = (req, res) => {
    var errMsg = []
    if (!req.body.pgName) {
        errMsg.push("PG Name is required");
    }
    if (!req.body.name) {
        errMsg.push("Owner Name is required");
    }
    if (!req.body.email) {
        errMsg.push("Email is required");
    }
    if (!req.body.contact) {
        errMsg.push("Contact is required");
    }
    if (!req.body.address) {
        errMsg.push("Address is required");
    }
    if (!req.body.location) {
        errMsg.push("Location is required");
    }
    if (!req.body.description) {
        errMsg.push("Description is required");
    }
    if (!req.body.password) {
        errMsg.push("Password is required");
    }
    if (errMsg.length > 0) {
        res.json({
            message: errMsg,
            status: 422,
            success: false
        })
    }

    else {
        //insert
        User.findOne({ email: req.body.email })
            .then((userdata) => {
                if (!userdata) {
                    let userObj = new User()
                    userObj.name = req.body.name
                    userObj.email = req.body.email
                    userObj.password = bcrypt.hashSync(req.body.password, saltround)
                    userObj.userType = 2
                    userObj.save()
                        .then((userd) => {
                            let pgObj = new Pgowner()
                            pgObj.userId = userd._id
                            pgObj.name = req.body.name
                            pgObj.email = req.body.email
                            pgObj.pgName = req.body.pgName,
                                pgObj.contact = req.body.contact,
                                pgObj.address = req.body.address,
                                pgObj.location = req.body.location,
                                pgObj.description = req.body.description,
                                pgObj.save()
                                    .then((userregistereddata) => {
                                        userObj.pgOwnerId = userregistereddata._id
                                        userObj.save()
                                        res.send({
                                            message: "PGOWNER  Registered successfully!!",
                                            status: 200,
                                            success: true,
                                            data: userregistereddata
                                        })
                                    })
                                    .catch((err) => {
                                        res.json({
                                            message: "Something Went wrong",
                                            status: 500,
                                            success: false
                                        })
                                    })

                        })
                        .catch((err) => {
                            res.json({
                                message: "Something Went Wrong",
                                status: 500,
                                success: false
                            })
                        })

                }
                else {
                    res.json({
                        message: "User already exist with same email",
                        status: 422,
                        success: false
                    })
                        .catch((err) => {
                            res.json({
                                message: "Something went wrong",
                                status: 500,
                                success: false
                            })
                        })
                }
            })
    }
}

const pgownermodel = require("./pgownerModel"); // Assuming you have a PG Owner model file

// Add a new PG Owner with validation and duplicacy check
add = (req, res) => {
    let errMsg = [];

    // Validations
    if (!req.body.pgName) {
        errMsg.push("PG Name is required");
    }
    if (!req.body.name) {
        errMsg.push("Owner Name is required");
    }
    if (!req.body.email) {
        errMsg.push("Email is required");
    }
    if (!req.body.contact) {
        errMsg.push("Contact is required");
    }
    if (!req.body.address) {
        errMsg.push("Address is required");
    }
    if (!req.body.location) {
        errMsg.push("Location is required");
    }
    if (!req.body.description) {
        errMsg.push("Description is required");
    }
    if (!req.body.password) {
        errMsg.push("Password is required");
    }

    if (errMsg.length > 0) {
        return res.status(422).send({
            status: 422,
            success: false,
            message: errMsg
        });
    }

    // Check for duplicacy based on PG Owner's email
    pgownermodel.findOne({ email: req.body.email })
        .then(existingOwner => {
            if (existingOwner) {
                res.status(422).send({
                    status: 422,
                    success: false,
                    message: "PG Owner with this email already exists"
                });
            } else {
                // Create a new PG Owner
                let pgowner = new pgownermodel({
                    pgName: req.body.pgName,
                    name: req.body.name,
                    email: req.body.email,
                    contact: req.body.contact,
                    address: req.body.address,
                    location: req.body.location,
                    description: req.body.description,
                });

                // Save the PG Owner
                pgowner.save()
                    .then(data => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "PG Owner inserted successfully",
                            data: data
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: 500,
                            success: false,
                            message: "Internal server error",
                            errmsg: err
                        });
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err
            });
        });
}
getSingle = (req, res) => {
    pgownermodel.findOne({userId: req.body._id})
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
// Get all PG Owners
getall = (req, res) => {
    pgownermodel.find()
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
updatestatus = (req, res) => {
    let errmsgs = [];

    if (!req.body.userId) {
        errmsgs.push("_id is required");
    }
    if (!req.body.status) {
        errmsgs.push("status is required");
    }

    if (errmsgs.length > 0) {
        return res.status(422).send({
            message: errmsgs,
            status: 422,
            success: false
        });
    }

    User.findOne({ _id: req.body.userId })
        .then(userdata => {
            if (userdata === null) {
                res.status(404).send({
                    message: "User not found",
                    success: false,
                    status: 404
                });
            } else {
                // Update the userdata fields
                userdata.status = req.body.status;
                userdata.save()
                    .then(updateddata => {
                        Pgowner.findOne({ userId: req.body.userId })
                            .then(pgowenerdata => {
                                if (pgowenerdata === null) {
                                    res.status(404).send({
                                        message: "Pgowener  not found",
                                        success: false,
                                        status: 404
                                    });
                                } else {
                                    pgowenerdata.status = req.body.status;
                                    pgowenerdata.save()
                                        .then((data) => {
                                            res.json({
                                                message: "Status updated successfully",
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
updateProfile = (req, res) => {
    let errmsgs = [];

    if (!req.body.userId) {
        errmsgs.push("_id is required");
    }

    if (errmsgs.length > 0) {
        return res.status(422).send({
            message: errmsgs,
            status: 422,
            success: false
        });
    }

    User.findOne({ _id: req.body.userId })
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
                userdata.save()
                    .then(updateddata => {
                        Pgowner.findOne({ userId: req.body.userId })
                            .then(pgowenerdata => {
                                if (pgowenerdata === null) {
                                    res.status(404).send({
                                        message: "Pgowener  not found",
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
                                    if (req.body.pgName) {
                                        pgowenerdata.pgName = req.body.pgName;
                                    }
                                    if (req.body.contact) {
                                        pgowenerdata.contact = req.body.contact;
                                    }
                                    if (req.body.address) {
                                        pgowenerdata.address = req.body.address;
                                    }
                                    if (req.body.location) {
                                        pgowenerdata.location = req.body.location;
                                    }
                                    if (req.body.description) {
                                        pgowenerdata.description = req.body.description;
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

module.exports = { register, add, getall, updatestatus, updateProfile ,getSingle}