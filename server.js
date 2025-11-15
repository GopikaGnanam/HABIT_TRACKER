const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "habit_DataBase1",
});

con.connect((err) => {
    if (err) return console.log("DB Error:", err);
    console.log("Database Connected");
});

//add
app.post("/add", (req, res) => {
    const { habit, status } = req.body;

    const sql = "INSERT INTO habit (habit, status) VALUES (?, ?)";
    con.query(sql, [habit, status], (err, result) => {
        if (err) return res.json({ error: err });
        res.json({ success: true, id: result.insertId });
    });
});


app.get("/habits", (req, res) => {
    con.query("SELECT * FROM habit", (err, result) => {
        if (err) return res.json({sucess:false, error: err });
        res.json(result);
    });
});

//update
app.put("/update/:id", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    const sql = "UPDATE habit SET status = ? WHERE id = ?";
    con.query(sql, [status, id], (err, result) => {
    if (err){
        console.error("DB Error:", err);
        return res.status(500).json({ error: err });
    }
    res.json({ success: true });
    });
});

//delete

app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    con.query("DELETE FROM habit WHERE id = ?", [id], (err, result) => {
        if (err) return res.json({ sucess:false,error: err });
        res.json({ success: true,deleted:result.affectedRows });
    });
});


app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
console.log(__dirname);

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});



