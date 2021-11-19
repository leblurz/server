const axios = require('axios');
const e = require('express');

const { allData } = require ('./src/request/allRequests');

const testUsers = require('./testUsers');
const testOrders = require('./testOrders');

const server = require('./src/app.js');
const { conn } = require('./src/db.js');

const dotenv = require ('dotenv');
dotenv.config();

axios.defaults.baseURL = 'http://localhost:3001';

if(process.env.PORT == 3001){
    local = "http://localhost:3001";
  }else{
    local = "https://scientiapfdeploy.herokuapp.com";
  }

const cargaUsers = async () => {
    const usuariosPromise = testUsers.map( async (e) => {
        const response = await axios.post(`${local}/users/login`, e)
    return response
    });
    Promise.all(usuariosPromise).then(() => {
        return console.log("Users cargados")
    });
};

const cargaOrders = async () => {
    const ordersPromise = testOrders.map( async (e) => {
        const response = await axios.post(`${local}/orders/${e.emailUserTest}`, e)
    return response
    });
    Promise.all(ordersPromise).then(() => {
        return console.log("Orders cargados")
    });
};

const allCharges = async  () => {
    await allData();
    await cargaUsers();
    setTimeout(cargaOrders, 1000, "orders");
};


// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
    allCharges();
    server.listen(process.env.PORT, () => {
      console.log(`%s listening`); // eslint-disable-line no-console
    });
  });