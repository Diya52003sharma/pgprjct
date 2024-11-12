const enquirymodel = require("./enquiryModel");

// Add a new enquiry with validation and duplicacy check
add = (req, res) => {
    let errMsg = [];

    if (!req.body.name) {
        errMsg.push("Name is required");
    }
    if (!req.body.email) {
        errMsg.push("Email is required");
    }
    if (!req.body.subject) {
        errMsg.push("Subject is required");
    }
    if (!req.body.message) {
        errMsg.push("Message is required");
    }

    if (errMsg.length > 0) {
        return res.status(422).send({
            status: 422,
            success: false,
            message: errMsg
        });
    }

    // Check for duplicacy based on email
    enquirymodel.findOne({ email: req.body.email })
        .then(existingEnquiry => {
            if (existingEnquiry) {
                res.status(422).send({
                    status: 422,
                    success: false,
                    message: "Enquiry with this email already exists"
                });
            } else {
                let enquiry = new enquirymodel({
                    name: req.body.name,
                    email: req.body.email,
                    subject: req.body.subject,
                    message: req.body.message
                });

                enquiry.save()
                    .then(data => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Enquiry created successfully",
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

// Get all enquiries
getall = (req, res) => {
    enquirymodel.find()
        .then(enquirydata => {
            res.json({
                status: 200,
                success: true,
                message: "Data loaded successfully",
                data: enquirydata
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

// Get a single enquiry by ID
getsingle = (req, res) => {
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

    enquirymodel.findOne({ _id: req.body._id })
        .then(enquirydata => {
            if (enquirydata === null) {
                res.status(404).send({
                    status: 404,
                    success: false,
                    message: "Enquiry not found",
                    data: enquirydata
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    message: "Enquiry loaded successfully",
                    data: enquirydata
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

// Update an enquiry
updatedata = (req, res) => {
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

    enquirymodel.findOne({ _id: req.body._id })
        .then(ress => {
            if (ress === null) {
                res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found"
                });
            } else {
                // Update fields if they are provided
                if (req.body.name) {
                    ress.name = req.body.name;
                }
                if (req.body.email) {
                    ress.email = req.body.email;
                }
                if (req.body.subject) {
                    ress.subject = req.body.subject;
                }
                if (req.body.message) {
                    ress.message = req.body.message;
                }

                ress.save()
                    .then(updateddata => {
                        res.json({
                            message: "Data updated successfully",
                            status: 200,
                            data: updateddata
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: "Internal server error",
                            status: 500,
                            errmsg: err
                        });
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Internal server error",
                status: 500,
                errmsg: err
            });
        });
}

// Delete an enquiry by ID with validation
deleteOne = (req, res) => {
    let errmsgs = [];

    if (!req.body._id) {
        errmsgs.push("_id is required");
    }

    if (errmsgs.length > 0) {
        return res.send({
            message: errmsgs,
            status: 422,
            success: false
        });
    }

    enquirymodel.deleteOne({ _id: req.body._id })
        .then(data => {
            if (data.deletedCount === 0) {
                res.status(404).send({
                    message: "Enquiry not found",
                    status: 404,
                    success: false
                });
            } else {
                res.json({
                    message: "Enquiry deleted successfully",
                    status: 200,
                    data: data,
                    success:true
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Internal server error",
                status: 500,
                errmsg: err
            });
        });
}

module.exports = { add, getall, getsingle, updatedata, deleteOne };
