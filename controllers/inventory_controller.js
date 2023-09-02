const models = require('../models/index');
const generateBatchNumber = require('./generate_batch_number');

const controllers = {
    createInventory: async (req, res) => {
        const role = res.locals.role;

        if (role != "ic") {
            return res.json("not authorised");
        }

        console.log(req.body.materialId);
        const batchNumber = await generateBatchNumber(req.body.materialId);
        try {
            const result = await models.sequelize.transaction(async () => {
                const Inventory = await models.Inventory.create(
                    {
                        material_Id: req.body.materialId,
                        quantity_unrestricted: req.body.qtyUnrestricted,
                        quantity_blocked: req.body.qtyBlocked,
                        batch_number: batchNumber,
                        expiry_date: req.body.expiryDate
                    },
                );

                return res.json(Inventory);
            });

        } catch (err) {



            console.log(err);
            return res.json({
                err: err.message
            });
        }
    },

    showInventory: async (req, res) => {
        const masterData = await models.Inventory.findAll(
            {
                attributes: ['material_Id', 'batch_number', 'expiry_date', 'quantity_unrestricted', 'quantity_blocked'],
            });
        res.json(masterData);
    },

    blockInventory: async (req, res) => {
        const role = res.locals.role;

        if (role != "ic") {
            return res.json("not authorised");
        }

        const material_Id = parseInt(req.body.materialId);
        const batch_number = req.body.batchNumber;

        let inventory = null;

        try {
            // select * from Users where email = 'jon@email.com' limit 1
            inventory = await models.Inventory.findOne({
                where: {
                    material_Id: material_Id,
                    batch_number: batch_number
                },
            });
        } catch (err) {
            console.log(err);
            return res.json({
                err: err.message
            });
        }

        if (!inventory) {
            res.statusCode = 404;
            return res.json('Material not found');
        }

        if (inventory.quantity_unrestricted == 0) {
            return res.json("Nothing to block");
        }

        try {
            // select * from Users where email = 'jon@email.com' limit 1
            await inventory.update({
                quantity_blocked: inventory.quantity_unrestricted,
                quantity_unrestricted: 0.00, // Update this based on your request structure
            });
        } catch (err) {
            console.log(err);
            return res.json({
                err: err.message
            });
        }



        return res.json(inventory);
    },

    unblockInventory: async (req, res) => {
        const role = res.locals.role;

        if (role != "ic") {
            return res.json("not authorised");
        }

        const material_Id = parseInt(req.body.materialId);
        const batch_number = req.body.batchNumber;
        console.log(material_Id);
        let inventory = null;

        try {
            // select * from Users where email = 'jon@email.com' limit 1
            inventory = await models.Inventory.findOne({
                where: {
                    material_Id: material_Id,
                    batch_number: batch_number
                },
            });
            console.log(inventory);
        } catch (err) {
            console.log(err);
            return res.json({
                err: err.message
            });
        }

        if (!inventory) {
            res.statusCode = 404;
            return res.json('Material not found');
        }

        console.log(inventory);

        if (inventory.quantity_blocked == 0) {
            return res.json("Nothing to unblock");
        }

        try {
            await inventory.update({
                quantity_unrestricted: inventory.quantity_blocked,
                quantity_blocked: 0.00,
                // Update this based on your request structure
            });
        } catch (err) {
            console.log(err);
            return res.json({
                err: err.message
            });
        }
        return res.json(inventory);
    },

    deleteStock: async (req, res) => {
        const role = res.locals.role;

        if (role != "ic") {
            return res.json("not authorised");
        }
        const material_Id = parseInt(req.body.materialId);
        const batch_number = req.body.batchNumber;
        console.log(material_Id);
        let inventory = null;

        try {
            // select * from Users where email = 'jon@email.com' limit 1
            inventory = await models.Inventory.findOne({
                where: {
                    material_Id: material_Id,
                    batch_number: batch_number
                },
            });
            console.log(inventory);
        } catch (err) {
            console.log(err);
            return res.json({
                err: err.message
            });
        }

        if (!inventory) {
            res.statusCode = 404;
            return res.json('Material not found');
        }


        try {
            await inventory.destroy();
        } catch (err) {
            console.log(err);
            res.statusCode = 500;
            return res.json();
        }

        res.json('inventory deleted');

    },

    blockExpiredStock: async (req, res) => {
        const currentDate = new Date(); // Get the current date and time

        try {
            // Find all stock items before the expired date
            const expiredStock = await models.Inventory.findAll({
                where: {
                    qtyUnrestricted: {
                        [models.Sequelize.Op.gt]: 0,
                    },
                    // Assuming you have a "expiry_date" column in your Inventory model
                    expiry_date: {
                        [models.Sequelize.Op.lt]: currentDate, // Using Op.lt (less than) operator
                    },
                },
            });

            // Loop through the expired stock items and block them
            for (const stockItem of expiredStock) {
                // Update each stock item to block it
                await stockItem.update({
                    quantity_blocked: stockItem.quantity_unrestricted,
                    quantity_unrestricted: 0.00,
                });
            }

            return res.json({
                msg: 'Expired stock items have been successfully blocked.',
            });
        } catch (err) {
            console.log(err);
            return res.json({
                err: err.message,
            });
        }
    },
};

module.exports = controllers;
