$(document).ready(function() {
  // Toggle the navbar burger menu (if present).
  $(".navbar-burger").click(function() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
});
