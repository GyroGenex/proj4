const models = require('../models/index');


const controllers = {
    createMaterial: async (req, res) => {
        const role = res.locals.role;

        if (role != "mm") {
            return res.json("not authorised");
        }

        try {
            const result = await models.sequelize.transaction(async () => {
                const material_master = await models.MaterialMaster.create(
                    {
                        material_description: req.body.material_description,
                        BUOM: req.body.buom,
                        price: req.body.price
                    },
                );

                return res.json(material_master);
            });

        } catch (err) {



            console.log(err);
            return res.json({
                err: err.message
            });
        }
    },

    showMasterData: async (req, res) => {
        const masterData = await models.MaterialMaster.findAll({
            attributes: ['id', 'material_description', 'BUOM', [models.sequelize.literal('ROUND(price, 2)'), 'price']]
        });
        res.json(masterData);
    },

    getDetails: async (req, res) => {
        const id = parseInt(req.params.materialId);
        console.log(id);
        let material = null;

        try {
            material = await models.MaterialMaster.findOne({
                where: {
                    id: id
                },
                attributes: ['id', 'material_description', 'BUOM', [models.sequelize.literal('ROUND(price, 2)'), 'price']],
                include: [
                    {
                        model: models.Inventory,
                        as: 'inventories',
                        attributes: [
                            'batch_number',
                            'expiry_date',
                            'quantity_unrestricted',
                            [models.sequelize.literal('ROUND(price * Inventories.quantity_unrestricted, 2)'), 'total_cost_unrestricted'],
                            'quantity_blocked',
                            [models.sequelize.literal('ROUND(price * Inventories.quantity_blocked, 2)'), 'total_cost_blocked'],]
                    }
                ],


            });



        } catch (err) {
            console.log(err);
            return res.json({
                err: err.message
            });
        }

        if (!material) {
            res.statusCode = 404;
            return res.json('Material not found');
        }

        return res.json(material);
    },

    deleteMasterData: async (req, res) => {
        const role = res.locals.role;

        if (role != "mm") {
            return res.json("not authorised");
        }

        const id = req.params.materialId;
        let material = null;

        try {
            // select * from Users where email = 'jon@email.com' limit 1
            material = await models.MaterialMaster.findOne({
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

        if (!material) {
            res.statusCode = 404;
            return res.json('Material not found');
        }


        try {
            await material.destroy();
        } catch (err) {
            console.log(err);
            res.statusCode = 500;
            return res.json(err);
        }

        res.json('Masterdata deleted');

    }
};

module.exports = controllers;
