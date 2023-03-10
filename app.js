const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//express.static("public") is done as we need to get style.css to render on server....


app.get("/", function(req,res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;

    const data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
            } 

        ]
    };

    const jsonData = JSON.stringify(data);
    //here we're converting to json format.
    const url = process.env.url;
    const options = {
        method: "POST",
        auth: process.env.apiKey
    };
    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html");
            }else{
                res.sendFile(__dirname + "/failure.html");
            }
            console.log(JSON.parse(data));
        })
    });

    

    request.write(jsonData);
    request.end();
    console.log(firstname);
});

app.post("/failure", function(req,res) {
    res.redirect("/");
});


app.listen(3001, function() {
    console.log('Server started on port 3001');
});
