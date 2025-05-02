const mongoose = require('mongoose');

const investmentAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  downPayment: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  loanTerm: {
    type: Number,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  insurance: {
    type: Number,
    required: true
  },
  appreciationRate: {
    type: Number,
    required: true
  },
  roi: {
    type: Number,
    required: true
  },
  cashFlow: {
    type: Number,
    required: true
  },
  rentalYield: {
    type: Number,
    required: true
  },
  breakEvenPoint: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InvestmentAnalysis', investmentAnalysisSchema); 