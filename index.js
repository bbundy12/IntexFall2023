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
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        database: process.env.RDS_DB_NAME,
        port: process.env.RDS_PORT,
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
        res.render("loginUser", {error:null});
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

app.post('/login', async (req, res) => {
    try {
        // Check if the username and password match a user in the database
        const users = await knex.select('Username', 'Password').from('users').where('Username', req.body.username).andWhere('Password', req.body.password);

        console.log('Number of results:', users.length);

        if (users.length == 1) {
            // If at least one user is found, you can redirect to a different route or render a page
            res.redirect('/createUser');
        } else {
            // If no user is found, you can render the login page with an error message
            res.render('loginUser', { error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/storeUser", (req, res) => {
    knex("users").insert({ Username: req.body.username, Password: req.body.password })
        .then(() => {
            res.redirect("/");
        })
        .catch((err) => {
            console.error('Error storing user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

app.get('/editUser', (req, res) => {
    res.render('editUser');
  });

app.post('/updatePassword', (req, res) => {
    try {
        // Retrieve data from the form submission
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const confirmNewPassword = req.body.confirmNewPassword;
        const Username = req.body.username;

        // Update the password in the database
        knex('users')
            .where('Username', Username)
            .update({ Password: newPassword })
            .then(() => {
                // Password updated successfully, redirect to a success page
                res.redirect('/passwordUpdated');
            })
            .catch((error) => {
                // Handle database update error (redirect to editUser with an error)
                res.render('editUser', { error: 'Error updating password' });
            });
    } catch (error) {
        // Handle other errors (redirect to editUser with a generic error)
        res.render('editUser', { error: 'An unexpected error occurred' });
    }
});
  


app.listen(port, () => console.log("Express App has started and server is listening!"));            
        