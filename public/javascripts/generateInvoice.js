
const calcTotalBoxes = function (boxesCount) {
    const totalBoxes = document.getElementById("totalBoxes");
    let totBoxCount = 0;
    for (let boxCount of boxesCount) {
        totBoxCount += parseInt(boxCount.textContent);
    }
    totalBoxes.textContent = `${totBoxCount} boxes`;
}

const extractNum = function (text) {
    const num = parseInt(text.split(" ")[0]);
    return num;
}

const calcTotalPrice = function () {
    const totalPrice = document.getElementById("totalPrice");

    let total = 0;
    const boxPrices = document.querySelectorAll("#boxPrice");
    boxPrices.forEach((boxPrice) => {
        const boxCount = document.getElementsByClassName(`${boxPrice.name}`)[0];
        const noOfBoxes = extractNum(boxCount.innerText);
        if (parseInt(boxPrice.value)) {
            total += parseInt(boxPrice.value) * noOfBoxes;
        }
    })

    totalPrice.innerText = `${total} rs`;
    calcNetPayableAmount();
}

const populateTotalExpense = function (expenseEl) {
    const totalBoxesEl = document.getElementById("totalBoxes");
    const totalBoxes = extractNum(totalBoxesEl.innerText);
    const expense = extractNum(expenseEl.value);

    if (!expense) {
        expenseEl.parentElement.nextElementSibling.innerText = "-";
    } else {
        if (expenseEl.className.includes("singleExpense")) {
            expenseEl.parentElement.nextElementSibling.innerText = `${expense} rs`;
        } else {
            expenseEl.parentElement.nextElementSibling.innerText = `${expense * totalBoxes} rs`;
        }
    }
}

const populateTotalPayableInput = function (value) {
    const totalPayableInput = document.getElementById("totalPayableInput");
    totalPayableInput.value = parseInt(value);
}

const calcNetPayableAmount = function () {
    const totalPayable = document.getElementById("totalPayable");
    const totalBoxesEl = document.getElementById("totalBoxes");
    const totalBoxes = extractNum(totalBoxesEl.innerText);

    let totalExpenses = 0;
    const expenses = document.querySelectorAll("#expense");
    expenses.forEach((expense) => {
        if (parseInt(expense.value)) {
            if (expense.className.includes("singleExpense")) {
                totalExpenses += parseInt(expense.value);
            } else {
                totalExpenses += parseInt(expense.value) * totalBoxes;
            }
        }
    })

    const totalPrice = extractNum(document.getElementById("totalPrice").innerText) || 0;
    const netSale = totalPrice - totalExpenses;
    totalPayable.innerText = `${netSale} rs`;
    populateTotalPayableInput(netSale);
}



const boxesCount = document.querySelectorAll("#boxCount");
calcTotalBoxes(boxesCount);

const boxPrices = document.querySelectorAll("#boxPrice");

boxPrices.forEach((boxPrice) => {
    boxPrice.addEventListener("change", (e) => {
        calcTotalPrice();
    })
})

const expenses = document.querySelectorAll("#expense");

expenses.forEach((expense) => {
    expense.addEventListener("change", (e) => {
        populateTotalExpense(expense);
        calcNetPayableAmount();
    })
})