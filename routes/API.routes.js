const router = require('express').Router();

// auth
router.use('/auth', require('../controllers/Auth'));


// review
router.use('/review', require('../controllers/Review'));




// last route: 404
// router.use('/', (req, res) => {
//     res.status(404).json({
//         message: 'Wrong endpoint! Route Not found.'
//     });
// });

module.exports = router;