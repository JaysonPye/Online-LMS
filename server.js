const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const apiRoutes = require('./routes/api');


app.use(express(json));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/api', apiRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });