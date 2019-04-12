//display files
var selDiv = "";

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    document.querySelector('#files').addEventListener('change', handleFileSelect, false);
    selDiv = document.querySelector("#selectedFiles");
}

function handleFileSelect(e) {
    if (!e.target.files) return;
    selDiv.innerHTML = "";
    var files = e.target.files;
    selDiv.innerHTML += " " + files.length + " files selected: "
    for (var i = 0; i < files.length; i++) {
        var f = files[i];
        selDiv.innerHTML += '"' + f.name + '", ';
    }
}