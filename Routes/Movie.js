const express = require('express')
const router = express.Router()


const User = require('../Models/UserSchema')
const Movie = require('../Models/MovieSchema')
const Booking = require('../Models/BookingSchema')
const Screen = require('../Models/ScreenSchema')


const errorHandler = require('../Middleware/errorMiddleware');
const authTokenHandler = require('../Middleware/checkAuthToken');
const adminTokenHandler = require('../Middleware/checkAdminToken');


function createRespons(ok , message, data){
    return {
        ok, 
        message, 
        data
    };
}

router.get('/test', async (req, res) => {
    res.json({
        message: "Movie API is working!!"
    })
})


// // admin access
router.post('/createmovie', adminTokenHandler, async (req, res, next) => {})
router.post('/addcelebtomovie', adminTokenHandler, async (req, res, next) => {})
router.post('/createscreen', adminTokenHandler, async (req, res, next) => {})
router.post('/addmoviescheduletoscreen', adminTokenHandler, async (req, res, next) => {})


// // user access
router.post('/bookticket', authTokenHandler, async (req, res, next) => {})
router.get('/getmovies', async (req, res, next) => {})
router.get('/getscreens', async (req, res, next) => {})




router.use(errorHandler)

module.exports = router;