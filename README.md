# Getting Started

In order to get started you will need a BugReplay account with FullStack enabled. 

First of all fork and clone this repository. Then cd into bugreplay-fullstack-example and run the following command: 

`npm install`

And on two different shell tabs do: 

`npm run start`

to run the api code that will mimic your server code and

`npm run start-demo` 

if you need the react frontend to test your calls

 This will run an express server on localhost:8000 (and if you choose to run the demo also a react app on localhost:3003).
 To reach the express server from your BugReplay web app it will need to be on a reachable url so you could either use a tunnel like ngrok.io or you could very easily deploy it online on a service like heroku.com
 

# API Setup

The "Callback url"

once you've set up an ngrok proxy to localhost:8000 you need to go online into your web app https://app.bugreplay.com/#/settings and click on the "Fullstack" tab. 
If you don't see the Fullstack tab make sure you have the fullstack addon enabled for the client/email you are using to log in. You will need to set the callback url in the settings page, together with a secret of your choice. You will check that the secret is valid in your server side code on the callback method you immplement. We have a callback method here in the code to get you started and to show how things can be setup. A callback url is needed so that BugReplay can communicate the uuid of the new recording that the extension is making. This uuid will be sent back to the bugreplay api during the "Send" method.

[Callback documentation](https://github.com/BugReplay/bugreplay-fullstack-example/wiki/send-method)


# Deploying the demo app online for testing

A simple way of deploying it online would be to use heroku.com in which case you just create a a heroku app, add the git remote and do

`git push heroku main`

To deploy it there. The heroku url of your app /callback will be your callback url that can be set in the bugreplay app settings in the Fullstack tab.
