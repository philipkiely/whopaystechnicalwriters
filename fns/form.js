exports.handler = async (event, context) => {

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    var emailData = {
        "personalizations": [{ "to": [{ "email": "philip@kiely.xyz" }] }],
        "from": { "email": "philip@kiely.xyz" },
        "subject": "Who Pays Technical Writers Form Submission",
        "content": [{ "type": "text/plain", "value": event.body }]
                    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.sendgrid.com/v3/mail/send", true);

    xhr.setRequestHeader("Authorization", "Bearer " + process.env.SENDGRID_API_KEY);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            return {
                statusCode: 200,
                body: "Success"
            };
        } else {
            return {
                statusCode: 500,
                body: "Sendgrid failed."
            };
        }
    }

    xhr.send(JSON.stringify(emailData));
};