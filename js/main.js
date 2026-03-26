// ===== Mobile Navigation =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// ===== Navbar scroll effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// ===== Calculator =====
const billsSent = document.getElementById('billsSent');
const collectionRate = document.getElementById('collectionRate');
const avgBill = document.getElementById('avgBill');

const billsSentVal = document.getElementById('billsSentVal');
const collectionRateVal = document.getElementById('collectionRateVal');
const avgBillVal = document.getElementById('avgBillVal');

const currentCollected = document.getElementById('currentCollected');
const potentialCollected = document.getElementById('potentialCollected');
const hoursRecovered = document.getElementById('hoursRecovered');
const hoursValue = document.getElementById('hoursValue');
const paperSavings = document.getElementById('paperSavings');
const badDebt = document.getElementById('badDebt');
const totalMore = document.getElementById('totalMore');

function formatCurrency(num) {
  return '$' + Math.round(num).toLocaleString('en-US');
}

function updateCalculator() {
  const bills = parseInt(billsSent.value);
  const rate = parseInt(collectionRate.value) / 100;
  const avg = parseInt(avgBill.value);

  // Display slider values
  billsSentVal.textContent = bills.toLocaleString('en-US');
  collectionRateVal.textContent = collectionRate.value;
  avgBillVal.textContent = avg.toLocaleString('en-US');

  // Current performance
  const totalBillable = bills * avg;
  const currentCol = totalBillable * rate;

  // PatientPay assumes 50% improvement on uncollected (conservative)
  const uncollected = totalBillable - currentCol;
  const ppAdditional = uncollected * 0.5;
  const ppCollected = currentCol + ppAdditional;

  // Staff hours: ~3.4 min saved per bill processed digitally
  const hours = Math.round((bills * 3.4) / 60);

  // Value of hours at ~$20/hr
  const hoursVal = hours * 19.84;

  // Paper savings: $0.475 per bill
  const paper = bills * 0.475;

  // Bad debt reduction: ~5% of uncollected balance
  const badDebtVal = uncollected * 0.0495;

  // Update display
  currentCollected.textContent = formatCurrency(currentCol);
  potentialCollected.textContent = formatCurrency(ppCollected);
  hoursRecovered.textContent = hours;
  hoursValue.textContent = formatCurrency(hoursVal);
  paperSavings.textContent = formatCurrency(paper);
  badDebt.textContent = formatCurrency(badDebtVal);
  totalMore.textContent = formatCurrency(ppAdditional);
}

billsSent.addEventListener('input', updateCalculator);
collectionRate.addEventListener('input', updateCalculator);
avgBill.addEventListener('input', updateCalculator);

// Initialize
updateCalculator();

// ===== Scroll animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in animation to cards and sections
document.querySelectorAll('.feature-card, .benefit-card, .step, .calc-metric, .emr-logo').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// CSS class for visible elements
const style = document.createElement('style');
style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// Stagger animations for grid items
document.querySelectorAll('.features-grid, .benefits-grid, .steps-container, .emr-logos').forEach(grid => {
  const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.08}s`;
          setTimeout(() => child.classList.add('visible'), 10);
        });
        gridObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  gridObserver.observe(grid);
});
