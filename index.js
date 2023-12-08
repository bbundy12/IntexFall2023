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
        res.render("index", {error:null});
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

        if (users.length == 1 && users[0].Username === 'admin@provocity.org') {
            // If at least one user is found, you can redirect to a different route or render a page
            res.redirect('/adminLanding');
        } 
        else if (users.length === 1) {
            res.redirect('/userLanding')
        }
        else {
            // If no user is found, you can render the login page with an error message
            res.render('loginUser', { error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
  

app.post("/storeUser", async (req, res) => {
  try {
    // Check if the new username already exists
    const existingUser = await knex("users")
      .where("Username", req.body.username)
      .select('Username');

    if (existingUser.length > 0) {
      // If the username already exists, render the createUser page with an error
      res.render('createUser', { error: "Username Already Taken" });
      return; // Add return to stop further execution
    } else {
      // If the username is not taken, insert the new user
      await knex("users").insert({ Username: req.body.username, Password: req.body.password });
      res.redirect("accountCreated");
    }
  } catch (err) {
    console.error('Error storing user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
                res.redirect('/updatedPassword');
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

app.get('/updatedPassword', (req, res) => {
    res.render('updatedPassword');
  });

app.get('/userLanding', (req, res) => {
    res.render('userLanding');
  });

app.get('/adminLanding', (req, res) => {
    res.render('adminLanding');
  });

  app.get('/unauthorized', (req, res) => {
    res.render('unauthorized');
  });

  app.get('/login', (req, res) => {
    res.render('loginUser');
  });

  app.get('/dashboard', (req, res) => {
    res.render('dashboard');
  });

  app.get('/surveySubmitted', (req, res) => {
    res.render('surveySubmitted');
  })

  app.post("/storeSurvey", (req, res) => {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  
    console.log(timestamp)

    const handleNullOrUndefined = (value) => {
      return value !== undefined && value !== null ? value : false;
    };
  
    knex("mentalhealthstats").insert({
        timestamp: timestamp,
        location: "Provo",
        age: req.body.age,
        gender: req.body.gender,
        relationship_status: req.body.relationship_status,
        occupation_status: req.body.occupation_status,
        affiliated_with_university: handleNullOrUndefined(req.body.university_hidden),
        affiliated_with_school: handleNullOrUndefined(req.body.school_hidden),
        affiliated_with_private: handleNullOrUndefined(req.body.private_hidden),
        affiliated_with_company: handleNullOrUndefined(req.body.company_hidden),
        affiliated_with_government: handleNullOrUndefined(req.body.government_hidden),
        social_media_usage: req.body.social_media_usage,
        average_time_on_social_media: req.body.average_social_media_time,
        social_media_usage_without_purpose: req.body.question_9,
        social_media_distraction_frequency: req.body.question_10,
        restlessness_due_to_social_media: req.body.question_11,
        general_distractibility_scale: req.body.question_12,
        general_worry_bother_scale: req.body.question_13,
        general_difficulty_concentrating: req.body.question_14,
        comparing_yourself_to_other_successful_people_frequency: req.body.question_15,
        feelings_about_social_media_comparisons: req.body.question_16,
        seek_validation_from_social_media: req.body.question_17,
        general_depression_frequency: req.body.question_18,
        general_daily_activities_interest_fluctuation_scale: req.body.question_19,
        general_sleep_issues_scale: req.body.question_20
      })
      .returning("person_id")
      .then(async (mentalHealthStatsIds) => {
        const mentalHealthStatsId = mentalHealthStatsIds[0].person_id;
        const socialMediaPlatforms = [
          "Instagram", "Facebook", "Twitter", "Tiktok", "YouTube",
          "Discord", "Reddit", "Pinterest", "Snapchat"
        ];
        for (const platform of socialMediaPlatforms) {
          if (req.body[`${platform}_hidden`]) {
            try {
              await knex("socialmedia").insert({
                person_id: mentalHealthStatsId,
                social_media_platform: platform
              });
            } catch (error) {
              console.error(`Error inserting into socialmedia for platform ${platform}:`, error);
              throw error; // rethrow the error to be caught by the outer catch
            }
          }
        }
      })
      .then(() => {
        res.redirect("/surveySubmitted");
      })
      .catch((error) => {
        console.error("Error in transaction:", error);
        res.status(500).send("Internal Server Error");
    })
});

app.get('/viewData', async (req, res) => {
    try {
      // Fetch data from mentalhealthstats and socialmedia tables
      let query = knex
        .select(
          'mentalhealthstats.person_id',  
          'mentalhealthstats.timestamp',
          'mentalhealthstats.location',
          'mentalhealthstats.age',
          'mentalhealthstats.gender',
          'mentalhealthstats.relationship_status',
          'mentalhealthstats.occupation_status',
          'mentalhealthstats.affiliated_with_university',
          'mentalhealthstats.affiliated_with_school',
          'mentalhealthstats.affiliated_with_private',
          'mentalhealthstats.affiliated_with_company',
          'mentalhealthstats.affiliated_with_government',
          'mentalhealthstats.social_media_usage',
          knex.raw('array_agg(socialmedia.social_media_platform) as social_media_platforms_used'),
          'mentalhealthstats.average_time_on_social_media',
          'mentalhealthstats.social_media_usage_without_purpose',
          'mentalhealthstats.social_media_distraction_frequency',
          'mentalhealthstats.restlessness_due_to_social_media',
          'mentalhealthstats.general_distractibility_scale',
          'mentalhealthstats.general_worry_bother_scale',
          'mentalhealthstats.general_difficulty_concentrating',
          'mentalhealthstats.comparing_yourself_to_other_successful_people_frequency',
          'mentalhealthstats.feelings_about_social_media_comparisons',
          'mentalhealthstats.seek_validation_from_social_media',
          'mentalhealthstats.general_depression_frequency',
          'mentalhealthstats.general_daily_activities_interest_fluctuation_scale',
          'mentalhealthstats.general_sleep_issues_scale',
        )
        .from('mentalhealthstats')
        .leftJoin('socialmedia', 'mentalhealthstats.person_id', '=', 'socialmedia.person_id')
        .groupBy('mentalhealthstats.person_id')
        .orderBy('mentalhealthstats.person_id');
  
      // Apply location filter if selected in the form
      const selectedLocation = req.query.location;
      if (selectedLocation && selectedLocation !== 'all') {
        query = query.where('mentalhealthstats.location', selectedLocation);
      }
  
      // Apply person_id filter if provided in the form
      const personIdFilter = req.query.person_id;
      if (personIdFilter) {
        query = query.where('mentalhealthstats.person_id', personIdFilter);
      }
  
      // Execute the query
      const data = await query;
  
      // Render the viewData.ejs file with the fetched data
      res.render('viewData', { data, selectedLocation, personIdFilter });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

  app.get('/logout', (req, res) => {
    res.render('logoutSuccessful');
  })

  app.get('/accountCreated', (req, res) => {
    res.render('accountCreated');
  })
  
  
app.listen(port, () => console.log("Express App has started and server is listening!"));