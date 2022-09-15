const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https')
const app = express()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res)=>{
    res.sendFile(__dirname +  "/signup.html")
})

app.post("/", (req, res)=>{
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const mailAddress = req.body.email;
    
    const data = {
        members : [{
            email_address : mailAddress,
            status : "subscribed",
            merge_fields : {
                FNAME : firstName,
                LNAME : lastName
            }
        }]
    }
    const dataJSON = JSON.stringify(data)

    const url = "https://us8.api.mailchimp.com/3.0/lists/de1b15530a";
    const options = {
        method : 'POST',
        auth : 'vivektripathi9005:fb1ee8300f8b3b1ac99b860d1f4e612e-us8'
    }

    const request = https.request(url, options, (response)=>{
        console.log(response.statusCode)
        response.on("data", (data)=>{
            console.log(JSON.parse(data))
        })
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }
    })
    request.write(dataJSON)
    request.end()
})

app.post("/failure", (req, res)=>{
    res.sendFile("/");
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is running on 3000")
})

// API Key
// fb1ee8300f8b3b1ac99b860d1f4e612e-us8

// List ID
// de1b15530a