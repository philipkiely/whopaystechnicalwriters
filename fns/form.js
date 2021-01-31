//receive data in post request
//format nicely
//send an email no CLI, just an env var and a https request to sendgrid api.

/*
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header "Authorization: Bearer $SENDGRID_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{"personalizations": [{"to": [{"email": "philip@kiely.xyz"}]}],"from": {"email": "philip@kiely.xyz"},"subject": "Sending with SendGrid is Fun","content": [{"type": "text/plain", "value": "and easy to do anywhere, even with cURL"}]}'


*/