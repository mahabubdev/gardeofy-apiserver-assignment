const router = require('express').Router();
const { UserModel, ReviewModel } = require('../../models');
const JWT_CHECK = require('../../middlewares/JWT');
const { reviewInputs } = require('../../helpers/validations')

// ADD NEW FEEDBACK/Review
router.post('/add', [JWT_CHECK], async (req, res) => {
    const { user } = req;

    // validation
    let validate = reviewInputs(req.body);
    let {error, value} = validate;
    if (error) {
        // errors
        return res.status(400).json({
            message: 'Validation Error!',
            errors: error.details
        })
    }

    // check duplicate by same user
    const findUser = await UserModel.findOne({ email: user.email });
    if (findUser.review.length >= 1) {
        // error: already have one
        return res.status(400).json({
            message: 'Duplicate entry',
            errCode: 'error-duplicate'
        })
    }


    // make your review
    const newRev = new ReviewModel({
        description: value.description,
        user: user._id,
    });
    await newRev.save()
    .then(async (rv) => {
        // also save in user_model
        await UserModel.findByIdAndUpdate(user._id, {
            $push: {review: rv._id},
        }, {new: true})
    })
    .then((rv_data) => {
        res.status(201).json({
            message: 'Review added',
            data: rv_data
        })
    })
});



// GET review for homepage
router.get('/', async (req, res) => {
    await ReviewModel.find({}).populate('user', '-__v -user.review')
    .then(data => {
        res.json(data)
    })
    .catch(err => res.status(400).json({
        message: err.message,
        errCode: 'fetch-error or database query error',
        errors: err
    }))
})








// UPDATE Feedback/review
router.put('/update', [JWT_CHECK], async (req, res) => {
    const { user } = req;

    // validation
    let validate = reviewInputs(req.body);
    let {error, value} = validate;
    if (error) {
        // errors
        return res.status(400).json({
            message: 'Validation Error!',
            errors: error.details
        })
    }


    // check author
    const findRv = await ReviewModel.findOne({ uid: value.uid });
    if (! findRv) {
        // error: already have one
        return res.status(404).json({
            message: 'Error! Not found',
            errCode: 'error-404'
        })
    }

    if (findRv.user != user._id) {
        // error: Forbidden attempt
        return res.status(403).json({
            message: 'Error! Forbidden attempt',
            errCode: 'error-403'
        })
    }


    // now update
    let updating = findRv;
    updating.description = value.description;

    await ReviewModel.findByIdAndUpdate(findRv._id, updating, {new: true})
    .then(rv => {
        res.status(202).json({
            message: 'Review has been updated',
            data: rv
        })
    })
    .catch(err => {
        res.status(400).json({
            message: err.message,
            errors: err,
            errCode: 'error-400'
        })
    })
});














// DELETE Feedback/review
// router.delete();


// UPDATE Feedback/review
router.delete('/delete', [JWT_CHECK], async (req, res) => {
    const { user } = req;
    const { uid } = req.query; // uid


    // check author
    const findRv = await ReviewModel.findOne({ uid: uid });
    if (! findRv) {
        // error: already have one
        return res.status(404).json({
            message: 'Error! Not found',
            errCode: 'error-404'
        })
    }

    if (findRv.user != user._id) {
        // error: Forbidden attempt
        return res.status(403).json({
            message: 'Error! Forbidden attempt',
            errCode: 'error-403'
        })
    }


    // now delete

    await ReviewModel.findByIdAndDelete(findRv._id)
    .then(async () => {
        // also delete from user_model
        await UserModel.findByIdAndUpdate(user._id, {
            $pull: {
                review: findRv._id
            }
        }, {new: true})
        res.status(202).json({
            message: 'Review has been deleted',
            data: uid
        })
    })
    .catch(err => {
        res.status(400).json({
            message: err.message,
            errors: err,
            errCode: 'error-400'
        })
    })
});






module.exports = router;