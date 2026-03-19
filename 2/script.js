document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const submitCustomBtn = document.getElementById('submitCustomBtn');
    
    let monthlySalary = 0;
    let savings = 0;
    let availableAmount = 0;

    calculateBtn.addEventListener('click', () => {
        const userName = document.getElementById('userName').value;
        monthlySalary = parseFloat(document.getElementById('monthlySalary').value);

        if (!userName || !monthlySalary) {
            alert('Please fill in all fields');
            return;
        }

        // Calculate initial budget distribution
        savings = monthlySalary * 0.2;
        availableAmount = monthlySalary - savings;

        // Update the results display
        document.getElementById('wantsAmount').textContent = `₹${(monthlySalary * 0.5).toFixed(2)}`;
        document.getElementById('needsAmount').textContent = `₹${(monthlySalary * 0.3).toFixed(2)}`;
        document.getElementById('savingsAmount').textContent = `₹${savings.toFixed(2)}`;

        // Show results section and hide other sections
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('customBudget').classList.add('hidden');
        document.getElementById('finalResults').classList.add('hidden');
    });

    yesBtn.addEventListener('click', () => {
        // Calculate and display default budget distribution
        const rent = monthlySalary * 0.2;
        const food = monthlySalary * 0.4;
        const bills = monthlySalary * 0.05;
        const travel = monthlySalary * 0.075;
        const misc = monthlySalary * 0.075;

        updateFinalResults(rent, food, bills, travel, misc);
    });

    noBtn.addEventListener('click', () => {
        // Hide results section and show custom budget form
        document.getElementById('results').classList.add('hidden');
        document.getElementById('customBudget').classList.remove('hidden');
        document.getElementById('finalResults').classList.add('hidden');
    });

    submitCustomBtn.addEventListener('click', () => {
        const rent = parseFloat(document.getElementById('rent').value) || 0;
        const food = parseFloat(document.getElementById('food').value) || 0;
        const bills = parseFloat(document.getElementById('bills').value) || 0;
        const travel = parseFloat(document.getElementById('travel').value) || 0;
        const misc = parseFloat(document.getElementById('misc').value) || 0;

        const totalExpenses = rent + food + bills + travel + misc;

        if (totalExpenses > availableAmount) {
            alert('Your budget preferences exceed your available amount! Please adjust your expenses.');
            return;
        }

        updateFinalResults(rent, food, bills, travel, misc);
    });

    function updateFinalResults(rent, food, bills, travel, misc) {
        document.getElementById('finalRent').textContent = `₹${rent.toFixed(2)}`;
        document.getElementById('finalFood').textContent = `₹${food.toFixed(2)}`;
        document.getElementById('finalBills').textContent = `₹${bills.toFixed(2)}`;
        document.getElementById('finalTravel').textContent = `₹${travel.toFixed(2)}`;
        document.getElementById('finalMisc').textContent = `₹${misc.toFixed(2)}`;
        document.getElementById('finalTotal').textContent = `₹${(rent + food + bills + travel + misc).toFixed(2)}`;

        // Hide other sections and show final results
        document.getElementById('results').classList.add('hidden');
        document.getElementById('customBudget').classList.add('hidden');
        document.getElementById('finalResults').classList.remove('hidden');
    }

    // Add input validation
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.value < 0) {
                e.target.value = 0;
            }
        });
    });
}); 