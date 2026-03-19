from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/calculate-budget', methods=['POST'])
def calculate_budget():
    data = request.get_json()
    
    # Extract data from request
    monthly_salary = float(data.get('monthlySalary', 0))
    savings = monthly_salary * 0.2
    
    # Calculate default budget
    default_budget = {
        'wants': monthly_salary * 0.5,
        'needs': monthly_salary * 0.3,
        'savings': savings
    }
    
    return jsonify({
        'defaultBudget': default_budget,
        'availableAmount': monthly_salary - savings
    })

@app.route('/calculate-custom-budget', methods=['POST'])
def calculate_custom_budget():
    data = request.get_json()
    
    # Extract data from request
    monthly_salary = float(data.get('monthlySalary', 0))
    savings = monthly_salary * 0.2
    available_amount = monthly_salary - savings
    
    # Extract custom budget values
    custom_budget = {
        'rent': float(data.get('rent', 0)),
        'food': float(data.get('food', 0)),
        'bills': float(data.get('bills', 0)),
        'travel': float(data.get('travel', 0)),
        'miscellaneous': float(data.get('miscellaneous', 0))
    }
    
    # Calculate total expenses
    total_expenses = sum(custom_budget.values())
    
    # Check if expenses exceed available amount
    if total_expenses > available_amount:
        return jsonify({
            'error': 'Total expenses exceed available amount',
            'totalExpenses': total_expenses,
            'availableAmount': available_amount
        }), 400
    
    # Add savings to the response
    custom_budget['savings'] = savings
    
    return jsonify({
        'budget': custom_budget,
        'totalExpenses': total_expenses,
        'availableAmount': available_amount
    })

if __name__ == '__main__':
    app.run(debug=True) 