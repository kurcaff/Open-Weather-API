const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")  
})

app.post("/", function(req,res) {
    
    const query = req.body.cityName;
    const apiKey = "830c6e18625dd9c9016e248583ca4d27";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function(response){
        console.log(response.statusCode)

        response.on("data", function(data){
            const weatherData = JSON.parse(data)
            const description = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon
            const imgURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            res.write("<h1>The temperature in " + query + " is " + temp + " </h1>")
            res.write("<p>The weather description is " + description + "</p>")
            res.write("<img src =" + imgURL + ">")
            res.send()
        })
    })
})



app.listen(3000, function(){
    console.log("Server is running on port 3000.")
})