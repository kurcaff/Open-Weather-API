//Importing Required Modules
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

//Creating an Express Application
const app = express();
app.use(bodyParser.urlencoded({extended: true}));


//Handling GET Requests
//Когато потребител навигира до основния URL адрес, сървърът отговаря, като изпраща файла index.html, намиращ се в същата директория като скрипта.
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")  
})


//Handling POST Requests
//Извличаме името на града от данните на формуляра (req.body.cityName), изпратени от потребителя.
//Конструира URL за искане на метеорологични данни от OpenWeatherMap API, като използва името на града, API ключа и определената единица (Celsius).
app.post("/", function(req,res) {
    
    const query = req.body.cityName;
    const apiKey = "830c6e18625dd9c9016e248583ca4d27";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;


//Настройва слушател на събития за събитието "data", което се задейства при получаване на данни от API.
    https.get(url, function(response){
        console.log(response.statusCode)


//Processing the Response
//Входящите данни от отговора на API се анализират в JavaScript обект.
//Извлича подходяща информация: описание на времето, температура и икона.
//Създава URL адрес на изображение за иконата за времето.
//Изпраща температурата, описанието и изображението на иконата обратно на клиента като HTML отговор.
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


//Starting the Server
app.listen(3000, function(){
    console.log("Server is running on port 3000.")
})

//Този код създава просто уеб приложение, което позволява на потребителите да въведат име на град и да извлекат текущата информация за времето.
//Той използва Express за обработка на HTTP заявки, Body Parser за управление на данни от формуляри и OpenWeatherMap API за извличане на данни 
//за времето въз основа на въведени от потребителя данни.
//Резултатите се показват обратно на потребителя във форматиран HTML отговор.
