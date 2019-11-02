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
    startManaging();
});

var startManaging = function(){
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Menu Options",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    })
    .then(function(answer){
        switch(answer.action){
            case "View Products for Sale":
                itemsAvailable();
                break;
            case "View Low Inventory":
                quantityLow();
                break;
            case "Add to Inventory":
                quantityAdd();
                break;
            case "Add New Product":
                productAdd();
                break;
            case "Exit":
                connection.end();
                break;
            
        }
    })
};
// ===================================================================
// View Products for Sale
function itemsAvailable(){
    connection.query("SELECT * FROM products", function(err, res){
        console.log("\n\n------------------------------------------\n\nITEMS AVAILABLE FOR SALE\n\n");
        if(err) throw err;
        for (var i=0;i<res.length;i++){
            if(res[i].stock_quantity != 0){
            console.log("ITEM ID:  "+res[i].item_id+"  |  PRODUCT:  "+res[i].product_name+"  |  PRICE:  "+res[i].price_customer+"  |  IN STOCK:  "+res[i].stock_quantity)
            }
            else {console.log("ITEM ID:  "+res[i].item_id+"  |  PRODUCT:  "+res[i].product_name+"  |  PRICE:  "+res[i].price_customer+"  |  IN STOCK:  SOLD OUT")
            }
        }
        console.log("\n\n------------------------------------------\n");
        startManaging();
    });
}
// ===================================================================
// View Low Inventory
function quantityLow(){
    connection.query("SELECT * FROM products",function(err, res){
        if(err) throw err;
        console.log("\n\n------------------------------------------\n\n5 or Less Remaining in Inventory of the following Products:\n\n");
        for (var i=0;i<res.length;i++){
            if(res[i].stock_quantity > 0 && res[i].stock_quantity <= 5){
            console.log("ITEM ID:  "+res[i].item_id+"  |  PRODUCT:  "+res[i].product_name+"  |  PRICE:  "+res[i].price_customer+"  |  IN STOCK:  "+res[i].stock_quantity)
            }
            else if(res[i].stock_quantity === 0){console.log("ITEM ID:  "+res[i].item_id+"  |  PRODUCT:  "+res[i].product_name+"  |  PRICE:  "+res[i].price_customer+"  |  IN STOCK:  SOLD OUT")
            }
        }
        console.log("\n\n------------------------------------------\n");
        startManaging();
    });
}
// ===================================================================
// Add to Inventory
var quantityAdd = function (){
    connection.query("SELECT * FROM products",function(err, res){
        if(err) throw err;
        console.log("\n\n------------------------------------------\nRemaining Inventory:\n\n");
        for (var i=0;i<res.length;i++){
            if(res[i].stock_quantity != 0){
            console.log("ITEM ID:  "+res[i].item_id+"  |  PRODUCT:  "+res[i].product_name+"  |  PRICE:  "+res[i].price_customer+"  |  IN STOCK:  "+res[i].stock_quantity)
            }
            else {console.log("ITEM ID:  "+res[i].item_id+"  |  PRODUCT:  "+res[i].product_name+"  |  PRICE:  "+res[i].price_customer+"  |  IN STOCK:  SOLD OUT")
            }
        }
        console.log("\n\n------------------------------------------\n");
        // itemQuantity();
    
        inquirer.prompt({
            name:"item_id",
            type:"input",
            message:"Which item ID are we adding to?",
            // console.log(answer);
        }).then(function(answer){
            var query = "SELECT * FROM products WHERE ? ";
            connection.query(query, {item_id:answer.item_id}, function(err, res){
                if(err) throw err;
                for(var i=0;i<res.length;i++){
                    console.log("\n\nID:  "+res[i].item_id+"\nProduct:  "+res[i].product_name+"\nPrice:  "+res[i].price_customer+"\nQuantity:  "+res[i].stock_quantity+" left.\n\n------------------------------\n");
                }
                itemQuantity(res);
            })
        })    
    });
};

var itemQuantity = function (wantedItem){
    inquirer.prompt({
        name:"quantity",
        type:"number",
        message:"How many do you want to add?",
        validate: function(value){
            if(isNaN(value)===false){
                return true;
            }return false;
        }
    }).then(function(answer){
        connection.query(
            "UPDATE products SET ? WHERE ?",[{
                stock_quantity: answer.quantity+wantedItem[0].stock_quantity
            },{
                item_id: wantedItem[0].item_id
            }],
            function(err){
                if(err) throw err;
                console.log("\n\n------------------------------\n");
                console.log("PRODUCT=>  "+wantedItem[0].product_name+"\n\nEXISTING:\n"+wantedItem[0].stock_quantity+"\n\n------------------------------\n");
                console.log("ADDED:\n"+answer.quantity+"\n\n------------------------------\n");
                var stock_remaining = wantedItem[0].stock_quantity + answer.quantity;
                // var price_total = answer.quantity * wantedItem[0].price_customer;
                console.log("NEW QUANTITY:\n"+stock_remaining);
                console.log("\n------------------------------\n\n");
                startManaging(); 
            }
        )

    })
};

// ===================================================================
// Add New Product
function productAdd(){
    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "What product would you like to add?"
        },{
            name: "department",
            type: "input",
            message: "What department would you like to place it in?"
        },{
            name: "price",
            type: "input",
            message: "How much does is it cost?",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        },{
            name: "quantity",
            type: "number",
            message: "How many are we adding to inventory?",
            validate: function(value){
                if(isNaN(value) === false){
                    return true;
                }
                return false;
            }
        }
    ])
    .then(function(answer){
        connection.query(
            "INSERT INTO products SET ?",{
                product_name: answer.product,
                department_name: answer.department,
                price_customer: answer.price,
                stock_quantity: answer.quantity
            },
            function(err){
                if(err) throw err;
                console.log("\n------------------------------------------\n\n"+answer.product+" \nwas added to inventory.\nThere are: \n"+answer.quantity+"\ncurrently in stock.\n\n------------------------------\n\n");
                startManaging();
            }
        )
    })
}