// Entry point of the server application

//loads environmental variables into the server
require('dotenv').config();

//gets all required packages
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

//gets all the routes
const authRoutes = require('./routes/auth');
const avatarRoutes = require("./routes/avatar");
const adminRoutes = require('./routes/admin');
const swaggerDocument = YAML.load('./swagger.yaml');

//initializes express
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);//gets authentication routes
app.use('/api/avatar',avatarRoutes)//gets the avatar modification routes 
app.use('api/admin', adminRoutes)//gets the admin route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));//gets the api documentation 

//connects to mongoDB and expresss.
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.error(err));
