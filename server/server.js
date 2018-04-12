// bulit in modules
const path = require('path');

// 3rd party modules
const express = require('express');

// constant variables
const app = express();
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const maintainance = false;// make it true when site is on maintainance

app.use((req,res,next)=>{
    if(maintainance){
        res.sendFile(publicPath+'/maintainance.html');
    }
    else
        next();
})

app.use(express.static(publicPath));

// start express server
app.listen(port,()=>{
    console.log(`server is up on ${port}`);
})