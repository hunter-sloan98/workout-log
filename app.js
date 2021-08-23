require('dotenv').config();
const Express = require('express');
const app = Express();
const dbConnection = require('./db');

const controllers = require('./controllers')

app.use(Express.json());


// app.use(require('./middleware/validate-jwt'));
app.use('/log', controllers.logController);

app.use('/user', controllers.userController)




dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
  app.listen(4500, () => {
    console.log(`[Server]: App is listening on 4500.`);
  });
})
.catch((err) => {
  console.log(`[Server]: Server crashed. Error = ${err}`);
});

// app.use('/test', (req, res) => {
//   res.send("This is a test message from my server!")
// });