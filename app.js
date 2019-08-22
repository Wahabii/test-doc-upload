const express=require('express'); 
const app=express();


require('./routers/product');

//const port=process.env.PORT|| 8000;

app.listen(6000, `connected with 6000 ...`);