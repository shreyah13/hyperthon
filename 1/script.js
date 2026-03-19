document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const acceptDefaultBtn = document.getElementById('acceptDefault');
    const customizeBudgetBtn = document.getElementById('customizeBudget');
    const submitCustomBudgetBtn = document.getElementById('submitCustomBudget');

    const defaultBudgetSection = document.getElementById('defaultBudget');
    const customBudgetSection = document.getElementById('customBudget');
    const resultSection = document.getElementById('result');

    let userName = '';
    let monthlySalary = 0;
    let savings = 0;

    calculateBtn.addEventListener('click', async () => {
        userName = document.getElementById('userName').value;
        monthlySalary = parseFloat(document.getElementById('monthlySalary').value);

        if (!userName || !monthlySalary) {
            alert('Please enter both your name and monthly salary');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/calculate-budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ monthlySalary })
            });

            const data = await response.json();
            
            savings = data.defaultBudget.savings;
            
            // Update default budget section
            document.getElementById('wantsAmount').textContent = formatCurrency(data.defaultBudget.wants);
            document.getElementById('needsAmount').textContent = formatCurrency(data.defaultBudget.needs);
            document.getElementById('savingsAmount').textContent = formatCurrency(savings);

            defaultBudgetSection.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while calculating the budget');
        }
    });

    acceptDefaultBtn.addEventListener('click', () => {
        defaultBudgetSection.classList.add('hidden');
        showDefaultResult();
    });

    customizeBudgetBtn.addEventListener('click', () => {
        defaultBudgetSection.classList.add('hidden');
        customBudgetSection.classList.remove('hidden');
        
        document.getElementById('availableAmount').textContent = formatCurrency(monthlySalary - savings);
        document.getElementById('customSavings').textContent = formatCurrency(savings);
    });

    submitCustomBudgetBtn.addEventListener('click', async () => {
        const customBudget = {
            monthlySalary,
            rent: parseFloat(document.getElementById('rent').value) || 0,
            food: parseFloat(document.getElementById('food').value) || 0,
            bills: parseFloat(document.getElementById('bills').value) || 0,
            travel: parseFloat(document.getElementById('travel').value) || 0,
            miscellaneous: parseFloat(document.getElementById('miscellaneous').value) || 0
        };

        try {
            const response = await fetch('http://localhost:5000/calculate-custom-budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customBudget)
            });

            const data = await response.json();

            if (response.status === 400) {
                alert(`Your budget preferences exceed your available amount by ${formatCurrency(data.totalExpenses - data.availableAmount)}! Please adjust your expenses.`);
                return;
            }

            customBudgetSection.classList.add('hidden');
            showCustomResult(data.budget);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while calculating the custom budget');
        }
    });

    function showDefaultResult() {
        resultSection.classList.remove('hidden');
        const finalBudget = document.getElementById('finalBudget');
        finalBudget.innerHTML = `
            <p>Hello ${userName}!</p>
            <p>Your monthly budget distribution:</p>
            <p>Rent: ${formatCurrency(monthlySalary * 0.2)}</p>
            <p>Food: ${formatCurrency(monthlySalary * 0.4)}</p>
            <p>Bills: ${formatCurrency(monthlySalary * 0.05)}</p>
            <p>Travel: ${formatCurrency(monthlySalary * 0.075)}</p>
            <p>Miscellaneous: ${formatCurrency(monthlySalary * 0.075)}</p>
            <p>Savings: ${formatCurrency(savings)}</p>
        `;
    }

    function showCustomResult(budget) {
        resultSection.classList.remove('hidden');
        const finalBudget = document.getElementById('finalBudget');
        finalBudget.innerHTML = `
            <p>Hello ${userName}!</p>
            <p>Your monthly budget distribution:</p>
            <p>Rent: ${formatCurrency(budget.rent)}</p>
            <p>Food: ${formatCurrency(budget.food)}</p>
            <p>Bills: ${formatCurrency(budget.bills)}</p>
            <p>Travel: ${formatCurrency(budget.travel)}</p>
            <p>Miscellaneous: ${formatCurrency(budget.miscellaneous)}</p>
            <p>Savings: ${formatCurrency(budget.savings)}</p>
        `;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}); 