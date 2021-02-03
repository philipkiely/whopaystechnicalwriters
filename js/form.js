function errorRequiredField(id, text) {
    console.log("errorReq", id, text) // show message, highlight field, etc
    document.getElementById("form-failed").hidden = false
}

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
        errorRequiredField("company-name", "Please enter a company name.")
        return
    }
    if (link == "") {
        errorRequiredField("link", "Please enter a link to the company's \"write for us\" page.")
        return
    }
    // JSON Data
    var formData = {
        "company-name": companyName,
        "companyType": companyType,
        "link": link,
        "email": email,
        "topics": topics,
        "rates": rates,
        "notes": notes
    }
    // Send Data
    console.log(formData)
    // Clear Form
    document.getElementById("new-pub-form").reset();
    // Alert Success
    document.getElementById("form-failed").hidden = true
    document.getElementById("form-succeeded").hidden = false
}

var form = document.getElementById("new-pub-form");
form.addEventListener("submit", processForm);