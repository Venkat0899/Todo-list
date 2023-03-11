require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
mongoose.set('strictQuery', false);
mongoose.set('strictQuery', true);
const date=require(__dirname+"/date.js");
mongoose.connect(process.env.SECRET,{useNewUrlParser:true,family:4});
const itemsschema={
  name:String
}

const Items=mongoose.model("Items",itemsschema);
const item1=new Items(
  {
    name:"coffee"
  }
);
const item2=new Items(
  {
    name:"Tea"
  }
);
const item3=new Items(
  {
    name:"Milk"
  }
);
const listschema={
  name:String,
  items:[itemsschema]
};
const Lists=mongoose.model("Lists",listschema)

const defaults=[item1,item2,item3];
const app=express();

var workItems=[];
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.get("/",function(req,res)
{
  Items.find({},function(err,founditems)
  {
    if(founditems.length===0)
    {

      Items.insertMany(defaults,function(err)
      {
        if(err)
        console.log(err)
        else
        console.log("sucess")
      } );
      res.redirect("/")
    }
    else{

res.render("list",{itemm:founditems,listTitle:"Today"});
    }
});

});
app.get("/:customlist",function(req,res)
{
  const customelistname=_.capitalize(req.params.customlist);
  Lists.findOne({name:customelistname},function(err,foundlist)
  {
    if(!err)
    {
      if(!foundlist)
      {
        const list=new Lists({
          name:customelistname,
          items:defaults
        });
        list.save();
        res.redirect("/");
      }
      else
      {
        res.render("list",{itemm:foundlist.items,listTitle:foundlist.name});
      }
    }
  })


})
app.post("/",function(req,res)
{
  var itemName=req.body.newitem;
 const listName=req.body.list
  var itemss=new Items(
    {
      name:itemName
    }
  );
  if(listName==="Today")
  {
  itemss.save();
  res.redirect("/");}
  else{
    Lists.findOne({name:listName},function(err,foundlist)
    {
      foundlist.items.push(itemss);
      foundlist.save()
      res.redirect("/"+listName)
    })
  }
});

app.get("/about",function(req,res)
{
  res.render("about");

});
app.post("/delete",function(req,res)
{

 const checkitemid= req.body.checkbox;
 const listName=req.body.list;
 if(listName==="Today")
 {
 Items.findByIdAndRemove(checkitemid,function(err)
 {
  if(err)
  console.log(err)
 });
 res.redirect("/");
}
else
{
  Lists.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkitemid}}},function(err,foundlist)
  {
    if(!err)
    {
    res.redirect("/"+listName);
    }
    else
    console.log(err)
  })
}
 })
app.listen("3000",function()
{

});
