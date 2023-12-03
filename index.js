const express = require("express");

let app = express();

let path = require("path");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || "localhost",
        user: process.env.RDS_USERNAME || "postgres",
        password: process.env.RDS_PASSWORD || "password",
        database: process.env.RDS_DB_NAME || "music",
        port: process.env.RDS_PORT || 5433,
        ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
    }
}); 

knex.raw('SELECT * from bands')
    .then(() => {
        console.log('Connection to database successful');
        // You can start using your knex instance here
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });

app.get("/", (req, res) => {
    knex.select("band_id", "band_name", "lead_singer").from('bands').then(bands => {
        res.render("displayBand", {mybands: bands});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.get("/findRecord", (req, res) => {
    res.render("findRecord", {});
});

app.get("/chooseBand/:bandName", (req, res) => {
    knex.select("band_name", "lead_singer").from('bands').where("band_name", req.params.bandName).then(bands => {
        res.render("displayBand", {mybands: bands});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.get("/editBand", (req, res) => {
    knex.select("band_id", "band_name", "lead_singer").from("bands").where("band_name", req.query.bandName.toUpperCase()).then(bands => {
        res.render("editBand", {mybands: bands});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });    
});


app.post("/editBand", (req, res) => {
    knex("bands").where("band_id", parseInt(req.body.bandID)).update({
        band_name: req.body.bandName,
        lead_singer: req.body.singer
    }).then(mybands => {
        res.redirect("/");
    });    
});

app.get("/addBand", (req, res) => {
    res.render("addBand");
});

app.post("/addBand", (req, res) => {
    knex("bands").insert({band_name: req.body.band_name, lead_singer: req.body.lead_singer}).then(mybands => {
        res.redirect("/");
    })
});

app.post("/deleteBand/:id", (req, res) => {
    knex("bands").where("band_id", req.params.id).del().then(mybands => {
        res.redirect("/");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
});

app.post("/deleteAllBands", (req, res) => {
    knex("bands").del().then(mybands => {
        res.redirect("/");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
});

app.listen(port, () => console.log("Express App has started and server is listening!"));            
        