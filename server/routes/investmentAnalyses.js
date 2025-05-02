const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// Calculate investment metrics
const calculateMetrics = (data) => {
  const {
    purchasePrice,
    downPayment,
    interestRate,
    loanTerm,
    rent,
    tax,
    insurance,
    appreciationRate
  } = data;

  // Convert percentages to decimals
  const downPaymentDecimal = downPayment / 100;
  const interestRateDecimal = interestRate / 100;
  const appreciationRateDecimal = appreciationRate / 100;

  // Calculate loan amount
  const loanAmount = purchasePrice * (1 - downPaymentDecimal);

  // Calculate monthly mortgage payment
  const monthlyInterestRate = interestRateDecimal / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyMortgagePayment = loanAmount * 
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  // Calculate monthly expenses
  const monthlyTax = tax / 12;
  const monthlyInsurance = insurance / 12;
  const monthlyExpenses = monthlyMortgagePayment + monthlyTax + monthlyInsurance;

  // Calculate cash flow
  const monthlyCashFlow = rent - monthlyExpenses;

  // Calculate ROI
  const downPaymentAmount = purchasePrice * downPaymentDecimal;
  const annualCashFlow = monthlyCashFlow * 12;
  const roi = (annualCashFlow / downPaymentAmount) * 100;

  // Calculate rental yield
  const rentalYield = (rent * 12 / purchasePrice) * 100;

  // Calculate break-even point (in months)
  const breakEvenPoint = downPaymentAmount / monthlyCashFlow;

  return {
    roi: roi.toFixed(2),
    cashFlow: monthlyCashFlow.toFixed(2),
    rentalYield: rentalYield.toFixed(2),
    breakEvenPoint: breakEvenPoint.toFixed(1)
  };
};

// @route   GET api/investment-analyses
// @desc    Get all investment analyses for the current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM investment_analyses WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching investment analyses:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST api/investment-analyses
// @desc    Create a new investment analysis
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      purchasePrice,
      downPayment,
      interestRate,
      loanTerm,
      rent,
      tax,
      insurance,
      appreciationRate
    } = req.body;

    // Calculate metrics
    const downPaymentAmount = purchasePrice * (downPayment / 100);
    const loanAmount = purchasePrice - downPaymentAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly mortgage payment
    const monthlyPayment = loanAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    // Calculate monthly expenses
    const monthlyTax = tax / 12;
    const monthlyInsurance = insurance / 12;
    const totalMonthlyExpenses = monthlyPayment + monthlyTax + monthlyInsurance;

    // Calculate metrics
    const cashFlow = rent - totalMonthlyExpenses;
    const annualCashFlow = cashFlow * 12;
    const totalInvestment = downPaymentAmount;
    const roi = (annualCashFlow / totalInvestment) * 100;
    const rentalYield = (rent * 12 / purchasePrice) * 100;
    const breakEvenPoint = totalInvestment / cashFlow;

    const { rows } = await db.query(
      `INSERT INTO investment_analyses 
       (user_id, purchase_price, down_payment, interest_rate, loan_term, 
        rent, tax, insurance, appreciation_rate, roi, cash_flow, 
        rental_yield, break_even_point)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        req.user.id,
        purchasePrice,
        downPayment,
        interestRate,
        loanTerm,
        rent,
        tax,
        insurance,
        appreciationRate,
        roi,
        cashFlow,
        rentalYield,
        breakEvenPoint
      ]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('Error creating investment analysis:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific investment analysis
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM investment_analyses 
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching investment analysis:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an investment analysis
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `DELETE FROM investment_analyses 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    res.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting investment analysis:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 