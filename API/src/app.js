const express = require('express');
const logger = require('morgan');

const app = express();
const indexRoutes = require('./routes/index')

 //Port
app.set('port', 3000);

//Logger 
app.use(logger('dev'));

//Routes
app.use("/", indexRoutes);
app.listen(app.get('port'), () => {
  console.log(`Working on port:${app.get('port')}`)
} )