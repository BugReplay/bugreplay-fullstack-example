require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;
let API_URL = process.env.BUGREPLAY_API_URL
const fetch = require('node-fetch');
const path = require('path')
let SECRET = process.env.SECRET || ""
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
app.post('/callback', (req, res) => {
    let uuid = req.body.uuid
    let secret = req.body.secret
    if (secret != SECRET) {
        res.status(401)
        console.error("401 in send_uuid. Secret is wrong.")
        return res.json({
            "success": "false",
            "error": "incorrect secret"
        })
    }
    currentUUID = uuid;
    res.json({
        "success": "true",
        "uuid": currentUUID
    })
});

app.post('/test_send', async (req, res) => {

    let apiKey = req.body.api_key
    let jsonBody = req.body.json_request

    let theJSON = JSON.parse(jsonBody)
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