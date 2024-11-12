const Category = require("./categoryModel");

// Add a new category with validation and duplication check
add = (req, res) => {
    let errMsg = [];
    
    if (!req.body.categoryName) {
        errMsg.push("categoryName is required");
    }
    if (!req.file) {
        errMsg.push("categoryImage is required");
    }
    if (!req.body.description) {
        errMsg.push("cdescription is required");
    }
    
    if (errMsg.length > 0) {
        return res.status(422).send({
            status: 422,
            success: false,
            message: errMsg
        });
    }

    Category.findOne({ categoryName: req.body.categoryName })
        .then(data => {
            if (data === null) {
                let category = new Category({
                    categoryName: req.body.categoryName,
                    categoryImage: "categoryImage/"+req.file.filename,
                    description: req.body.description
                });

                category.save()
                    .then(data => {
                        res.json({
                            status: 200,
                            success: true,
                            message: "Category inserted successfully",
                            data: data
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
            } else {
                res.status(422).send({
                    status: 422,
                    success: false,
                    message: "Category already exists"
                });
            }
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

// Get all categories
getall = (req, res) => {
    Category.find()
        .then(catedata => {
            res.json({
                status: 200,
                success: true,
                message: "Data loaded successfully",
                data: catedata
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

// Get a single category by ID
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

    Category.findOne({ _id: req.body._id })
        .then(categorydata => {
            if (categorydata === null) {
                res.status(404).send({
                    status: 404,
                    success: false,
                    message: "Category not found",
                    data: categorydata
                });
            } else {
                res.json({
                    status: 200,
                    success: true,
                    message: "Category loaded successfully",
                    data: categorydata
                });
            }
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

// Update a category
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

    Category.findOne({ _id: req.body._id })
        .then(category => {
            if (category === null) {
                res.status(404).send({
                    message: "Category not found",
                    success: false,
                    status: 404
                });
            } else {
                // Update the category fields
                if (req.body.categoryName) {
                    category.categoryName = req.body.categoryName;
                }
                if (req.file){
                    category.categoryImage = "categoryImage/"+req.file.filename;
                }
                if (req.body.description) {
                    category.description = req.body.description;
                }
                if (req.body.status) {
                    category.status = req.body.status;
                }

                category.save()
                    .then(updateddata => {
                        res.json({
                            message: "Category updated successfully",
                            status: 200,
                            data: updateddata,
                            success:true
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: "Internal server error",
                            status: 500,
                            errmsg: err,
                            success:false
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Internal server error",
                status: 500,
                errmsg: err,
                success:false
            });
        });
}

// Delete a category by ID with validation
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

    Category.deleteOne({ _id: req.body._id })
        .then(data => {
            if (data.deletedCount === 0) {
                res.status(404).send({
                    message: "Category not found",
                    status: 404,
                    success: false
                });
            } else {
                res.json({
                    message: "Category deleted successfully",
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
