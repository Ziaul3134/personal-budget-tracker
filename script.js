//Personal budget Tracker App with DOM & addEventListener
let userData = JSON.parse(localStorage.getItem("budgetData")) || [];
function saveData(){
    localStorage.setItem("budgetData", JSON.stringify(userData));
}


//can be used as a global variables in future
const button = document.querySelector("#button");
const calBtn = document.querySelector("#calBtn button");
const inputPage = document.querySelector("#inputPage");
const outputPage = document.querySelector("#outputPage");
const result = document.querySelector("#result");
const focusName = document.querySelector("#name");
const deleteDataBtn = document.querySelector("#deleteBtn");

//event listeners outside function
button.addEventListener("click", getExpense);
calBtn.addEventListener("click", calculation);
deleteDataBtn.addEventListener("click", deleteOldData);

window.onload = function(){
    focusName.focus();
}

//get numOfExpense, vissible the calBtn and expense input field
function getExpense(){
    const expenseNumber = parseInt(document.querySelector("#expenseNumber").value);
    const inputExpenseDiv = document.querySelector("#inputExpenseDiv");
    inputExpenseDiv.innerHTML = "";
    

    //validation of expense input
    if(isNaN(expenseNumber) || expenseNumber <= 0){
        alert("Enter a valid Number of Expense Please");
        return;
    }else{
        calBtn.parentElement.style.display = "inline-block";
        calBtn.disabled = true;
    }

    //genarate expense input field
    for(let i = 0; i < expenseNumber; i++){
        const expenseLabel = document.createElement("label");
        expenseLabel.classList.add("expenseLabelCSS");
        expenseLabel.textContent = `Enter expense: ${i + 1}:`;
        const inputExpense = document.createElement("input");
        inputExpense.type = "number";
        inputExpense.classList.add("expenseInputCSS")

        expenseLabel.appendChild(inputExpense);
        inputExpenseDiv.appendChild(expenseLabel);
    }

    const expenseInput = document.querySelectorAll(".expenseInputCSS");
    //add event listener to every input
    expenseInput.forEach(function(input){
        input.addEventListener("input", checkAllExpenseField);
    });

    //add Enter button
        expenseInput.forEach(function(input, index){
            input.addEventListener("keypress", function(event){
                if(event.key === "Enter"){
                    event.preventDefault();
                    if(index < expenseInput.length - 1){
                        expenseInput[index + 1].focus();
                    } else{calBtn.focus();}
                }
            })
        });
        if(expenseInput.length > 0){
            expenseInput[0].focus();
        }
}

//check All Expense Field and enable button
function checkAllExpenseField(){
    const expenseInput = document.querySelectorAll(".expenseInputCSS");
    let allFields = true;
    expenseInput.forEach(function(input){
        if(input.value.trim() === "" || isNaN(input.value) || Number(input.value <= 0)){
            allFields = false;
        }
    });
    calBtn.disabled = !allFields;
}

//active calBtn and processs all data
function calculation(){
    let expenseInput = document.querySelectorAll(".expenseInputCSS");
    let dataObject = {
        Name: document.querySelector("#name").value,
        Income: parseFloat(document.querySelector("#income").value),
        numOfExpense: expenseInput.length,
        Expenses: [],
        TotalExpense: 0,
        Tax: 0,
        NetIncome: 0,
        HighestCost: 0,
        LowestCost: 0,
        RemainingBalance: 0,
        Savings: 0,
        FinanceStatus: ""
    }
    //validation
    if(!dataObject.Name || isNaN(dataObject.Income) || dataObject.Income <= 0){
        alert("Fill up all input valid please");
        return;
    }
    
    let isValid = true;
    expenseInput.forEach(function(inputs){
        if(isNaN(inputs.value) || inputs.value <= 0){
            isValid = false;
            return;
        }
        dataObject.Expenses.push(Number(inputs.value));
    });
//validation expense cost
    if(!isValid){
        alert("Every expense must be greater than 0");
        return;
    }
    //call calculation function and pass their arguments
    dataObject.TotalExpense = totalExpenseCalculate(dataObject.Expenses);
    dataObject.Tax = taxCalculate(dataObject.Income, 0.10);
    dataObject.NetIncome = NetIncomeCalculate(dataObject.Income, dataObject.Tax);
    dataObject.HighestCost = HighestCostCalculate(dataObject.Expenses);
    dataObject.LowestCost = lowestCostCalculate(dataObject.Expenses);
    dataObject.RemainingBalance = RemaningBalanceCalculate(dataObject.NetIncome, dataObject.TotalExpense);
    dataObject.Savings = savingsCalculate(dataObject.RemainingBalance, 0.5);
    dataObject.FinanceStatus = financialStatus(dataObject.Savings);

    //call functions
    displayResult(dataObject);
    createData(dataObject);
}

