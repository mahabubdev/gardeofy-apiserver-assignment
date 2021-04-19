module.exports = (req, res, next) => {
    let { user } = req;

    if (user.role !== 'admin' || user.role !== 'super_admin') {
        // user not permitted
        return res.status(403).json({
            message: 'Error! Forbidden attempt',
            errCode: 'error-403'
        })
    }

    // otherwise admins are good to go next ...
    next();
}