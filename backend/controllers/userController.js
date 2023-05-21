import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc   Auth user/set token
// route POST /api/user/auth
// @access Public

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(401);
        throw new Error('Invlid email or password');
    }
});


// @desc Regiter a new user
// route POST /api/user
// @access Public

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400);
        throw new Error('Invlid user data');
    }

});


// @desc Logout user
// route POST /api/user/logout
// @access Public

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: 'User Logged out' })
});

// @desc GET user profile
// route GET /api/user/profile
// @access Private

const getUserProfile = asyncHandler(async (req, res) => {

    res.status(200).json({ message: 'User Profile' })
});


// @desc UPDATE user profile
// route PUT /api/user/profile
// @access Private

const updateUserProfile = asyncHandler(async (req, res) => {

    res.status(200).json({ message: 'Update User Profile' })
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};