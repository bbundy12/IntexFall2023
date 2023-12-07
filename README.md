# intexfall2023.is404.net

## Description

Amidst the increasing role of social media in daily life, Provo's city government has initiated a project to explore the relationship between digital connectivity and mental health in the community. The Social Media Usage and Mental Health committee (SMU MH committee) aims to understand how social media usage patterns contribute to challenges such as anxiety, depression, and social isolation. This project involves investigating a dataset, creating a citizen survey website, and developing a dashboard for data exploration.

## Table of Contents

- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Grading Instructions](#grading-instructions)

# Usage

This webside provides functionality for 3 seperate groups:
-Provo City Council Administration
-Provo City Workers
-Provo City Residents

Provo City Administration:
As Provo City Admnistrators, they'll be able to login, view raw survey data, create login's for Provo City Workers, analyze survey data through a dashboard, edit account info, and take the survey

Provo City Workers:
As Provo City Workers, they'll be able to login, view raw survey data, analyze survey data through a dashboard, edit account info, and take the survey

Provo City Residents:
As Provo City Residents, they'll be able to analyze survey data and take the survey

# Features

Feature 1: Any person who visits the website will be able to take the mental health survey. The answers will then be sent to the database. The database will then call a trigger/function to update a table with the new data

Feature 2: Any person who visits the website will be able to follow a link that'll take them to the dashboard page. Whereupon they'll be able to analyze the survey anonymous survey results and explore the data.

Feature 3: Login ability for Administration and City workers. Based on their login credentials, it will direct them to a specific landing page. Upon a successful login attempt, their username will be stored to local storage and will be used to determine if they have the credentials to be on a specific page

Feature 4: If anyone tries to access a page that they aren't supposed to, they will be directed to the unauthorezed page. Where upon they will then be directed to the login page.

Feature 5: Admin's will be able to create accounts for new city workers. When creating the new accounts, it will check if a username has already been taken. It if has, it will display an error. On the same form, it will have them confirm the password. If the passwords don't match, it will display an error.

Feature 6: All users/admin will be able to edit account info. For the purposes/scope of this project, the only information they'll be able to edit is their password. When the form is submitted it makes sure that the username they entered matches what is stored in local storage. If it doesn't, it displays an error. This will prevent other users from changing the login info for other users.

Feature 7: On the view data page, City Personelle and Admin will be able to filter by location or return the record of a specific survey.

Feature 8: It is all mobile friendly.

# Technologies Used

Node.js: Used for handling server-side logic, API requests, and interaction with the database.

AWS RDS (PostgreSQL): Ensures efficient management of user data with a focus on integrity and security.

AWS Elastic Beanstalk: The platform is deployed on AWS, ensuring secure access over HTTPS. It also uses other AWS services such as EC2, S3, and Elastic Load Balancing.

AWS Pipline: The Elastic Beanstalk Env is connected to the github repo. Which enables easier deployment to the server.

Tableau for Dashboard: The dashboard connects to the database holding citizens' responses. Manual refresh is implemented.

# Grading Instructions

Accessing the website

URL: intexfall2023.is404.net
Admin Username: admin@provocity.org
Admin Password: Admin

City Worker Username: jakob@provocity.org
City Worker Password: Jakob

Home Page:
On the home page you have buttons to either let you take the survey, go to the dashboard, or login

Survey Page: Here you'll take the survey and once completed, will take you to a survey submitted page which will then take you back to the home page.

Dashboard Page: This page allows anyone to use the dashboard and see analytics into the data contained in the survey. There is also a button to send the user to home if clicked.

Login: On the login page there is a form to fill out the username and password to log in. If either the username and/or password are incorrect, an error will be displayed. 

Landing Pages:
 - Admin Landing: If the user logs in with the admin credentials, they'll be directed to the admin landing page.
 - User Landing: If the user logs in with any other credential that isn't admin, they'll be directed to this page.

Admin Landing: On the admin page you'll see a button to see the survey data, edit account info, create user, and logout. There on the landing page is also the dashboard for them to look at analytics of the data.
 - When the logout button is clicked, the user is brought to a page that says their logout was successful and clears their username from local storage and then takes them to the home page.

User Landing: On the user landing page you'll see a button to see the survey data, edit account info, and logout.
 - When the logout button is clicked, the user is brought to a page that says their logout was successful and clears their username from local storage and then takes them to the home page.

View Data: This page displays a table of all the survey results when initially loaded. The user then has the option to filter by city as well as search for a specific survey response.

Create User: This page is only accessable by the Admin account when they are logged in. Here they'll be able to create a new account. When the form is submitted. It first checks to make sure the username isn't the same as any other username in the database. If it is the same, it displays an error prompting them to put in a new username. If the username is avaliable but the new passwords don't match, they will be prompted to re-enter the passwords to make sure they match. When the account is successfully created, it takes them to a page that says the account creation was successful. It then redirects them to the admin landing page.

Edit Account Info: This page is accessable by all users. It prompts the user to enter in their username and their old password. Then they enter in a new password and confirm their new password. When that form is submitted, it makes sure that the username they entered is the same username that is stored in local storage when they signed in. If it isn't, it gives them an error that tells them to enter in their correct username. The same goes for the passwords if the new ones don't match eachother.


