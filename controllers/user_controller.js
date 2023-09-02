const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const models = require('../models/index');
const userValidators = require("./validators/userValidator");

const controllers = {
    createUser: async (req, res) => {
        // assuming user is perfect, providing all valid data

        // create user into DB using model

        // trivial example for DB transaction:
        // TaskA: create the user
        // TaskB: create a corresponding user address using some default value
        const data = req.body;


        const validationResult = userValidators.registerSchema.validate(data);
        if (validationResult.error) {
            res.statusCode = 400;

            return res.json({
                msg: validationResult.error.details[0].message
            });
        }

        const hash = await bcrypt.hash(data.password, 10);

        try {
            const result = await models.sequelize.transaction(async (t) => {
                const user = await models.User.create(
                    {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        password: hash,
                        role: data.role,
                    },
                );

                return res.json(user);
            });

        } catch (err) {



            console.log(err);
            return res.json({
                err: err.message
            });
        }
    },

    showUsers: async (req, res) => {
        const masterData = await models.User.findAll({
            attributes: ['id', 'email', 'role']
        });
        res.json(masterData);
    },

    findUserById: async (req, res) => {
        const id = req.params.id;
        console.log(id);
        let user = null;

        try {
            user = await models.User.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'email', 'role', 'first_name', 'last_name']
            });
        } catch (err) {
            console.log(err);
            return res.json({
                err: err.message
            });
        }

        if (!user) {
            res.statusCode = 404;
            return res.json('User not found');
        }

        return res.json(user);
    },

    deleteUser: async (req, res) => {
        const id = parseInt(req.params.id);
        console.log(id);
        let user = null;

        try {
            // select * from Users where email = 'jon@email.com' limit 1
            user = await models.User.findOne({
                where: {
                    id: id
                },
            });
        } catch (err) {
            console.log(err);
            return res.json({
                err: err.message
            });
        }

        if (!user) {
            res.statusCode = 404;
            return res.json('User not found');
        }

        console.log(user);

        try {
            await user.destroy(); // Delete the user
        } catch (err) {
            console.log(err);
            res.statusCode = 500;
            return res.json();
        }

        res.json('User deleted');

    },
    login: async (req, res) => {
        // get the login data from request body
        const data = req.body;
        console.log(data);
        // validate the data

        const validationResult = userValidators.loginSchema.validate(data);

        if (validationResult.error) {
            res.statusCode = 400;
            return res.json({
                msg: validationResult.error.details[0].message
            });
        }

        // find if user exists by the username (email)
        // -> not exists: return login error (status 400)

        let user = null;

        try {
            user = await models.User.findOne({ where: { id: parseInt(data.id) } });
        } catch (err) {
            res.statusCode = 500;
            return res.json({
                msg: "error occurred when fetching user"
            });
        }

        if (!user) {
            res.statusCode = 401;
            return res.json({
                msg: "login failed, please check login details"
            });
        }

        // use bcrypt to compare given password against DB record
        // -> if failed: return status 401 (unauthorized)


        const validLogin = await bcrypt.compare(data.password, user.dataValues.password);

        if (!validLogin) {
            res.statusCode = 401;
            return res.json({
                msg: "login failed, please check login details"
            });
        }

        console.log(user.dataValues.id);
        // generate JWT using an external lib
        const token = jwt.sign(
            {
                id: user.dataValues.id,
                role: user.dataValues.role,
            },
            process.env.APP_KEY,
            {
                expiresIn: "10 days",
                audience: "FE",
                issuer: "BE",
                subject: user.dataValues.id.toString(), // _id from Mongoose is type of ObjectID,
            }
        );

        // return response with JWT
        res.json({
            msg: 'login successful',
            token: token,
        });
    },
};

module.exports = controllers;
