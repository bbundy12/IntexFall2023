const express = require("express");

let app = express();

let path = require("path");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

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

knex.raw('SELECT * from users')
    .then(() => {
        console.log('Connection to database successful');
        // You can start using your knex instance here
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });

app.get("/", (req, res) => {
    try {
        res.render("loginUser", {});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/survey", (req,res) => {
    try {
        res.render("survey", {});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.get("/createUser", (req,res) => {
    try {
        res.render("createUser", {});
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', (req,res) => {
    try {
        // Check if the username and password match a user in the database
        const user = knex.select('Username','Password').from('users').where('Username',req.body.username).andWhere('Password',req.body.password).then();

        if (user) {
            // If user is found, you can redirect to a different route or render a page
            res.redirect('/createUser');
        } else {
            // If user is not found, you can render the login page with an error message
            res.render('/loginUser', { error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(port, () => console.log("Express App has started and server is listening!"));            
        