const express= require("express");
const app= express();
const https = require('node:https');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html") ;
});

app.post("/",function(req,res){
    
    const query = req.body.cityName;
    const appKey = "74f2726b4c11736e39f52a3c6ecad6bc";
    const unit = "metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + appKey + "&units=" + unit;
    
    https.get(url,function(response)
    {
        console.log(response.statusCode);

        response.on("data",function(data)
        {
            const weatherData= JSON.parse(data);
            const temp=weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const location = weatherData.name;
            const icon = weatherData.weather[0].icon;
            const imageURL =  " https://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.write("<p>The weather is currently "+weatherDescription+". </p>");
            res.write("<h1>The temperature in "+location+" is "+temp+" degree celsius.</h1>");
            res.write("<img src="+imageURL+" >");
            res.send();
        })

    })
})
/*

    
*/
app.listen(3000,function(){
    console.log("Hello");
});