const router = require('express').Router();
const JWT_CHECK = require('../../middlewares/JWT');
const ADMIN_CHECK = require('../../middlewares/Admin');
const { OrderModel, UserModel } = require('../../models');
const uid = require('myuid');



router.post('/add', [JWT_CHECK], async (req, res) => {
    const {user} = req;
    const { serviceId, paymentInfo } = req.body;
    if (!serviceId || !paymentInfo) {
        return res.status(422).json({
            message: 'Error! please give proper info',
            errCode: 'error-validation',
            errors: err
        })
    }

    // create order
    const newOrderObj = {
        uid: uid(),
        service: serviceId,
        info: paymentInfo,
        user: user._id,
    };

    const newOrder = new OrderModel(newOrderObj);
    await newOrder.save()
    .then(async (data) => {
        // also add in user's model
        await UserModel.findByIdAndUpdate(user._id, {
            $push: {
                orders: data._id,
            }
        }, {new: true})
        .then(resp => {
            res.status(201).json({
                message: 'Order placed successfully!',
                data: resp,
            })
        })
        .catch(err => {
            res.status(400).json({
                message: err.message,
                errCode: 'error-400',
                errors: err
            })
        })
    })
    .catch(err => {
        res.status(400).json({
            message: err.message,
            errCode: 'error-400',
            errors: err
        })
    })
});










// get all orders of a user
router.get('/user', [JWT_CHECK], async (req, res) => {
    const { user } = req; 

    await OrderModel.find({
        user: user._id,
    })
    .sort({createdAt: -1})
    .populate('service')
    .select('-__v')
    .then(data => res.json(data))
    .catch(err => {
        res.status(400).json({
            message: err.message,
            errCode: 'error-server-or-database',
            errors: err
        })
    })
});




// get all orders of a user
router.get('/', [JWT_CHECK, ADMIN_CHECK], async (req, res) => {

    await OrderModel.find({})
    .sort({createdAt: -1})
    .populate('service user')
    .select('-__v')
    .then(data => res.json(data))
    .catch(err => {
        res.status(400).json({
            message: err.message,
            errCode: 'error-server-or-database',
            errors: err
        })
    })
});






router.put('/update', [JWT_CHECK, ADMIN_CHECK], async (req, res) => {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
        return res.status(422).json({
            message: 'Error! please give proper info',
            errCode: 'error-validation',
            errors: err
        })
    }

    const findOrder = await OrderModel.findOne({ uid: orderId });
    if (! findOrder) {
        //
        return res.stats(404).json({
            message: 'Order not found',
            errCode: 'error-404',
        })
    }

    await OrderModel.findByIdAndUpdate(findOrder._id, {
        $set: {
            status: status,
        }
    }, {new: true})
    .then(() => {
        res.status(202).json({
            message: 'Order status has been changed',
        })
    })
    .catch(err => {
        res.status(400).json({
            message: err.message,
            errors: err,
            errCode: 'error-server-or-database'
        })
    })
});




// DELETE An ORDER
router.delete('/remove', [JWT_CHECK, ADMIN_CHECK], async(req, res) => {
    const { orderId } = req.query;
    const findOrder = await OrderModel.findOne({ uid: orderId });
    if (! findOrder) {
        return res.status(404).json({
            message: 'Order not found!',
            errCode: 'error-404',
            errors: err
        })
    }

    await OrderModel.findByIdAndDelete(findOrder._id)
    .then(() => {
        res.status(201).json({
            message: 'Order has been removed successfully!',
        })
    })
    .catch(err => {
        res.status(400).json({
            message: err.message,
            errors: err,
            errCode: 'error-server-or-database'
        })
    })
});





module.exports = router;