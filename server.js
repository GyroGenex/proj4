require('dotenv').config();
const methodOverride = require('method-override');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cron = require('node-cron');
const axios = require('axios');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(cors({
    origin: '*'
}));

// handle cors pre-flight requests
app.options('*', cors());

const userRouter = require('./routers/user_routers');
const materialMasterRouter = require('./routers/material_master_routers');
const inventoryRouter = require('./routers/inventory_routers');

app.use('/api/v1/users', userRouter);
app.use('/api/v1/materialmaster/', materialMasterRouter);
app.use('/api/v1/inventory/', inventoryRouter);

const sendPostRequest = async () => {
    try {
        const response = await axios.patch('http://localhost:8000/api/v1/inventory/blockExpiredStock');
        console.log('POST request successful:', response.data);
    } catch (error) {
        console.error('Error sending POST request:', error.message);
    }
};

// Schedule the task to run every day at 7:30 AMnode
// cron.schedule('*/1 * * * *', () => {
//     console.log('Sending the scheduled POST request...');
//     sendPostRequest();
// });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
