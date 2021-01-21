const sqlite = require('sqlite3').verbose();
const db = my_database('./products.db');

const express = require("express");
const app = express();
const router = express.Router();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//SETTING HEADER FOR ALL ROUTES - !!!!
// app.use(res.set({
//     "content-type": "application/json",
// }));

// ************************************************************************************************ //
//                                       ROUTERS                                                    //

// GETTING ALL ITEMS
router.get("/", function (req, res) {

    db.all("SELECT id, product, origin, best_before_date, amount, image FROM products", function (err, rows) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(rows);
        }
    })
});

// GETTING PARTICULAR ITEM WITH ID
router.get("/:id", function (req, res) {

    let id = req.params.id;

    db.all("SELECT id, product, origin, best_before_date, amount, image FROM products WHERE id=" + id, function (err, row) {
        if (err) {
            res.status(400).send(err);
        } else if (JSON.stringify(row) == "[]") {
            res.status(404).send(err)
        } else {
            res.json(row);
        }
    })
});

// POSTING ITEM 
router.post("/", function (req, res) {

    let item = req.body;

    console.log(item);

    db.run(`INSERT INTO products (product, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`,
        [item['product'], item['origin'], item['best_before_date'], item['amount'], item['image']],
        function (err, item) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).json(item);
                // res.send(row);
            }
        })
});

// UPDATING ITEM
router.put("/", function (req, res) {

    let item = req.body;

    // is it fine if we require all items info to be requested with ??? 
    db.run(`UPDATE products SET product=?, origin=?, best_before_date=?, amount=?,mage=? WHERE id=?`,
        [item['product'], item['origin'], item['best_before_date'], item['amount'], item['image'], item['id']],
        function (err, item) {
            if (err) console.log(err);
            if (err) {
                res.status(400).send(err);
            } else if (item.n === 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(204);
                //  Might want to respond with the updated version of item
            }
        })
});

// DELETING ITEM
router.delete("/:id", function (req, res) {

    let id = req.params.id

    db.run("DELETE FROM products WHERE id=" + id, function (err, item) {
        if (err) {
            res.status(400).send(err);
        } else if (item.n === 0) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
            // Might want to inform somehow item was deleted
        }
    })
});

// RESET ITEM - doesn't work
router.get("/reset", function (req, res) {

    console.log("Hitting it")

    // db.run("DELETE  FROM products", function (err) {
    //     if (err) console.log(err);
    //     // ERROR HANDLING
    //     // res.send("Table reset")
    // })
});

app.use("/api/items", router);

// ************************************************************************************************ //


// LISTENING ON PORT: 3000
app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/api/items");


// INIT DATABASE
function my_database(filename) {
    // Connects to db by opening filename, creates filename if it does not exist:
    let db = new sqlite.Database(filename, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the products database.');
    });

    // Creates products table if it does not exist already:
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
                // Generates first item in the products table
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