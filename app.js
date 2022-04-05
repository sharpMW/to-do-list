const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const res = require("express/lib/response");
const req = require("express/lib/request");
const port = process.env.PORT || 3000;
const app = express();
const date = require(__dirname + "/date.js");
const _ = require('lodash');

//console.log(date()); //you need to put parentheses after date to run the function
// mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', {useNewUrlParser: true} );

mongoose.connect('mongodb+srv://admin-saarim:mongoatlaspswd@cluster-mw.t40m9.mongodb.net/todolistDB', {useNewUrlParser: true} );
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const itemSchema = {
    name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "First"
});
const item2 = new Item({
    name: "Second"
});
const item3 = new Item({
    name: "Third"
});
const defaultItems = [item1, item2, item3];

// const items = ["Homework", "exercise", "meditation"];      these two arrays will be deleted
// const workItems = [];

app.get("/", (req, res)=>{
    // var today = new Date();
    // var currentDay = today.getDay();
    // var day = "";
    // switch(currentDay) {
    //     case 0:
    //         day="Sunday";
    //         break;
    //     case 1:
    //         day="Monday";
    //         break;
    //     case 2:
    //         day="Tuesday";
    //         break;
    //     case 3:
    //         day="Wednesday";
    //         break;
    //     case 4:
    //         day="Thursday";
    //         break;
    //     case 5:
    //         day="Friday";
    //         break;
    //     case 6:
    //         day="Saturday";
    //         break;
    // }
    let day = date.getDay(); //getting day from date.js file
    Item.find({}, function (err, foundItems){ //the curly braces after find is to provide parameters for the object you're looking for
        if(foundItems.length===0){
            Item.insertMany(defaultItems, (err)=>{
                if(err){
                    console.log("Your error: " + err);
                } else {
                    console.log("Successfully saved items to database");
                }
                res.redirect("/");
            });
        } else {
            console.log("Successfully found items");
            res.render("list", {listTitle: day, newListItems: foundItems}); //giving value of listTitile as day 
        }
    })   
});
 
const listSchema = {
    name: String,
    listItems: [itemSchema] //it will have array of items based on item Schema 
}
const List = mongoose.model("List", listSchema);
app.post("/", (req, res)=>{
    const itemName = req.body.newItem; //name of that plus button is newItem in list.ejs
    const listName = req.body.listButton;
    const item = new Item({
        name: itemName
    });
    if(listName === date.getDay()){
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, (err, foundList)=>{
            foundList.listItems.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
    
});  

app.post("/delete", (req, res)=>{
    
    const checkedItemID = req.body.checkbox;
    const thisListName = req.body.listName;
    if(thisListName === date.getDay()){
        Item.findByIdAndRemove(checkedItemID, (err)=>{  //if you don't provide the callback then it won't execute the delete part
            if(!err) {console.log("Successfully deleted item")};
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({name: thisListName}, {$pull: {listItems: {_id: checkedItemID}}}, (err)=>{ //don't forget to put "listItems" here
            if(!err){
                res.redirect("/" + thisListName)
            }
        });
    }
});
app.get('/favicon.ico', (req,res)=>{
    console.log('your favicon');
   })  //you should give a separate route for favicon to be handled as a parameter
app.get('/:name', (req, res)=>{
    const listName = _.capitalize(req.params.name);
    List.findOne({name: listName}, (err, foundList)=>{
        if(!err){
            if(!foundList){
                const list = new List({
                    name: listName,
                    listItems: defaultItems
                });
                list.save();
                res.redirect('/' + listName);
            } else{
                res.render("list", {listTitle: foundList.name, newListItems: foundList.listItems});
            }
        }
    })
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
});