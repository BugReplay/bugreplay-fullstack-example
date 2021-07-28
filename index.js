require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || "8000";
const SENTRY_DSN = process.env.SENTRY_DSN || '';
let API_URL = process.env.BUGREPLAY_API_URL || "https://app.bugreplay.com"
const fetch = require('node-fetch');
const path = require('path')

app.use(express.static(path.join(__dirname, 'build')))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

/**
 * The uuid will be passed in a specific request Header during a BugReplay Recording session.
 * This header is "bugreplay-recording-uuid"
 * It needs to be sent along in Post to identify the recording the server logs belong to.
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

    var brHeader = req.header('bugreplay-recording-uuid')
    if (!brHeader) {
        return res.json({
            "success": "false",
            "error": "No BugReplay-Recording-UUID, doing nothing"
        })
    }

    Sentry.init({
        dsn: ,

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });

    const transaction = Sentry.startTransaction({
        op: "test",
        name: "My First Test Transaction",
    });

    setTimeout(() => {
        try {
            bugreplay_foo();
        } catch (e) {
            Sentry.setTag("bugreplay-uuid", brHeader);
            Sentry.captureException(e);
        } finally {
            console.log("Finishing transaction")
            transaction.finish();
        }
    }, 99)

    theJSON.uuid = brHeader
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
    console.log(`BugReplay FullStack Demo app running...`)
});