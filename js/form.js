function processForm(event) {
    event.preventDefault();
    // Gather Data
    var companyName = document.getElementById("company-name").value;
    var companyType = document.getElementById("company-type").value;
    var link = document.getElementById("link").value;
    var email = document.getElementById("email").value;
    var topics = document.getElementById("topics").value;
    var rates = document.getElementById("rates").value;
    var notes = document.getElementById("notes").value;
    // Validate Required Fields (companyType is never empty)
    if (companyName == "") {
        document.getElementById("form-failed").hidden = false
        return
    }
    if (link == "") {
        document.getElementById("form-failed").hidden = false
        return
    }
    // JSON Data
    var formData = {
        "companyName": companyName,
        "companyType": companyType,
        "link": link,
        "email": email,
        "topics": topics,
        "rates": rates,
        "notes": notes
    }
    // Send Data
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/.netlify/functions/form", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            // Clear Form
            document.getElementById("new-pub-form").reset();
            // Alert Success
            document.getElementById("form-failed").hidden = true
            document.getElementById("form-succeeded").hidden = false
        } else {
            document.getElementById("form-failed").hidden = false
        }
    }
    xhr.send(JSON.stringify(formData));
}

var form = document.getElementById("new-pub-form");
form.addEventListener("submit", processForm);