require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || "8000";
let API_URL = process.env.BUGREPLAY_API_URL || "http://localhost:8080" // || "https://app.bugreplay.com"
const fetch = require('node-fetch');
const path = require('path')
let SECRET = process.env.SECRET || "secret"
var currentUUID = "";

app.use(express.static(path.join(__dirname, 'build')))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

/**
 * The send uuid api endpoint is published in your BugReplay account Settings as your "Callback URL".
 * It must be in POST and accept two parameters: 'uuid' and 'secret'. The secret is a temporary password 
 * that can be set on the BugReplay Settings page.
 */

app.post('/test_send', async (req, res) => {

    let apiKey = req.body.api_key
    let jsonBody = req.body.json_request

    var theJSON
    try {
        theJSON = JSON.parse(jsonBody)
    } catch (e) {
        return res.json({
            "success": "false",
            "error": "Could not parse JSON request body"
        })
    }

    var brHeader = req.header('BugReplay-Recording-UUID')
    if (brHeader) {
        console.log("We have a BugReplayRecordingUUID: " + brHeader)
    } else {
        return res.json({
            "success": "false",
            "error": "No BugReplay-Recording-UUID, doing nothing"
        })
    }

    theJSON.uuid = currentUUID
    theJSON.timestamp = Date.now()

    const rawResponse = await fetch(`${API_URL}/api/fullstack/v1/send`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify(theJSON)
    });
    const data = await rawResponse.json();
    if (!data.success) {
        res.json({
            "success": "false",
            "error": data.error,
        })
    } else {
        res.json({
            "success": "true",
            "data": data
        })
    }
});

app.listen(PORT, () => {
    console.log(`BugReplay FullStack Demo app running on port ${PORT}!`)
});