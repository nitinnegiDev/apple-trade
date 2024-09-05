const owner = document.getElementById("owner");
owner.addEventListener("input", (e) => {
    const h1 = document.getElementsByTagName("h1")[0];
    h1.innerText = owner.value.toUpperCase();
})