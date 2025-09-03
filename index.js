document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        alert("Nav bar is not enabled for this demo. I just left it here to make the page look nicer.");
    });
});

