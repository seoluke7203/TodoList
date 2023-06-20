//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin-luke:123@cluster0.7nvvdwb.mongodb.net/todoListDB", { useNewUrlParser: true });


const itemSchema = {
  name: String
};

const Item = mongoose.model(
  "Item", itemSchema
);

const item1 = new Item({
  name: "TodoList"
});

const item2 = new Item({
  name: "Click on + to add a new item"
});
const item3 = new Item({
  name: "Click on the checkbox to delete an item"
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems)
//   .then(() => console.log("Successful"))
//   .catch((error) => console.log(error))

app.get("/", function (req, res) {


  //printing all store values in terminal (In my case Hyper Terminal)
  Item.find({})
    .then(foundItem => {
      if (foundItem.length === 0) {
        return Item.insertMany(defaultItems);
      } else {
        return foundItem;
      }
    })
    .then(savedItem => {
      res.render("list", {
        listTitle: "Today",
        newListItems: savedItem
      });
    })
    .catch(err => console.log(err));

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");
});


app.post("/delete", function (req, res) {
  const checkItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkItemId)
    .then(function (foundItem) { Item.deleteOne({ _id: checkItemId }) })

    res.redirect("/");
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
