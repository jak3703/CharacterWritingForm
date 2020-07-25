const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');
const uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "index.html"));
    res.status(200)
});

app.get("/public", function(req, res){
    res.sendFile(path.join(__dirname, "public", "form.html"));
    res.status(200)
});

app.post("/generated-files", function(req, res){
    const data = req.body;
    const filepath = path.join(__dirname, 'generated-files', uuid.v1()+'.json');
    fs.writeFile(filepath, JSON.stringify(data), function(err){
        if(err){
            console.log(err);
            return;
        }
        res.type('text/plain');
        res.send(path.basename(filepath));
    });
    
});

app.get("/generated-files/download/:file", function(req, res){
    const fileName = req.params.file;
    console.log(fileName);
    const filepath = path.join(__dirname, 'generated-files', fileName);
    res.download(filepath, fileName, function(err){
        if(err){
            console.log(err);
        }
        /*
        fs.unlink(filepath, function(err){
            if(err){
                console.log(err);
            }
        });*/
    });
});

app.get("/download-test", function(req, res){
    res.download(path.join(__dirname, 'generated-files', '01a6cbe0-ce2d-11ea-86bc-092eb628bcba.json'), '01a6cbe0-ce2d-11ea-86bc-092eb628bcba.json');

});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on port " + PORT + "..."));