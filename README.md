
# BugReplay FullStack API examples and documentation

Welcome to the BugReplay FullStack documentation. This repository contains all the information you need to get started using the FullStack api, along with a working demo project that you can fork and deploy to test things out and get familiar with how things work.

* [Documentation](https://github.com/BugReplay/bugreplay-fullstack-example/wiki/home)

## Getting Started

In order to get started you will need a BugReplay account with FullStack enabled.

First of all fork and clone this repository. Then cd into bugreplay-fullstack-example and run the following command:

```npm install

And on two different shell tabs do:

```npm run start

to run the api code that will mimic your server code and

```npm run start-demo

if you need the react frontend to test your calls

This will run an express server on localhost:8000 (and if you choose to run the demo also a react app on localhost:3003). To reach the express server from your BugReplay web app it will need to be on a reachable url so you could either use a tunnel like ngrok.io or you could very easily deploy it online on a service like heroku.com


