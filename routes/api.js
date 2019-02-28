/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");
mongoose.connect(process.env.DB);
const CONNECTION_STRING = process.env.DB; //
MongoClient.connect(CONNECTION_STRING, function(err, db) {
  if (err) console.log("err", err);
  console.log("ok");
});
const date = new Date().toLocaleString();

var Schema = mongoose.Schema;

var board = new Schema({
  board: String,
  text: String,
  replies: Array,
  createdOn: String,
  delete_password: String,
  bumpedOn: String,
  reported: Boolean
});
var Board = mongoose.model("board", board);

var threads = new Schema({
  board: String,
  text: String,
  replies: Array,
  createdOn: String,
  delete_password: String,
  bumpedOn: String,
  reported: Boolean
});
var Threads = mongoose.model("threads", threads);

module.exports = function(app) {
  app
    .route("/api/threads/:board")
    .get(function(req, res) {
    Board.find({},function(err,response){
      if(err)console.log(err)
      console.log(response);
     let dates= response.map((x)=>{
      return {date:new Date(x.bumpedOn).getDate(),time:new Date(x.bumpedOn).getMinutes()};
      })
     console.log(dates);
    })
    
      // console.log("thread-req",req.body);
    })
    .post(function(req, res) {
      console.log("reqboyd", req.body);
      const { board, text, delete_password } = req.body;

      //jkjyour

      // const date = new Date().toLocaleDateString();
      // const time = new Date().toLocaleTimeString();
      const date = new Date().toLocaleString();
      console.log("date", date);
      var info = new Board({
        board: board,
        text: text,
        replies: [],
        delete_password: String,
        createOn: date,
        bumpedOn: date,
        reported: false
      });
      info.save(function(err, data) {
        if (err) console.log("err", err);
        console.log(data);
        //res.json(data);
        res.json({
          title: data.title,
          id: data._id
        });
      });
    })
    .put(function(req, res) {
      console.log("threads-req", req.body);
      const { board, _id } = req.body;
      Board.findOne({ board: board }, function(err, response) {
        console.log(response);
        response.reported = true;
        response.save(function(err, sav) {
          if (err) console.log(err);
          console.log(sav);
        });
      });
    })

    .delete(function(req, res) {
      //console.log("res.body",req.body);
      const { thread_id, delete_password, board } = req.body;
      Board.findOneAndRemove({ board: board }, function(err, response) {
        if (err) console.log(err);
        console.log("res", response);
      });
    });
  app
    .route("/api/replies/:board")
    .get(function(req, res) {})

    .post(function(req, res) {
    console.log('res',req.body);
      const {
        board,
        thread_id,
        text,
        created_on,
        delete_password,
        reported
      } = req.body;
      Board.findOne({ board: board }, function(err, response) {
        console.log(response);
        const arr = {_id:thread_id, text:text,created_on:date, delete_password:delete_password, reported:false};
       // console.log(arr);
        response.replies.push(arr);
        response.save(function(err, sav) {
           if (err) console.log(err);
           console.log("saved",sav);
         });
      });
    })
    .put(function(req, res) {
    const {board,threa_id,reply_id}=req.body;
  //console.log("put",req.body);
   Board.findOne({ board: board }, function(err, response) {
     //   console.log(response);
     let arr =response.replies;
     console.log(arr);
     const val = arr.filter(val => val._id===reply_id);
     console.log(val);
     val.reported=true
          const others = arr.filter(val => val._id!==reply_id)
     others.push(val);
   //  console.log("val",others);
     response.replies = others;
       // console.log(arr);
        response.save(function(err, sav) {
           if (err) console.log(err);
           console.log("saved",sav);
          res.send('success');
         });
      });
    
  })
    .delete(function(req, res) {
    const { thread_id, delete_password, board } = req.body;
      Board.findOneAndRemove({ board: board }, function(err, response) {
        if (err) console.log(err);
        console.log("res", response);
      });
  
  });
};
