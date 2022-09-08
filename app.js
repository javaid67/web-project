const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _=require("lodash");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const date=new Date();
// const today=date.getDay();
const options={
  day:"numeric",
  month:"long",
  weekDay:"long",
  year:"numeric"

};
// const day=date.toLocaleDateString("en-us",options);

mongoose.connect('mongodb+srv://javaid:1234qwQW@cluster0.erayr6v.mongodb.net/test');
db_schema={  name:String};

const List=mongoose.model("List",db_schema);

const item1=new List({name:"apple"});
const item2=new List({name:"apple"});
const defaultItems=[item1,item2];


const custom_Schema={
  name:String,
items:[db_schema]};

const Custom=mongoose.model("Custom",custom_Schema);


app.get("/",function (req,res) {
List.find({},function (err,foundlist) {

  if(foundlist.length===0)
  {

    List.insertMany(defaultItems,function (err) {
    if(!err)
    {
      console.log("successfully Added");
    }
    })
    res.redirect("/");
  }
  else {
    res.render("list",{list_title:"Today",newItems:foundlist});
  }

})

});
app.post("/",function (req,res) {
var new_item=(req.body.item);
var listName=(req.body.list);

const item=new List({name:new_item});
if(listName===" Today")
{ item.save();
    res.redirect("/");
}
else {
Custom.findOne({name:listName},function (err,foundList) {
  console.log(foundList);
  // foundList.items.push(item);
  // foundList.save();
  // res.redirect("/" +listName);
})
}

});


app.post("/delete",function (req,res) {
  const item=(req.body.item_delete);
List.findByIdAndRemove(item,function (err) {
if(!err)
{
  console.log("succefully deleted");
}
})
res.redirect("/");
})

// CustomList Schema and Model and More

app.get("/:customListName",function (req,res) {
  const customList=(req.params.customListName);

  Custom.findOne({name:customList},function (err,foundlist) {
  if(!err)
  {
    if(!foundlist)
    {

    const custom1=new Custom({
      name:customList,
      items:defaultItems
    });
    custom1.save();
    res.redirect("/" + customList);
    }
    else {
      res.render("list",{list_title:foundlist.name,newItems:foundlist.items});
    }
  }
  })
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port,function () {
console.log("server listening from port 3000");
})
