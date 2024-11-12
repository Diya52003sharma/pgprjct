const bookingmodel = require("./bookingModel");

add = (req, res) => {
    let errMsg = [];
    if (!req.body.pgowner_id) {
        errMsg.push("pgowner_id is required");
    }
    if (!req.body.customer_id) {
        errMsg.push("customer_id is required");
    }
    if (!req.body.date) {
        errMsg.push("date is required");
    }
    if (errMsg.length > 0) {
        res.send({
            status: 422,
            success: false,
            message: errMsg
        });
    } else {
        bookingmodel.findOne({ room_id: req.body.room_id, user_id: req.body.user_id, date: req.body.date })
            .then(data => {
                if (data == null) {
                    // Add booking
                    let bookingObj = new bookingmodel();
                    bookingObj.pgowner_id = req.body.pgowner_id;
                    bookingObj.room_id = req.body.room_id;
                    bookingObj.customer_id = req.body.customer_id;
                    bookingObj.message = req.body.message;
                    bookingObj.date = req.body.date;
                    bookingObj.save()
                        .then((bookingData) => {
                            res.json({
                                status: 200,
                                success: true,
                                message: "Booking created successfully",
                                data: bookingData
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
                } else {
                    res.send({
                        status: 422,
                        success: false,
                        message: "Booking already exists"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errmsg: err
                });
            });
    }
};

getall = (req, res) => {
    bookingmodel.find()
    .populate("pgowner_id")
    .populate("room_id")
    .populate("customer_id")
        .then((bookingData) => {
            res.send({
                status: 200,
                success: true,
                message: "Data loaded successfully",
                data: bookingData
            });
        })
        .catch(err => {
            // console.log(err);
            
            res.send({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err
            });
        });
};

getsingle = (req, res) => {
    let errmsgs = [];
    if (!req.body._id) {
        errmsgs.push("_id is required");
    }
    if (errmsgs.length > 0) {
        res.send({
            message: errmsgs,
            status: 422,
            success: false
        });
    } else {
        bookingmodel.findOne({ _id: req.body._id })
            .then((data) => {
                if (data == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Data not found",
                        data: data
                    });
                } else {
                    res.send({
                        status: 200,
                        success: true,
                        message: "Single Booking data loaded",
                        data: data
                    });
                }
            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errmsg: err
                });
            });
    }
};

updatedata = (req, res) => {
    let errmsgs = [];
    if (!req.body._id) {
        errmsgs.push("_id is required");
    }
    if (errmsgs.length > 0) {
        res.send({
            message: errmsgs,
            status: 422,
            success: false
        });
    } else {
        bookingmodel.findOne({ _id: req.body._id })
            .then((booking) => {
                if (booking == null) {
                    res.send({
                        message: "Booking not found",
                        success: false,
                        status: 404
                    });
                } else {
                    // Update data
                    if (req.body.pgowner_id) booking.pgowner_id = req.body.pgowner_id;
                    if (req.body.user_id) booking.user_id = req.body.user_id;
                    if (req.body.date) booking.date = req.body.date;
                    if (req.body.message) booking.message = req.body.message;
                    if (req.body.status) booking.status = req.body.status;
                    booking.save()
                        .then((updatedData) => {
                            res.send({
                                message: "Data updated successfully",
                                status: 200,
                                data: updatedData
                            });
                        })
                        .catch((err) => {
                            res.send({
                                message: "Internal server error",
                                status: 500,
                                errmsg: err
                            });
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                res.send({
                    message: "Internal server error",
                    status: 500,
                    errmsg: err
                });
            });
    }
};

deleteOne = (req, res) => {
    let errmsgs = [];
    
    // Check if _id is provided
    if (!req.body._id) {
        errmsgs.push("_id is required");
    }

    if (errmsgs.length > 0) {
        res.send({
            message: errmsgs,
            status: 422,
            success: false
        });
    } else {
        // Verify if the document exists before deleting
        bookingmodel.findOne({ _id: req.body._id })
            .then((data) => {
                if (data == null) {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Booking not found"
                    });
                } else {
                    // Proceed with delete operation
                    bookingmodel.deleteOne({ _id: req.body._id })
                        .then((result) => {
                            res.send({
                                message: "Data Deleted successfully",
                                status: 200,
                                data: result
                            });
                        })
                        .catch((err) => {
                            res.send({
                                message: "Internal server error",
                                status: 500,
                                errmsg: err
                            });
                        });
                }
            })
            .catch((err) => {
                res.send({
                    status: 500,
                    success: false,
                    message: "Internal server error",
                    errmsg: err
                });
            });
    }
};

module.exports = { add, getall, getsingle, updatedata, deleteOne };
