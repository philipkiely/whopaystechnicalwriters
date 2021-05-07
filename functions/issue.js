const { request } = require("@octokit/request");
const { GITHUB_TOKEN } = process.env;

exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    var data = JSON.parse(event.body);
    const res = await request('POST /repos/{owner}/{repo}/issues', {
        headers: {
            authorization: 'token ' + GITHUB_TOKEN,
        },
        owner: 'philipkiely',
        repo: 'whopaystechnicalwriters',
        title: 'Proposed Addition: ' + data.name,
        body: JSON.stringify(data),
        assignee: 'philipkiely'
    });
    if (res.status == 201) {
        return {
            statusCode: 200,
            body: JSON.stringify({ url: res.data.url })
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Issue Creation Failed' })
        };
    }   
}