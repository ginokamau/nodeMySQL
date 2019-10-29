var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    itemsAvailable();
  });
  
function itemsAvailable() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for(var i=0;i<res.length;i++){
        console.log(res[i].item_id + "  |  " + res[i].product_name + "  |  " + res[i].price_customer);
        }
        console.log("------------------------------------------------")
        itemWanted();  
    });
}

var itemWanted = function(){
    inquirer.prompt({
        name:"item_id",
        type:"input",
        message:"What is the ID of the item you would like to purchase?"
    }).then(function(answer){
        var query = "SELECT * FROM products WHERE ? ";
        connection.query(query, {item_id:answer.item_id}, function(err,res){
            for(var i=0;i<res.length;i++){
                console.log("ID:   "+res[i].item_id + "\nProduct:   "+res[i].product_name+"\nPrice:   "+res[i].price_customer+"\nQuantity:   "+res[i].stock_quantity+" left"+"\n-------------------------\n");
            }
            itemWantedQuantity();
        })
    })

}

var itemWantedQuantity = function(){
    inquirer.prompt({
        name:"quantity",
        type:"input",
        message:"How many units would you like to buy?"
    })
    connection.end();
}
