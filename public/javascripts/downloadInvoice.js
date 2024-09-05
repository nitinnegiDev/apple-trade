const toggleHideElement = function (el) {
    if (!el.classList.contains("display-none")) {
        el.classList.add("display-none");
    } else {
        el.classList.remove("display-none");
    }
}

const toggleHideUnwantedElements = function () {
    const navbar = document.getElementById("navbar");
    toggleHideElement(navbar);
    const footer = document.getElementById("footer");
    toggleHideElement(footer);

    const buttons = document.querySelectorAll("button");
    const tableInputs = document.querySelectorAll("#boxPrice, #expense");

    buttons.forEach((button) => {
        toggleHideElement(button);
    });

    tableInputs.forEach((input) => {
        console.dir(input);
        const bTag = input.nextElementSibling;
        if (!input.classList.contains("display-none")) {
            bTag.innerText = parseInt(input.value) || 0;
        } else {
            input.value = parseInt(bTag.innerText) || 0;
        }
        toggleHideElement(bTag);
        toggleHideElement(input);
    })
}

const downloadButton = document.getElementById("download");
downloadButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleHideUnwantedElements();
    window.print();
    toggleHideUnwantedElements();
})