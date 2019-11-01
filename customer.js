var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("\n------------------------------\n\nconnected as id: "+connection.threadId+"\n\n------------------------------\n");
    itemsAvailable();
});

function itemsAvailable(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        for(var i=0;i<res.length;i++){
            console.log(res[i].item_id+"  |  "+res[i].product_name+"  |  "+res[i].price_customer)
        }
        console.log("\n------------------------------\n");
        itemWanted();
    });
};

var wantedItem;
var itemWanted = function (){
    inquirer.prompt({
        name:"item_id",
        type:"input",
        message:"What is the ID of the item you would like to purchase?",
        // console.log(answer);
    }).then(function(answer){
        var query = "SELECT * FROM products WHERE ? ";
        connection.query(query, {item_id:answer.item_id}, function(err, res){
            if(err) throw err;
            for(var i=0;i<res.length;i++){
                console.log("ID:  "+res[i].item_id+"\nProduct:  "+res[i].product_name+"\nPrice:  "+res[i].price_customer+"\nQuantity:  "+res[i].stock_quantity+" left.\n\n------------------------------\n");
            }
            itemQuantity(res);
        })
    })    
};

var itemQuantity = function (wantedItem){
    inquirer.prompt({
        name:"quantity",
        type:"number",
        message:"How many do you want to buy?",
        validate: function(value){
            if(isNaN(value)===false){
                return true;
            }return false;
        }
    }).then(function(answer){
        console.log("\n\n------------------------------\n\n");
        console.log("WE HAVE:\n"+wantedItem[0].stock_quantity+"\n------------------------------\n\n");
        console.log("YOU WANT:\n"+answer.quantity+"\n------------------------------\n\n");
        var stock_remaining = wantedItem[0].stock_quantity - answer.quantity;
        var price_total = answer.quantity * wantedItem[0].price_customer;
        console.log("WE'LL HAVE LEFT:\n"+stock_remaining);
        if(answer.quantity <= wantedItem[0].stock_quantity){
            connection.query("UPDATE products SET ? WHERE ? ",[{
               stock_quantity: stock_remaining 
            },{
                item_id: wantedItem[0].item_id
            }],
            function(error){
                if(error) throw error;
                console.log("\n------------------------------\n\nCONGRATULATIONS\nYour Order for...\n\nOuantity:   "+answer.quantity+"\nProduct:  "+wantedItem[0].product_name+"\n\n...has been PROCESSED!!!\n\nYour Total Price is:  "+price_total+"\n\n------------------------------\n\n");
                restart();
            })
        }
        else{
            console.log("Sorry we don't have that many.")
            restart();
        }
    })
};

var restart = function(){
    inquirer.prompt({
        name: "quantityOrItem",
        type: "list",
        message: "Would you like to pick a new [QUANTITY] for this item or pick a new [ITEM]?",
        choices: ["QUANTITY","ITEM","EXIT"]
    })
    .then(function(answer){
        if(answer.quantityOrItem === "QUANTITY"){
            itemQuantity();
        }
        else if(answer.quantityOrItem === "ITEM"){
            itemsAvailable();
        }
        else{
            connection.end();
        }
    })
};