var express = require("express");
var routes = express.Router();
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

var database = require("../config/database");
var collName = "collections";
var path = require("path");
var rand = require("randomstring");


routes.get("/", (req, res)=>{
    MongoClient.connect(database.dbUrl, (err, con)=>{
        var db = con.db(database.dbName);
        db.collection(collName).find().toArray((err, result)=>{
            res.send(result);
        })
    })
})

routes.get("/:id", (req, res)=>{
    var id = mongodb.ObjectId(req.params.id);
    MongoClient.connect(database.dbUrl, (err, con)=>{
        var db = con.db(database.dbName);
        db.collection(collName).find({ _id : id}).toArray((err, result)=>{
            res.send(result[0]);
        })
    })
})

routes.post("/", (req,res)=>{
    var file = req.files.image;
    var name = file.name;
    var obj = JSON.parse(req.body.formdata);
    var arr = name.split(".");
    var ext = arr[arr.length-1];
    var dirpath = "/collections_images/"+rand.generate(20)+"."+ext;

    var image_path = path.resolve()+"/assets/"+dirpath;
    obj.image = dirpath;


    MongoClient.connect(database.dbUrl, (err, con)=>{
        var db = con.db(database.dbName);
        db.collection(collName).insertOne(obj, ()=>{
            file.mv(image_path, (err)=>{
                res.send({ success : true });
            })
        })
    })
})
routes.delete("/:id", (req, res)=>{
    var id = mongodb.ObjectId(req.params.id);
    MongoClient.connect(database.dbUrl, (err, con) => {
        var db = con.db(database.dbName);
        db.collection(collName).deleteMany({ _id: id },()=>{
            res.send({ success : true });
        });
    })
})

routes.put("/:id", (req, res)=>{
    console.log(req.body)
    var id = mongodb.ObjectId(req.params.id);
    MongoClient.connect(database.dbUrl, (err, con) => {
        var db = con.db(database.dbName);
        db.collection(collName).updateMany({ _id : id }, { $set : req.body }, ()=>{
            
            res.send({ success : true });
        })
    })
})


module.exports= routes
