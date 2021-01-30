function setYear() {
    document.getElementById("year").innerHTML = (new Date()).getFullYear();
}

window.onload = setYear();