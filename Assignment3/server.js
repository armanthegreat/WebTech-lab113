const sqlite = require('sqlite3').verbose();
let db = my_database('./products.db');

var express = require("express");
var app = express();
let router = express.Router();

var bodyParser = require("body-parser");
app.use(bodyParser.json());


router.get("/items", function(req, res) {

    let sql = "SELECT * from products"

    db.all("SELECT id, product, origin, best_before_date, amount, image FROM products", function(...

    // db.all(sql, [], function(err, rows) {
        // if (err) throw err;

        // res.json(rows)
    } )

    // Response gets converted to JSON and sent further
    // res.json()
})


router.get("/items", function(req, res) {

    let sql = "SELECT * FROM products WHERE id=?";

    db.all("SELECT id, product, origin, best_before_date, amount, image FROM products WHERE id=" + id, function(...

    // db.get(sql,[res.body.id], function(err, rows) {
    //     if (err) console.log(err);

    //     console.log(rows)
    //     res.json(rows)

    // } )

    // Response gets converted to JSON and sent further
    // res.json()
})


router.post("/items", function(req, res) {


    db.run(`INSERT INTO products (product, origin, best_before_date, amount, image)
    VALUES (?, ?, ?, ?, ?)`,
    [item['product'], item['origin'], item['best_before_date'], item['amount'],  item['image']], function(...


    // Response gets converted to JSON and sent further
    res.json()
})


router.put("/items", function(req, res) {

    db.run(`UPDATE products
    SET product=?, origin=?, best_before_date=?, amount=?,
    image=? WHERE id=?`,
    [item['product'], item['origin'], item['best_before_date'], item['amount'], item['image'], item['id']], function(...


    // Response gets converted to JSON and sent further
    res.json()
})


router.delete("/items", function(req, res) {

    db.run("DELETE FROM products WHERE id=" + id, function(...



    // Response gets converted to JSON and sent further
    res.json()
})



app.use("/api", router);


app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");


// ###############################################################################
// Some helper functions called above
function my_database(filename) {
    // Conncect to db by opening filename, create filename if it does not exist:
    var db = new sqlite.Database(filename, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the products database.');
    });
    // Create our products table if it does not exist already:
    db.serialize(() => {
        db.run(`
        	CREATE TABLE IF NOT EXISTS products
        	(id 	  INTEGER PRIMARY KEY,
        	product	CHAR(100) NOT NULL,
        	origin 	CHAR(100) NOT NULL,
        	best_before_date 	CHAR(20) NOT NULL,
          amount  CHAR(20) NOT NULL,
        	image   CHAR(254) NOT NULL
        	)`);
        db.all(`select count(*) as count from products`, function (err, result) {
            if (result[0].count == 0) {
                db.run(`INSERT INTO products (product, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`,
                    ["Apples", "The Netherlands", "November 2019", "100kg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Apples.jpg/512px-Apples.jpg"]);
                console.log('Inserted dummy Apples entry into empty product database');
            } else {
                console.log("Database already contains", result[0].count, " item(s) at startup.");
            }
        });
    });
    return db;
}