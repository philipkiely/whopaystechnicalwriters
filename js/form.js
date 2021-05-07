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
    if (rates == "" || (companyType != "Publisher" && isNaN(parseInt(rates)))) {
        document.getElementById("form-failed").hidden = false
        return
    }
    // JSON Data
    var formData = {
        "name": companyName,
        "type": companyType.toLowerCase(),
        "link": link,
    }
    if (email != "") {
        formData["contact"] = email
    }
    if (topics != "") {
        formData["topics"] = topics.split(",")
    }
    if (companyType == "Publisher") {
        formData["royaltyRate"] = rates
    } else {
        var vals = rates.split("-")
        if (vals.length == 1) {
            formData["maxRate"] = parseInt(vals[0])
        } else {
            formData["minRate"] = parseInt(vals[0])
            formData["maxRate"] = parseInt(vals[1])
        }
    }
    if (notes != "") {
        formData["notes"] = notes
    }
    //Send to the netlify function
    console.log(formData)
}

var form = document.getElementById("new-pub-form");
form.addEventListener("submit", processForm);