//navbar active class
$(function () {
    var path = window.location.href;
    $('#navB .collapse .nav-link').each(function () {
        // if the current path is like this link, make it active
        if (this.href === path) {
            $(this).addClass('active');
        }
    })
});

// disable right click
document.addEventListener('contextmenu', event => event.preventDefault());

//scroll-top icon
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#scroll-top').fadeIn();
        } else {
            $('#scroll-top').fadeOut();
        }
    });
    $('.scroll-top').click(function () {
        $("html, body").animate({
            scrollTop: 0
        }, 100);
        return false;
    });
});

//preloader
$(window).load(function () {
    $('#cover').fadeOut();
});
$(window).on('load', function () {
    alert("Window Loaded");
});
