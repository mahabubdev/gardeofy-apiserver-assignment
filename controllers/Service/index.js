const router = require('express').Router();
const { serviceInputs } = require('../../helpers/validations');
const { ServiceModel } = require('../../models');
const JWT_CHECK = require('../../middlewares/JWT');
const ADMIN_CHECK = require('../../middlewares/Admin');
const uid = require('myuid');


// ADD NEW SERVICE
router.post('/add', [JWT_CHECK, ADMIN_CHECK], async(req, res) => {
    let validate = serviceInputs(req.body);
    let {error, value} = validate;
    if (error) {
        // errors
        return res.status(400).json({
            message: 'Validation Error!',
            errors: error.details
        })
    }

    // make new service
    const newService = new ServiceModel({
        name: value.name,
        description: value.description,
        uid: uid(),
    });
    await newService.save()
    .then(srv => {
        res.status(201).json({
            message: 'Service added successfully!',
            data: srv
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






// DELETE A SERVICE
router.delete('/remove', [JWT_CHECK, ADMIN_CHECK], async(req, res) => {
    const { uid } = req.query;
    const findSrv = await ServiceModel.findOne({ uid: uid });
    if (! findSrv) {
        return res.status(404).json({
            message: 'Service not found!',
            errCode: 'error-404',
            errors: err
        })
    }

    await ServiceModel.findByIdAndDelete(findSrv._id)
    .then(() => {
        res.status(201).json({
            message: 'Service has been deleted successfully!',
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





// UPDATE A SERVICE
router.put('/update', [JWT_CHECK, ADMIN_CHECK], async(req, res) => {
    const { uid, status_only } = req.query;
    

    const findSrv = await ServiceModel.findOne({ uid: uid });
    if (! findSrv) {
        return res.status(404).json({
            message: 'Service not found!',
            errCode: 'error-404',
            errors: err
        })
    }

    if (parseInt(status_only) === 1) {
        // update status only
        const { status } = req.body;

        await ServiceModel.findByIdAndUpdate(findSrv._id, {
            $set: {
                status: status,
            }
        }, {new: true})
        .then(() => {
            res.status(202).json({
                message: 'Service status has been changed',
            })
        })
        .catch(err => {
            res.status(400).json({
                message: err.message,
                errors: err,
                errCode: 'error-server-or-database'
            })
        })
    } else {
        // update all
        res.status(400);
    }
});






// GET SERVICES
router.get('/', async (req, res) => {
    let filters = {};
    const { status } = req.query;
    if (status) {
        filters.status = status;
    }

    await ServiceModel.find(filters)
    .then(srv => res.json(srv))
    .catch(err => {
        res.status(400).json({
            message: err.message,
            errCode: 'error-server-or-database',
            errors: err
        })
    })
});



module.exports = router;