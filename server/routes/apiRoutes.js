const routes = require('express').Router()
const categoryController = require("../api/category/categoryController")
const roomController = require("../api/room/roomController")
const bookingController = require("../api/booking/bookingController")
const enquiryController = require("../api/enquiry/enquiryController")
const UserController =require("../api/user/userController")
const PgownerController =require("../api/pgowner/pgownerController")
const tenantController =require("../api/tenant/tenantController")
const dashboardController = require("../dashboard/dashboardController")
const multer = require('multer')
routes.post('/dashboard',dashboardController.dashboard)
//register
//login
routes.post('/user/login',UserController.login)
//get all
routes.post('/booking/all',bookingController.getall)
routes.post('/enquiry/all',enquiryController.getall)
routes.post('/room/all',roomController.getall)
routes.post('/category/all',categoryController.getall)
routes.post('/tenant/register',tenantController.register)
// routes.post('/tenant/add',tenantController.add)
routes.post('/enquiry/add',enquiryController.add)
routes.post('/pgowner/all',PgownerController.getall)
//middleware
routes.post('/room/single',roomController.getsingle)
routes.post('/pgowner/register',PgownerController.register)
routes.use(require("../config/middleware"))
routes.post('/user/changepassword',UserController.changePassword)
const categorystorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './server/public/categoryImage/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+file.originalname)
  }
})

const categoryupload = multer({ storage: categorystorage })
routes.post('/tenant/getsingle',tenantController.getSingle)
routes.post('/tenant/getall',tenantController.getall)
routes.post('/tenant/updateProfile',tenantController.updateProfile)
routes.post('/category/add',categoryupload.single('categoryImage'),categoryController.add)
routes.post('/category/all',categoryController.getall)
routes.post('/category/single',categoryController.getsingle)
routes.post('/category/update',categoryupload.single('categoryImage'),categoryController.updatedata)
routes.post('/category/delete',categoryController.deleteOne)
const roomstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'server/public/room/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+file.originalname)
  }
})

const roomupload = multer({ storage: roomstorage })
routes.post('/room/add',roomupload.single("Image"),roomController.add)

routes.post('/room/update',roomupload.single("Image"),roomController.updatedata)
routes.post('/room/delete',roomController.deleteOne)

routes.post('/booking/add',bookingController.add)

routes.post('/booking/single',bookingController.getsingle)
routes.post('/booking/update',bookingController.updatedata)
routes.post('/booking/delete',bookingController.deleteOne)


routes.post('/enquiry/single',enquiryController.getsingle)
routes.post('/enquiry/update',enquiryController.updatedata)
routes.post('/enquiry/delete',enquiryController.deleteOne)

routes.post('/pgowner/add',PgownerController.add)
// routes.post('/pgowner/update',PgownerController.updatedata)
// routes.post('/pgowner/delete',PgownerController.deleteOne)
routes.post('/pgowner/updatestatus',PgownerController.updatestatus)
routes.post('/pgowner/updateProfile',PgownerController.updateProfile)
routes.post('/pgowner/getSingle',PgownerController.getSingle)


module.exports = routes