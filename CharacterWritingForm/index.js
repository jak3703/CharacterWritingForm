const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');
const uuid = require('uuid');
const upload = require('express-fileupload');

const app = express();

app.use(bodyParser.json());
app.use(upload({
    limits: {fileSize: 1000000}
}));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get("/public", function(req, res){
    res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

app.get('/public/:characterData', function (req, res){
    res.sendFile(path.join(__dirname, 'views', 'form.html'), function(err){
        if(err){
            console.log(err);
        }
    })
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
    const filepath = path.join(__dirname, 'generated-files', fileName);
    res.download(filepath, fileName, function(err){
        if(err){
            console.log(err);
        }
        
        fs.unlink(filepath, function(err){
            if(err){
                console.log(err);
            }
        });
    });
});

app.post('/upload', function (req, res){
    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send('No file was uploaded');
    }
    const file = req.files.uploadFile;
    const filepath = path.join(__dirname, 'upload');
    file.mv(path.join(filepath, file.name), function(err){
        if(err){
            console.log(err);
        }
        res.sendFile(path.join(filepath, file.name), function(err){
            if(err){
                console.log(err);
            }
            fs.unlink(path.join(filepath, file.name), function(err){
                if(err){
                    console.log(err);
                }
            });
        });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Listening on port " + PORT + "..."));