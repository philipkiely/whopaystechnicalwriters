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

    var subj = encodeURIComponent("Who Pays Technical Writers Resource Suggestion")
    var body = encodeURIComponent(JSON.stringify(formData))

    window.location.href = "mailto:philip@kiely.xyz?subject=" + subj + "&body=" + body;
}

var form = document.getElementById("new-pub-form");
form.addEventListener("submit", processForm);