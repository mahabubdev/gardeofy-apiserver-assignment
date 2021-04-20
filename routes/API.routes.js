const router = require('express').Router();

// auth
router.use('/auth', require('../controllers/Auth'));


// review
router.use('/review', require('../controllers/Review'));


// orders
router.use('/order', require('../controllers/Order'));


// services
router.use('/service', require('../controllers/Service'));



// last route: 404
// router.use('/', (req, res) => {
//     res.status(404).json({
//         message: 'Wrong endpoint! Route Not found.'
//     });
// });

module.exports = router;