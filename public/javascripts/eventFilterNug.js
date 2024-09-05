const dataForm = document.getElementById("dataForm");

dataForm.addEventListener("submit", (e) => {
    let boxes = document.getElementsByName("nugsInfo");
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].value === "" ? boxes[i].name = "" : boxes[i].name = `nugsInfo[${boxes[i].id}]`;
        i--;
    }
})