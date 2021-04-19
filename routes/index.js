const router = require('express').Router();

/**========================================*
 * App routers
 *========================================*/


// APIs routes => '/api'
router.use('/api', require('./API.routes'));


// seeder for super-admin
router.get('/make_super_admin', async (req, res) => {
    const SUPER_ADMIN = {
        name: 'Programming Hero',
        email: 'programminghero001@gmail.com',
        role: 'super_admin'
    };  // password is registered in Firebase Auth with this email
        // programminghero001@gmail.com and password: `2021batch3`


    const { UserModel } = require('../models');
    const makeSuperAdmin = new UserModel(SUPER_ADMIN);
    await makeSuperAdmin.save()
    .then(() => {
        res.send(`
            <h1 style='color: green'>Super Admin has been created!</h1>
            <p>IP: ${req.ip} (just for show)</p>
        `);
    })
    .catch(err => {
        res.send(`
            <h1 style='color: red'>${err.message}</h1>
            <p>IP: ${req.ip} (just for show)</p>
        `);
    })
});


// root => '/'
router.get('/', (req, res) => {
    res.json({ message: 'Hi from backend API' });
})


module.exports = router;