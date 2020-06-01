const express = require('express');
const db = require('./db/database');

const PORT = process.env.PORT | 80;
const app = express();

const apiRoutes = require('./routes/apiRoutes');

app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use('/api',apiRoutes);


app.use((req,res)=>{
    res.status('404').end();
});

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
});
  