//total expense calculation
function totalExpenseCalculate(expenses){
    let total = 0;
    for(let i =0; i < expenses.length; i++){
        total += expenses[i];
    }
    return total;
}

//tax calculate
function taxCalculate(income, taxRate){
    return income * taxRate;
}

//net income calculate
function NetIncomeCalculate(income, tax){
    return income - tax;
}

//highest cost
function HighestCostCalculate(expenses){
    let highest = expenses[0];
    for(let i = 1; i < expenses.length; i++){
        if(expenses[i] > highest){
            highest = expenses[i];
        }
    }
    return highest;
}

//lowest cost
function lowestCostCalculate(expenses){
    let lowest = expenses[0];
    for(let i = 1; i < expenses.length; i++){
        if(lowest > expenses[i]){
            lowest = expenses[i];
        }
    }
    return lowest;
}

//remaining balance
function RemaningBalanceCalculate(netIncome, totalExpense){
    return netIncome - totalExpense;
}

//savings
function savingsCalculate(remaningBalance, savingRate){
    return remaningBalance * savingRate;
}

//financialStatus calculation
function financialStatus(savings){
    if(savings < 500){
        return "You are saving low";
    } else{
        return "You are saving good";
    }
}

//display result function
function displayResult(dataObject){
    //their variables are declared above
    inputPage.style.display = "none";
    outputPage.style.display = "block";
    
    let name = document.createElement("p");
    name.textContent = `Name: ${dataObject.Name}`;
    let income = document.createElement("p");
    income.textContent = `Monthly Income: ${dataObject.Income}`;
    let tax = document.createElement("p");
    tax.textContent = `TAX: ${dataObject.Tax}`;
    let NetIncome = document.createElement("p");
    NetIncome.textContent = `Net Income: ${dataObject.NetIncome}`;
    let numOfExpense = document.createElement("p");
    numOfExpense.textContent = `Number of Expense: ${dataObject.numOfExpense}`;
    let totalExpense = document.createElement("p");
    totalExpense.textContent = `Total Expense: ${dataObject.TotalExpense}`;
    let HighestCost = document.createElement("p");
    HighestCost.textContent = `Highest Cost: ${dataObject.HighestCost}`;
    let LowestCost = document.createElement("p");
    LowestCost.textContent = `Lowest Cost: ${dataObject.LowestCost}`;
    let remainingBalance = document.createElement("p");
    remainingBalance.textContent = `Remaining Balance: ${dataObject.RemainingBalance}`;
    let savings = document.createElement("p");
    savings.textContent = `Your Savings: ${dataObject.Savings}`;
    let status = document.createElement("p");
    status.classList.add("statusHighlight");
    status.textContent = `Financial Status: ${dataObject.FinanceStatus}`;

    //clear the reuslt then append new data
    result.innerHTML = "";
    result.appendChild(name);
    result.appendChild(income);
    result.appendChild(tax);
    result.appendChild(NetIncome);
    result.appendChild(numOfExpense);
    result.appendChild(totalExpense);
    result.appendChild(HighestCost);
    result.appendChild(LowestCost);
    result.appendChild(remainingBalance);
    result.appendChild(savings);
    result.appendChild(status);
}

//intarect with Enter button
document.querySelector("#name").addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        document.querySelector("#income").focus();
    }
});
document.querySelector("#income").addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        document.querySelector("#expenseNumber").focus();
    }
});
document.querySelector("#expenseNumber").addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        getExpense();
    }
});

//back to home function
function backHome(){
    location.reload();
}

//user data save to localstorage
function createData(dataObject){
userData.push(dataObject);
saveData();
}

function deleteOldData(){
    const confirmDelete = confirm("All previous data will be permenantly deleted. Are you Confirm?");
    if(confirmDelete){
        localStorage.removeItem("budgetData");
    }
} 