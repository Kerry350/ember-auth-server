This repo is the server element to be paired with the [ember-auth](https://github.com/Kerry350/ember-auth) Ember.js app. 

Instructions:

- Make sure you have Node.js / npm installed
- Install and run Mongodb
- Clone the repo 
- Run `npm install`
- Run `node index.js`
- The server will now be listening on port `3200`
- If you'd like to make use of the Facebook example:
  - Add `FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET` variables to the `.env` file 
- If you'd like to try out the password reset flow:
  - Add `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` variables to the `.env` file

# `.env` file

This project makes use of environment variables which should be stored in a `.env` file in the root of the project. You should specify the following variables (or any of the optional ones from above):

- `APP_URL`, e.g. `http://localhost:4200`
- `PASSWORD_RESET_URL`, e.g. `http://localhost:4200/reset-password`

# Possible future features

- Two factor authentication
- ~~Sign up examples (this was originally aimed at showing authentication rather than the sign up process), password hashing etc~~
