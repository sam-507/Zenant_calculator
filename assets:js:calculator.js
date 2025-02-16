const zenanCalculator = {
  init: function() {
    this.monthlyRentInput = document.getElementById('monthlyRent');
    this.securityMonthsInput = document.getElementById('securityMonths');
    this.interestRateInput = document.getElementById('interestRate');
    this.loanTenureInput = document.getElementById('loanTenure');
    this.calculateBtn = document.getElementById('calculateBtn');
    
    this.requiredDepositElement = document.getElementById('requiredDeposit');
    this.loanAmountElement = document.getElementById('loanAmount');
    this.monthlyEmiElement = document.getElementById('monthlyEmi');
    this.totalInterestElement = document.getElementById('totalInterest');
    this.totalAmountElement = document.getElementById('totalAmount');
    this.amortizationTable = document.getElementById('amortizationTable').getElementsByTagName('tbody')[0];
    
    this.chartContext = document.getElementById('paymentChart').getContext('2d');
    this.paymentChart = null;
    
    this.calculateBtn.addEventListener('click', () => this.calculateEMI());
    this.calculateEMI();
  },
  
  calculateEMI: function() {
    const monthlyRent = parseFloat(this.monthlyRentInput.value);
    const securityMonths = parseFloat(this.securityMonthsInput.value);
    const annualInterestRate = parseFloat(this.interestRateInput.value);
    const loanTenureMonths = parseInt(this.loanTenureInput.value);
    
    const requiredDeposit = monthlyRent * securityMonths;
    const loanAmount = requiredDeposit + monthlyRent;
    const monthlyInterestRate = (annualInterestRate / 12) / 100;
    
    const emi = loanAmount * monthlyInterestRate * 
               Math.pow(1 + monthlyInterestRate, loanTenureMonths) / 
               (Math.pow(1 + monthlyInterestRate, loanTenureMonths) - 1);
    
    const totalAmount = emi * loanTenureMonths;
    const totalInterest = totalAmount - loanAmount;
    
    this.updateResults(requiredDeposit, loanAmount, emi, totalInterest, totalAmount);
    this.generateAmortizationSchedule(loanAmount, monthlyInterestRate, emi, loanTenureMonths);
    this.updateChart(loanAmount, totalInterest);
  },
  
  updateResults: function(requiredDeposit, loanAmount, emi, totalInterest, totalAmount) {
    this.requiredDepositElement.textContent = `₹${requiredDeposit.toLocaleString('en-IN')}`;
    this.loanAmountElement.textContent = `₹${loanAmount.toLocaleString('en-IN')}`;
    this.monthlyEmiElement.textContent = `₹${emi.toFixed(2).toLocaleString('en-IN')}`;
    this.totalInterestElement.textContent = `₹${totalInterest.toFixed(2).toLocaleString('en-IN')}`;
    this.totalAmountElement.textContent = `₹${totalAmount.toFixed(2).toLocaleString('en-IN')}`;
  },
  
  generateAmortizationSchedule: function(principal, monthlyInterestRate, emi, tenure) {
    this.amortizationTable.innerHTML = '';
    let balance = principal;
    
    for (let month = 1; month <= tenure; month++) {
      const interestPayment = balance * monthlyInterestRate;
      const principalPayment = emi - interestPayment;
      balance = Math.max(0, balance - principalPayment);
      
      const row = this.amortizationTable.insertRow();
      row.insertCell(0).textContent = month;
      row.insertCell(1).textContent = `₹${emi.toFixed(2).toLocaleString('en-IN')}`;
      row.insertCell(2).textContent = `₹${principalPayment.toFixed(2).toLocaleString('en-IN')}`;
      row.insertCell(3).textContent = `₹${interestPayment.toFixed(2).toLocaleString('en-IN')}`;
      row.insertCell(4).textContent = `₹${balance.toFixed(2).toLocaleString('en-IN')}`;
    }
  },
  
  updateChart: function(principal, totalInterest) {
    if (this.paymentChart) {
      this.paymentChart.destroy();
    }
    
    this.paymentChart = new Chart(this.chartContext, {
      type: 'pie',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [{
          data: [principal, totalInterest],
          backgroundColor: ['#4a90e2', '#e2a74a']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Loan Payment Breakdown'
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => zenanCalculator.init());
