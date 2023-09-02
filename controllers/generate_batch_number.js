
const models = require('../models/index');

const generateBatchNumber = async (materialId) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().substr(-2);
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');


    // Query the database to find the latest batch number for the given material and current date
    const latestBatch = await models.Inventory.findOne({
        where: {
            material_Id: parseInt(materialId),
            batch_number: {
                [models.Sequelize.Op.like]: `${year}${month}${day}%`
            }
        },
        order: [['batch_number', 'DESC']]
    });

    console.log(latestBatch);

    // Increment the sequential number for the batch
    const sequentialNumber = latestBatch
        ? parseInt(latestBatch.batch_number.substr(-4)) + 1
        : 1;

    // Combine components to create the final batch number
    const batchNumber = `${year}${month}${day}${sequentialNumber.toString().padStart(4, '0')}`;

    return batchNumber;
};

module.exports = generateBatchNumber;
