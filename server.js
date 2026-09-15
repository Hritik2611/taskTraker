import express from "express";
import connectDB from "./config/db.js";
import path from "path";
import { fstat } from "fs";
// import { connection } from "mongoose";
import { ObjectId } from "mongodb";
import { title } from "process";

const app = express();

const publicPath = path.resolve("public");
app.use(express.static(publicPath));

app.set("view engine", "ejs");

// Middleware to accept JSON data
app.use(express.json());

// Middleware
app.use(express.urlencoded({ extended: false }));

connectDB();

app.get("/", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("taskTraker");
  const result = await collection.find().toArray();
  // console.log(result);
  // console.log(collection);
  // console.log(db);

  res.render("list", { result });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/update", (req, res) => {
  res.render("update");
});

app.post("/add", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("taskTraker");

  const result = await collection.insertOne(req.body);

  if (result) {
    res.redirect("/");
  } else {
    res.redirect("/add");
  }
});

app.post("/update", (req, res) => {
  res.redirect("/");
});

//delete item
app.get("/delete/:id", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("taskTraker");
  const result = collection.deleteOne({ _id: new ObjectId(req.params.id) });
  if (result) {
    res.redirect("/");
  } else {
    res.resd("/some error");
  }
});

app.get("/update/:id", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("taskTraker");
  const result = await collection.findOne({ _id: new ObjectId(req.params.id) });

  if (result) {
    res.render("update", { result });
  } else {
    res.send("somthing is wrong");
  }

  // res.send("everything is working")
  // console.log(result);
});

// update the existing task
app.post("/update/:id", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("taskTraker");
  const filter = { _id: new ObjectId(req.params.id) };
  const updateData = {
    $set: { title: req.body.title, description: req.body.description },
  };
  const result = await collection.updateOne(filter, updateData);

  if (result) {
    res.redirect("/");
  } else {
    res.send("some error");
  }
});

app.post("/multi-delete", async (req, res) => {
  const db = await connectDB();
  const collection = db.collection("taskTraker");

  let selectedTask = undefined;
  if (Array.isArray(req.body.selectedTask)) {
    selectedTask = req.body.selectedTask.map((id) => new ObjectId(id));
  } else {
    selectedTask = [new ObjectId(req.body.selectedTask)];
  }

  const result = await collection.deleteMany({ _id: { $in: selectedTask } });

  if (result) {
    res.redirect("/");
  } else {
    res.send("some error occer");
  }
});

app.listen(3200);
