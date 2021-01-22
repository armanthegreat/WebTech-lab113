const sqlite = require('sqlite3').verbose();
const db = my_database('./products.db');

const express = require("express");
const app = express();
const router = express.Router();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//HTTP HEADER MIDDLEWARE
app.use(function(req, res, next) {
   res.set({
       "content-type": "application/json"
    //    Check what headers TA mentioned and add them;
   });
    next();
})

// ************************************************************************************************ //
//                                       ROUTERS                                                    //

// Create
router.post("/items", function (req, res) {

    let item = req.body;

    db.run(`INSERT INTO products (product, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`,
        [item['product'], item['origin'], item['best_before_date'], item['amount'], item['image']],
        function (err, item) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).json(item);
                // res.send(row);
                // might want to respond to the URI of the new item
            }
        })
});

// Read (single item)
router.get("/items/:id", function (req, res) {

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

// Read (all items)
router.get("/items", function (req, res) {

    db.all("SELECT id, product, origin, best_before_date, amount, image FROM products", function (err, rows) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(rows);
        }
    })
});

// Update
router.put("/items", function (req, res) {

    let item = req.body;

    db.run(`UPDATE products SET product=?, origin=?, best_before_date=?, amount=?,image=? WHERE id=?`,
        [item['product'], item['origin'], item['best_before_date'], item['amount'], item['image'], item['id']],
        function (err, item) {
            if (err) console.log(err);
            if (err) {
                res.status(400).send(err);
            } else {
                res.sendStatus(204);
                //  Might want to respond with the URI of updated item
            }
        })
});

// Delete
router.delete("/items/:id", function (req, res) {

    let id = req.params.id

    db.run("DELETE FROM products WHERE id=" + id, function (err, item) {
        if (err) {
            res.status(400).send(err);
        } else if (item.n === 0) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    })
});

// Reset db
router.get("/reset", function (req, res) {

    db.run("DELETE  FROM products", function (err) {
        if (err) {
            res.status(400).send(err);
            console.log(err);
        } else {
            res.sendStatus(204);
            // check if reset should be safe, there is console.log after calling following function;
            my_database('./products.db');
        }
    })
});

// ************************************************************************************************ //

// INIT ROUTERS & LISTENING PORT
app.use("/api", router);
app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/api/items");


// INIT DATABASE
function my_database(filename) {
    // Connects to db by opening filename, creates filename if it does not exist
    let db = new sqlite.Database(filename, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the products database.');
    });

    // Creates products table if it does not exist already
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
                // console.log('Inserted dummy Apples entry into empty product database');
            } else {
                // console.log("Database already contains", result[0].count, " item(s) at startup.");
            }
        });
    });
    return db;
}