const form = document.getElementById("regForm");
form.addEventListener("submit", (e) => {
    const password = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirmPass").value;
    if (password !== confirmPass) {
        e.preventDefault();
        // reload the same page
        location.reload(true);
        alert("password unmatched");
    }
})