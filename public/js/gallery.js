var images = document.querySelectorAll(".im");
var myModal = document.querySelector(".modal");
var modalContent = document.querySelector("#modalContent");
var navbar = document.querySelector("#navB");
var slideIndex;
var max = images.length;

// add event listeners
for (var i = 0; i < max; i++) {
    images[i].addEventListener("click", function () {
        if (modalContent.style.maxHeight == "100%") {
            modalContent.style.maxHeight = "100vh";
            modalContent.style.maxWidth = "80vw";
            modalContent.style.cursor = "zoom-in";
        }
        myModal.style.display = "block";
        myModal.dataset.no = this.dataset.no;
        modalContent.src = this.src;
        navbar.style.display = "none";
    });
}

// Close the Modal
function closeModal() {
    myModal.style.display = "none";
    navbar.style.display = "flex";
}

// zoom in
function zoom() {
    if (modalContent.style.maxHeight == "100%") {
        modalContent.style.maxHeight = "100vh";
        modalContent.style.maxWidth = "80vw";
        modalContent.style.cursor = "zoom-in";
    }
    else {
        modalContent.style.maxHeight = "100%";
        modalContent.style.maxWidth = "95vw";
        modalContent.style.cursor = "zoom-out";
    }

}

// change slide
function plusSlides(n) {
    slideIndex = parseInt(myModal.dataset.no) + n;
    if (modalContent.style.maxHeight == "100%") {
        modalContent.style.maxHeight = "100vh";
        modalContent.style.maxWidth = "80vw";
        modalContent.style.cursor = "zoom-in";
    }
    if (slideIndex < 0) {
        slideIndex = max - 1;
    }
    if (slideIndex > max - 1) {
        slideIndex = 0;
    }
    modalContent.src = $("[data-no=" + slideIndex + "]").attr("src");
    myModal.dataset.no = slideIndex;
    // showSlides(slideIndex += n);
}

// check keydown
document.onkeydown = checkKey;

function checkKey(e) {

    if (myModal.style.display == "block") {
        e = e || window.event;
        if (e.keyCode == '107') {
            // + arrow
            zoom();
        }
        if (e.keyCode == '109') {
            // - arrow
            zoom();
        }
        else if (e.keyCode == '37') {
            // left arrow
            plusSlides(-1);
        }
        else if (e.keyCode == '39') {
            // right arrow
            plusSlides(1);
        }
        else if (e.keyCode == '27') {
            // esc key
            closeModal();
        }
    }
}