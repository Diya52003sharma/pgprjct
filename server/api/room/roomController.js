const roommodel = require("./roomModel");

// Add a new room with validation and duplicacy check
add = (req, res) => {
    let errMsg = [];

    if (!req.body.Name) {
        errMsg.push("Name is required");
    }
    if (!req.file) {
        errMsg.push("Image is required");
    }
    if (!req.body.description) {
        errMsg.push("Description is required");
    }
    if (!req.body.rent) {
        errMsg.push("rent is required");
    }

    if (errMsg.length > 0) {
        return res.status(422).send({
            status: 422,
            success: false,
            message: errMsg
        });
    }

    // Check for duplicacy based on room name
    roommodel.findOne({ Name: req.body.Name })
        .then(existingRoom => {
            if (existingRoom) {
                res.send({
                    status: 422,
                    success: false,
                    message: "Room with this name already exists"
                });
            } else {
                let room = new roommodel({
                    Name: req.body.Name,
                    Image: "room/" + req.file.filename,
                    categoryId: req.body.categoryId,
                    pgownerId: req.body.pgownerId,
                    description: req.body.description,
                    rent: req.body.rent
                });

                room.save()
                    .then(data => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Room inserted successfully",
                            data: data
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({
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
            res.json({
                status: 500,
                success: false,
                message: "Internal server error",
                errmsg: err
            });
        });
}

// Get all rooms
getall = (req, res) => {
    roommodel.find()
        // .populate("categoryId",'categoryName')
        .populate("categoryId")
        .populate({
            path: "pgownerId",
            populate: {
                path: "pgOwnerId"
            }
        })
        .then(roomdata => {
            res.json({
                status: 200,
                success: true,
                message: "Data loaded successfully",
                data: roomdata
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

// Get a single room by ID
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

    roommodel.findOne({ _id: req.body._id })
        .populate("categoryId")
        .populate({
            path: "pgownerId",
            populate: {
                path: "pgOwnerId" 
            }
        })
        .then(roomdata => {
            if (roomdata === null) {
                res.send({
                    status: 404,
                    success: false,
                    message: "Room not found",
                    data: roomdata
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    message: "Room loaded successfully",
                    data: roomdata
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

// Update a room
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

    roommodel.findOne({ _id: req.body._id })
        .then(ress => {
            if (ress === null) {
                res.status(404).send({
                    success: false,
                    status: 404,
                    message: "Data not found"
                });
            } else {
                // Update fields if they are provided
                if (req.body.Name) {
                    ress.Name = req.body.Name;
                }
                if (req.file) {
                    ress.Image = "room/" + req.file.filename;
                }
                if (req.body.description) {
                    ress.description = req.body.description;
                }
                if (req.body.rent) {
                    ress.rent = req.body.rent;
                }

                ress.save()
                    .then(updateddata => {
                        res.json({
                            message: "Data updated successfully",
                            status: 200,
                            success: true,
                            data: updateddata
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: "Internal server error",
                            status: 500,
                            success: false,
                            errmsg: err
                        });
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({
                message: "Internal server error",
                status: 500,
                success: false,
                errmsg: err
            });
        });
}

// Delete a room by ID with validation
deleteOne = (req, res) => {
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

    roommodel.deleteOne({ _id: req.body._id })
        .then(data => {
            if (data.deletedCount === 0) {
                res.status(404).send({
                    message: "Room not found",
                    status: 404,
                    success: false
                });
            } else {
                res.json({
                    message: "Room deleted successfully",
                    status: 200,
                    data: data
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
