const sqlite = require('sqlite3').verbose();
const db = my_database('./products.db');

const express = require("express");
const app = express();
const router = express.Router();

const bodyParser = require("body-parser");
app.use(bodyParser.json());


// ************************************************************************************************ //
//                                       ROUTERS                                                    //

// GETTING ALL ITEMS
router.get("/", function(req, res) {

    db.all("SELECT id, product, origin, best_before_date, amount, image FROM products", function(err, rows) {

    })
    
});

// GETTING PARTICULAR ITEM WITH ID
router.get("/:id", function(req, res) {

    let id = req.params.id;

    db.all("SELECT id, product, origin, best_before_date, amount, image FROM products WHERE id=" + id, function(err, row) {

    })

    
});

// POSTING ITEM 
router.post("/", function(req, res) {

    // Might be wrong
    let item = req.body;

    db.run(`INSERT INTO products (product, origin, best_before_date, amount, image)
    VALUES (?, ?, ?, ?, ?)`,
    [item['product'], item['origin'], item['best_before_date'], item['amount'],  item['image']], function(err, row) {
        
    })


});

// UPDATING ITEM
router.put("/", function(req, res) {

    // Might be wrong
    let item = req.body; 

    db.run(`UPDATE products
    SET product=?, origin=?, best_before_date=?, amount=?,
    image=? WHERE id=?`,
    [item['product'], item['origin'], item['best_before_date'], item['amount'], item['image'], item['id']], function(err, row) {

    })


});

// DELETING ITEM
router.delete("/:id", function(req, res) {

    let id = req.params.id

    db.run("DELETE FROM products WHERE id=" + id, function(err) {
        if (err) {
            throw err;
        }
    })

});


app.use("/api/items", router);

// ************************************************************************************************ //


// LISTENING ON PORT: 3000
app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");


// INIT DATABASE
function my_database(filename) {
    // Conncect to db by opening filename, create filename if it does not exist:
    let db = new sqlite.Database(filename, (err) => {
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