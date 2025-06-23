let form = document.getElementById("expense-form")  // for submit handler
let amountInput = document.getElementById("amount")
let descriptionInput = document.getElementById("description")
let categorySelect = document.getElementById("category")

let total = document.getElementById("total")

let filterCategorySelect = document.getElementById("filter-category")
let sortBySelect = document.getElementById("sort-by")
let last5Toggle = document.getElementById("last-5-toggle")

let expenseList = document.getElementById("expense-list")
let emptyState = document.getElementById("empty")

let expenses = JSON.parse(localStorage.getItem('expenses')) || []

function updateLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses))
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateLocalStorage();
  renderExpenses();
}

function renderExpenses() {
    expenseList.innerHTML = ''

    let filteredExpenses = [...expenses]

    if (last5Toggle.checked) {
        filterCategorySelect.value = ''
        sortBySelect.value = ''
        filteredExpenses = filteredExpenses.slice(-5)
    }
    
    const selectedCategory = filterCategorySelect.value
    const sortBy = sortBySelect.value

    if(selectedCategory) {
        filteredExpenses = filteredExpenses.filter(expense => expense.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if(sortBy === 'amount-asc')
        filteredExpenses.sort((a, b) => a.amount - b.amount)
    else if(sortBy === 'amount-desc')
        filteredExpenses.sort((a, b) => b.amount - a.amount)
    else if(sortBy === 'date-asc')
        filteredExpenses.sort((a, b) => {
            return a.timestamp - b.timestamp
        })
    else if(sortBy === 'date-desc')
        filteredExpenses.sort((a, b) => b.timestamp - a.timestamp)

    


    if(filteredExpenses.length === 0){
    emptyState.style.display = 'block'
        total.textContent = 'Total: 0 pkr'
        return
    }

    emptyState.style.display = 'none'
    let t = 0

    filteredExpenses.reverse()

    filteredExpenses.forEach((expense, index) => {
        const li = document.createElement('li')
        
        li.className = 'expense-item'
        li.setAttribute('data-category', expense.category.toLowerCase())

        t += expense.amount

        li.innerHTML = `
            <div class="expense-details">
                <div class="expense-amount">${expense.amount} pkr</div>
                <div class="expense-description">${expense.description}</div>
                <div class="expense-meta">
                    <span class="expense-category">${expense.category}</span>
                    <span class="expense-timestamp">${new Date(expense.timestamp).toDateString()}</span>
                </div>
            </div>
            <button onclick= "deleteExpense(${index})"class="delete-btn" data-id="${expense.id}">🗑️</button>
        `

        expenseList.appendChild(li)
    })

    total.innerHTML = `Total: ${t} pkr`
}

form.addEventListener("submit", (e) => {
    e.preventDefault()
    
    let amount = parseFloat(amountInput.value)
    let description = descriptionInput.value.trim()
    let category = categorySelect.value

    if(isNaN(amount) || amount <= 0) {
        alert("Enter the valid positive Amount")
        return
    }

    const newExpense = {
        amount,
        description,
        category,
        timestamp: Date.now()
    }
    
    expenses.push(newExpense)
    updateLocalStorage()
    renderExpenses()

    form.reset()

})

filterCategorySelect.addEventListener("change", renderExpenses)
sortBySelect.addEventListener("change", renderExpenses)
last5Toggle.addEventListener("change", renderExpenses)

renderExpenses()