const https = require('https')

exports.handler = async (event, context) => {
    console.log(event.body)
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    var emailData = JSON.stringify({
        "personalizations": [{ "to": [{ "email": "philip@kiely.xyz" }] }],
        "from": { "email": "philip@kiely.xyz" },
        "subject": "Who Pays Technical Writers Form Submission",
        "content": [{ "type": "text/plain", "value": JSON.stringify(event.body) }]
                    });


    const options = {
        hostname: 'api.sendgrid.com',
        path: '/v3/mail/send',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + process.env.SENDGRID_API_KEY
        }
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', d => {
            console.log(d)
            return {
                statusCode: 200,
                body: "Success"
            };
        })
    })

    req.on('error', error => {
        console.log(error)
        return {
            statusCode: 500,
            body: "Sendgrid failed."
        };
    })

    req.write(emailData)
    req.end()

}