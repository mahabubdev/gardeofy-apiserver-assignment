const router = require('express').Router();
const { registerInputs, loginInputs } = require('../../helpers/validations');
const { UserModel } = require('../../models');
const { generateJWT } = require('../../helpers/jwt');
const JWT_CHECK = require('../../middlewares/JWT');



/**------------------------------------------*
 * Login
 *-------------------------------------------*/
 router.post('/login', async (req, res) => {
    let validate = loginInputs(req.body);
    let { error, value } = validate;

    if (error) {
        // errors
        return res.status(400).json({
            message: 'Validation Error!',
            errors: error.details,
            errCode: 'validation-error'
        })
    }

    // validation ok :=: next steps
    // check already exists or not ?
    const findUser = await UserModel.findOne({ email: value.email });
    if (! findUser) {
        // already exists
        return res.status(404).json({
            message: 'User not found!',
            errCode: 'error-404'
        });
    }

    // Password is handled by the Firebase Auth: going next
    
    // proceed to login
    try {
        // generate jwt
        const _jwt_ = await generateJWT({
            _id: findUser._id,
            email: findUser.email
        });

        // response
        res.status(202).json({
            message: 'User has been logged-in successfully!',
            data: {
                id: findUser._id,
                name: findUser.name,
                email: findUser.email,
                photo: findUser.photo,
                role: findUser.role
            },
            access_token: _jwt_,
        });
    }
    catch(err) {
        // some-thing wrong
        res.status(400).json({
            message: err.message,
            errors: err,
            errCode: 'error-400'
        });
    }
});




/**------------------------------------------*
 * Register
 *-------------------------------------------*/
 router.post('/register', async (req, res) => {
    let validate = registerInputs(req.body);
    let { error, value } = validate;
    if (error) {
        // errors
        return res.status(400).json({
            message: 'Validation Error!',
            errors: error.details
        })
    }

    // validation ok :=: next steps
    // check already exists or not ?
    const findUser = await UserModel.findOne({ email: value.email })
    if (findUser) {
        // already exists
        return res.status(400).json({
            message: 'User already exists!',
        });
    }

    // password is validated with Firebase Auth, so i will just do next
    let newUserObj = {
        name: value.name,
        email: value.email,
        photo: value.photo,
    };

    const newUser = new UserModel(newUserObj);
    await newUser.save()
    .then(async (data) => {
        // generate jwt_token
        const _jwt_ = await generateJWT({
            _id: data._id,
            email: data.email
        });


        res.status(201).json({
            message: 'User has been registered successfull!',
            data: {
                name: data.name,
                email: data.email,
                photo: data.photo,
                role: data.role
            },
            access_token: _jwt_,
        });
    })
    .catch(err => {
        // errors
        res.status(400).json({
            message: err.message,
            errors: err
        })
    })
});




/**------------------------------------------*
 * GET :: User data
 *-------------------------------------------*/
router.get('/user', [JWT_CHECK], async (req, res) => {
    const { user } = req;
    const getUserData = await UserModel.findOne({ email: user.email }).populate(
        'review orders',
        '-__v'
    )

    if (! getUserData) {
        return res.status(404).json({
            message: 'Error 404',
            errCode: 'error-400',
        })
    }

    res.json(getUserData); // all ok and send data
});


module.exports = router;