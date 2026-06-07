// --- GLOBAL STATE ---
let currentWizardStep = 1;
let currentJourneyStep = 0;
let activeTab = 'sip';

// --- CHART INSTANCES ---
let heroChartInstance = null;
let journeyChartInstance = null;
let sipChartInstance = null;
let retirementChartInstance = null;
let goalChartInstance = null;
let taxChartInstance = null;
let emergencyChartInstance = null;

// --- DOM ELEMENTS ---
const body = document.body;
const themeSwitch = document.getElementById('themeSwitch');
const scrollProgress = document.getElementById('scrollProgress');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollTracker();
    initMobileNav();
    initTrustCounters();
    initHeroDashboard();
    initJourneyChart();
    initGoalPlanner();
    initCalculators();
    initStories();
    initInsights();
    initWizard();
});

// --- THEME STATE MANAGER (DARK / LIGHT) ---
function initTheme() {
    // Check local preferences
    const savedTheme = localStorage.getItem('nwy-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
    }
    
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const mode = body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('nwy-theme', mode);
            
            // Redraw charts to update text colors in dark/light mode
            redrawAllCharts();
        });
    }
}

function redrawAllCharts() {
    const textCol = body.classList.contains('dark-mode') ? '#94A3B8' : '#475569';
    const gridCol = body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)';

    const updateScales = (chart) => {
        if (!chart) return;
        if (chart.options.scales) {
            if (chart.options.scales.x) {
                chart.options.scales.x.ticks.color = textCol;
                chart.options.scales.x.grid.color = gridCol;
            }
            if (chart.options.scales.y) {
                chart.options.scales.y.ticks.color = textCol;
                chart.options.scales.y.grid.color = gridCol;
            }
        }
        if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = textCol;
        }
        chart.update();
    };

    updateScales(heroChartInstance);
    updateScales(journeyChartInstance);
    updateScales(sipChartInstance);
    updateScales(retirementChartInstance);
    updateScales(goalChartInstance);
    updateScales(taxChartInstance);
    updateScales(emergencyChartInstance);
}

// --- SCROLL DEPTH PROGRESS INDICATOR ---
function initScrollTracker() {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
    });
}

// --- MOBILE NAVIGATION ---
function initMobileNav() {
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });
        
        // Collapse mobile links when clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(l => {
            l.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Click outside closes the nav drawer
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== navToggle) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// --- DYNAMIC SCROLL COUNTERS ---
function initTrustCounters() {
    const counters = document.querySelectorAll('.trust-num');
    
    const countToTarget = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        let count = 0;
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // ~60fps
        
        const update = () => {
            count += step;
            if (count < target) {
                el.innerText = Math.floor(count).toLocaleString('en-IN') + (target === 98 ? '%' : '+');
                requestAnimationFrame(update);
            } else {
                el.innerText = target.toLocaleString('en-IN') + (target === 98 ? '%' : '+');
            }
        };
        update();
    };

    const trustSection = document.querySelector('.trust-sec');
    if (trustSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(c => countToTarget(c));
                    observer.unobserve(trustSection);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(trustSection);
    }
}

// --- HERO WEALTH DASHBOARD ---
function initHeroDashboard() {
    // Number counters animate
    animateNumber('heroNetWorth', 15000000, '₹', true);
    animateNumber('heroTaxSaved', 345200, '₹', true);

    // Render Growth Chart
    const ctx = document.getElementById('heroChart');
    if (!ctx) return;

    const fillGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 180);
    fillGradient.addColorStop(0, 'rgba(21, 93, 252, 0.25)');
    fillGradient.addColorStop(1, 'rgba(21, 93, 252, 0)');

    heroChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2021', '2022', '2023', '2024', '2025', '2026 (YTD)'],
            datasets: [{
                data: [50, 72, 95, 110, 134, 150], // in Lakhs
                borderColor: '#155DFC',
                borderWidth: 3,
                backgroundColor: fillGradient,
                fill: true,
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: '#155DFC'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    grid: { color: body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.03)' },
                    ticks: { color: '#94A3B8' }
                },
                y: {
                    grid: { color: body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.03)' },
                    ticks: {
                        color: '#94A3B8',
                        callback: function(val) { return '₹' + val + 'L'; }
                    }
                }
            }
        }
    });
}

function animateNumber(id, target, prefix = '', formatIn = false) {
    const el = document.getElementById(id);
    if (!el) return;
    let count = 0;
    const increment = target / 80;
    const run = () => {
        count += increment;
        if (count < target) {
            el.innerText = prefix + (formatIn ? Math.floor(count).toLocaleString('en-IN') : Math.floor(count));
            requestAnimationFrame(run);
        } else {
            el.innerText = prefix + (formatIn ? target.toLocaleString('en-IN') : target);
        }
    };
    run();
}

// --- INTERACTIVE WEALTH JOURNEY STEPPER ---
const journeyData = [
    {
        title: "1. Salary & Cashflow Optimization",
        desc: "We restructure salary allocations (HRA, NPS, Section 80C, corporate perks) to reduce tax leaks and free up cash flow before initial capital deployment.",
        badge: "Tax Shield Active",
        data: [100, 120, 140, 160, 180, 200]
    },
    {
        title: "2. Savings Surplus & Liquidity",
        desc: "Building low-risk emergency liquid funds equivalent to 6-12 months of expenses so market volatility never shocks your family cash flows.",
        badge: "Emergency Buffer Set",
        data: [200, 250, 300, 350, 400, 450]
    },
    {
        title: "3. Direct Mutual Funds & Indexing",
        desc: "Transitioning assets out of high-cost regular plans into low-cost direct plan index funds, saving you up to 1.5% in hidden annual commissions.",
        badge: "Commission Free Growth",
        data: [450, 600, 800, 1050, 1300, 1600]
    },
    {
        title: "4. Capital Gains Tax Harvesting",
        desc: "Legitimately tax-harvesting up to ₹1L in equity long-term capital gains tax-free annually under Section 112A of the Income Tax Act.",
        badge: "Tax Drag Minimised",
        data: [1600, 1850, 2150, 2500, 2900, 3350]
    },
    {
        title: "5. Multi-Asset Wealth Creation",
        desc: "Deploying capital across Sovereign Gold Bonds, high-yield corporate bonds, global indices, and index overlays to build compounding buffers.",
        badge: "Portfolio Diversified",
        data: [3350, 4200, 5300, 6600, 8100, 9800]
    },
    {
        title: "6. Secure Retirement Drawdowns",
        desc: "Structuring safe drawdown rates (SWR) optimized for Indian inflation, ensuring you never run out of retirement corpus.",
        badge: "Pension Flows Secured",
        data: [9800, 11000, 12200, 13500, 15000, 16800]
    },
    {
        title: "7. Succession & Trusts Transfer",
        desc: "Structuring private family trusts and succession wills to pass family wealth tax-efficiently and avoid future dispute liabilities.",
        badge: "Legacy Shelter Complete",
        data: [16800, 19000, 21500, 24500, 28000, 32000]
    }
];

function initJourneyChart() {
    const ctx = document.getElementById('journeyChart');
    if (!ctx) return;

    journeyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Yr 0', 'Yr 2', 'Yr 4', 'Yr 6', 'Yr 8', 'Yr 10'],
            datasets: [{
                data: journeyData[0].data,
                borderColor: '#155DFC',
                borderWidth: 2.5,
                backgroundColor: 'rgba(21, 93, 252, 0.05)',
                fill: true,
                tension: 0.2,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#94A3B8' } },
                y: {
                    grid: { color: body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.03)' },
                    ticks: {
                        color: '#94A3B8',
                        callback: function(val) { return '₹' + (val >= 1000 ? (val/1000).toFixed(1) + 'Cr' : val + 'L'); }
                    }
                }
            }
        }
    });
}

function setJourneyStep(stepIndex) {
    currentJourneyStep = stepIndex;

    const navButtons = document.querySelectorAll('.journey-nav-btn');
    navButtons.forEach((btn, idx) => {
        if (idx === stepIndex) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    const step = journeyData[stepIndex];
    document.getElementById('journeyTitle').innerText = step.title;
    document.getElementById('journeyDesc').innerText = step.desc;
    document.getElementById('journeyBadgeText').innerText = step.badge;

    if (journeyChartInstance) {
        journeyChartInstance.data.datasets[0].data = step.data;
        journeyChartInstance.update();
    }
}

// --- INTERACTIVE GOAL PLANNER ---
const goalRoadmaps = {
    house: {
        title: "Milestones for: Buy A House",
        s1t: "Downpayment Accumulation",
        s1d: "Direct liquid debt allocations compounding safe margins for 3-5 years.",
        s2t: "Capital Gains shelter",
        s2d: "Harvesting gains tax-free using Section 54 options when deploying capital.",
        s3t: "Portfolio Balancing",
        s3d: "Limiting property weights to under 40% of total wealth to prevent asset locks."
    },
    child: {
        title: "Milestones for: Child's Education",
        s1t: "Target Locking",
        s1d: "Calculating foreign vs domestic fee structures with inflation offsets.",
        s2t: "Tenure Allocation",
        s2d: "Investing in high-equity direct plans, transitioning to arbitrage options 2 years prior.",
        s3t: "Direct Fee drawdowns",
        s3d: "Systematic withdrawal plans (SWP) deployed to pay tuition directly, preventing tax drag."
    },
    retire: {
        title: "Milestones for: Retirement Security",
        s1t: "Safe Nest Egg Target",
        s1d: "Projecting target corpus incorporating lifestyle inflation and family health buffers.",
        s2t: "Tax Shielding",
        s2d: "Maximizing Section 80C, 80D, and NPS Tier 1 allocations to reduce current income taxes.",
        s3t: "Safe Drawdown SWR",
        s3d: "Earmarking 60-40 equity-debt mixes, drawing safe annual ratios (3-4% limit)."
    },
    wealth: {
        title: "Milestones for: Wealth Creation",
        s1t: "Asset Setup",
        s1d: "Constructing multi-asset configurations (direct indexing, corporate debt, gold).",
        s2t: "Tax Harvesting",
        s2d: "Offsetting gains using Section 112A tax-free exemptions year-on-year.",
        s3t: "Low Cost compounding",
        s3d: "Minimizing fund costs by exiting regular broker schemes entirely."
    },
    business: {
        title: "Milestones for: Business Exit/Expansion",
        s1t: "Corporate treasury",
        s1d: "Allocating corporate cash surplus in direct low-duration corporate debt.",
        s2t: "Succession Wills",
        s2d: "Drafting bulletproof Wills and trust models to shield corporate operations.",
        s3t: "Exit Liquidity Plan",
        s3d: "Structuring sale gains to minimize business transfer tax slabs."
    }
};

function selectGoal(goalName) {
    const buttons = document.querySelectorAll('.goal-selector-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(goalName)) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    const data = goalRoadmaps[goalName];
    document.getElementById('goalRoadmapTitle').innerText = data.title;
    document.getElementById('goalStage1Title').innerText = data.s1t;
    document.getElementById('goalStage1Desc').innerText = data.s1d;
    document.getElementById('goalStage2Title').innerText = data.s2t;
    document.getElementById('goalStage2Desc').innerText = data.s2d;
    document.getElementById('goalStage3Title').innerText = data.s3t;
    document.getElementById('goalStage3Desc').innerText = data.s3d;
}

// --- HOW NWY WORKS EXPANDABLE TIMELINE ---
function toggleStep(index) {
    const items = document.querySelectorAll('.timeline-step-item');
    items.forEach((item, idx) => {
        const panel = item.querySelector('.timeline-step-panel');
        if (idx === index) {
            item.classList.add('active');
            panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
            item.classList.remove('active');
            panel.style.maxHeight = '0px';
        }
    });
}

// --- WEALTH CALCULATORS ENGINE ---
function initCalculators() {
    calculateSip();
    calculateRetirement();
    calculateGoal();
    calculateTax();
    calculateEmergency();
}

function switchCalcTab(tabName) {
    activeTab = tabName;
    const tabButtons = document.querySelectorAll('.calc-tab-btn');
    const panels = document.querySelectorAll('.calc-display-panel');

    tabButtons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    panels.forEach(p => {
        if (p.getAttribute('id') === `panel-${tabName}`) p.classList.add('active');
        else p.classList.remove('active');
    });

    if (tabName === 'sip') calculateSip();
    else if (tabName === 'retire') calculateRetirement();
    else if (tabName === 'goal') calculateGoal();
    else if (tabName === 'tax') calculateTax();
    else if (tabName === 'emergency') calculateEmergency();
}

// 1. SIP Calculator
function calculateSip() {
    const p = parseFloat(document.getElementById('sipSlider').value);
    const t = parseInt(document.getElementById('sipYearsSlider').value);
    const r = parseFloat(document.getElementById('sipRateSlider').value) / 12 / 100; // Monthly rate
    const n = t * 12; // Monthly periods

    document.getElementById('sipValDisplay').innerText = '₹' + p.toLocaleString('en-IN');
    document.getElementById('sipYearsDisplay').innerText = t + ' Years';
    document.getElementById('sipRateDisplay').innerText = (r * 12 * 100).toFixed(1) + '%';

    // Compounding Formula
    let totalInvested = p * n;
    let futureValue = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    futureValue = Math.round(futureValue);
    let gains = futureValue - totalInvested;

    document.getElementById('sipTotalVal').innerText = '₹' + futureValue.toLocaleString('en-IN');
    document.getElementById('sipInvestedVal').innerText = '₹' + totalInvested.toLocaleString('en-IN');
    document.getElementById('sipGainsVal').innerText = '₹' + gains.toLocaleString('en-IN');

    // Chart
    const ctx = document.getElementById('sipChart');
    if (!ctx) return;
    if (sipChartInstance) sipChartInstance.destroy();

    sipChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Invested', 'Estimated Gains'],
            datasets: [{
                data: [totalInvested, gains],
                backgroundColor: ['#64748B', '#155DFC'],
                borderColor: body.classList.contains('dark-mode') ? '#111827' : '#FFFFFF',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: body.classList.contains('dark-mode') ? '#94A3B8' : '#475569' } }
            }
        }
    });
}

// 2. Retirement Planner
function calculateRetirement() {
    const age = parseInt(document.getElementById('retAgeSlider').value);
    const target = parseInt(document.getElementById('retTargetSlider').value);
    const expense = parseFloat(document.getElementById('retExpenseSlider').value);

    if (target <= age) {
        document.getElementById('retTargetSlider').value = age + 1;
        calculateRetirement();
        return;
    }

    document.getElementById('retAgeDisplay').innerText = age + ' Yrs';
    document.getElementById('retTargetDisplay').innerText = target + ' Yrs';
    document.getElementById('retExpenseDisplay').innerText = '₹' + expense.toLocaleString('en-IN');

    // Inflation indexation (6% p.a.)
    let years = target - age;
    let infExpense = expense * Math.pow(1 + 0.06, years);
    infExpense = Math.round(infExpense);

    // Corpus target: Safe Withdrawal Rate limit (assume SWR 3.5%)
    let targetCorpus = Math.round((infExpense * 12) / 0.035);

    // Monthly SIP needed (12% compounding before retirement)
    const r = 0.12 / 12;
    const n = years * 12;
    let monthlySip = targetCorpus / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    monthlySip = Math.round(monthlySip);

    document.getElementById('retCorpusVal').innerText = '₹' + (targetCorpus / 10000000).toFixed(2) + ' Cr';
    document.getElementById('retInfExpenseVal').innerText = '₹' + infExpense.toLocaleString('en-IN') + '/mo';
    document.getElementById('retSipNeededVal').innerText = '₹' + monthlySip.toLocaleString('en-IN') + '/mo';

    // Chart
    const ctx = document.getElementById('retirementChart');
    if (!ctx) return;
    if (retirementChartInstance) retirementChartInstance.destroy();

    retirementChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current Expense', 'Inflation Adjusted Expense'],
            datasets: [{
                data: [expense, infExpense],
                backgroundColor: ['#64748B', '#155DFC'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#94A3B8' } },
                y: {
                    grid: { color: body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.03)' : 'rgba(15, 23, 42, 0.03)' },
                    ticks: { color: '#94A3B8' }
                }
            }
        }
    });
}

// 3. Goal Planner
function calculateGoal() {
    const fv = parseFloat(document.getElementById('goalAmtSlider').value);
    const t = parseInt(document.getElementById('goalYearsSlider').value);
    const rateVal = parseFloat(document.getElementById('goalRateSlider').value);
    const r = rateVal / 12 / 100;
    const n = t * 12;

    document.getElementById('goalValDisplay').innerText = '₹' + fv.toLocaleString('en-IN');
    document.getElementById('goalYearsDisplay').innerText = t + ' Years';
    document.getElementById('goalRateDisplay').innerText = rateVal.toFixed(1) + '%';

    // SIP Formula: PMT = FV / [((1 + r)^n - 1) / r * (1 + r)]
    let monthlySip = fv / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    monthlySip = Math.round(monthlySip);

    let invested = monthlySip * n;
    let gains = fv - invested;

    document.getElementById('goalSipRequiredVal').innerText = '₹' + monthlySip.toLocaleString('en-IN') + '/mo';
    document.getElementById('goalInvestedVal').innerText = '₹' + invested.toLocaleString('en-IN');
    document.getElementById('goalGainsVal').innerText = '₹' + gains.toLocaleString('en-IN');

    // Chart
    const ctx = document.getElementById('goalChart');
    if (!ctx) return;
    if (goalChartInstance) goalChartInstance.destroy();

    goalChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Invested', 'Earned Interest'],
            datasets: [{
                data: [invested, gains],
                backgroundColor: ['#64748B', '#155DFC'],
                borderColor: body.classList.contains('dark-mode') ? '#111827' : '#FFFFFF',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: body.classList.contains('dark-mode') ? '#94A3B8' : '#475569' } }
            }
        }
    });
}

// 4. Tax Savings Optimizer
function calculateTax() {
    const income = parseFloat(document.getElementById('taxIncomeSlider').value);
    const c80 = parseFloat(document.getElementById('tax80cSlider').value);
    const d80 = parseFloat(document.getElementById('tax80dSlider').value);

    document.getElementById('taxIncomeDisplay').innerText = '₹' + income.toLocaleString('en-IN');
    document.getElementById('tax80cDisplay').innerText = '₹' + c80.toLocaleString('en-IN');
    document.getElementById('tax80dDisplay').innerText = '₹' + d80.toLocaleString('en-IN');

    // Simple tax slab calculator simulation (Resident under old tax slab vs optimized)
    let taxableBase = income - c80 - d80;
    
    // Simple bracket math
    let taxBefore = calculateTaxSlabs(income);
    let taxAfter = calculateTaxSlabs(taxableBase);
    let taxSaved = taxBefore - taxAfter;

    document.getElementById('taxSavedVal').innerText = '₹' + taxSaved.toLocaleString('en-IN');
    document.getElementById('taxNetLiabilityVal').innerText = '₹' + taxAfter.toLocaleString('en-IN');
    document.getElementById('taxNetIncomeVal').innerText = '₹' + (income - taxAfter).toLocaleString('en-IN');

    // Chart
    const ctx = document.getElementById('taxChart');
    if (!ctx) return;
    if (taxChartInstance) taxChartInstance.destroy();

    taxChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Tax Paid', 'Disposable Income', 'Tax Saved'],
            datasets: [{
                data: [taxAfter, income - taxAfter, taxSaved],
                backgroundColor: ['#EF4444', '#155DFC', '#10B981'],
                borderColor: body.classList.contains('dark-mode') ? '#111827' : '#FFFFFF',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: body.classList.contains('dark-mode') ? '#94A3B8' : '#475569' } }
            }
        }
    });
}

function calculateTaxSlabs(inc) {
    if (inc <= 300000) return 0;
    let tax = 0;
    if (inc > 1500000) {
        tax += (inc - 1500000) * 0.3;
        inc = 1500000;
    }
    if (inc > 1200000) {
        tax += (inc - 1200000) * 0.2;
        inc = 1200000;
    }
    if (inc > 900000) {
        tax += (inc - 900000) * 0.15;
        inc = 900000;
    }
    if (inc > 600000) {
        tax += (inc - 600000) * 0.1;
        inc = 600000;
    }
    if (inc > 300000) {
        tax += (inc - 300000) * 0.05;
    }
    return Math.round(tax);
}

// 5. Emergency Fund
function calculateEmergency() {
    const expense = parseFloat(document.getElementById('emExpenseSlider').value);
    const months = parseInt(document.getElementById('emMonthsSlider').value);

    document.getElementById('emExpenseDisplay').innerText = '₹' + expense.toLocaleString('en-IN');
    document.getElementById('emMonthsDisplay').innerText = months + ' Months';

    let totalBuffer = expense * months;
    let liquidB = Math.round(totalBuffer * 0.7); // 70% in liquid debt
    let cashB = totalBuffer - liquidB; // 30% instant cash

    document.getElementById('emTotalVal').innerText = '₹' + totalBuffer.toLocaleString('en-IN');
    document.getElementById('emLiquidVal').innerText = '₹' + liquidB.toLocaleString('en-IN');
    document.getElementById('emCashVal').innerText = '₹' + cashB.toLocaleString('en-IN');

    // Chart
    const ctx = document.getElementById('emergencyChart');
    if (!ctx) return;
    if (emergencyChartInstance) emergencyChartInstance.destroy();

    emergencyChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Liquid Debt Allocation', 'Instant Bank Balance'],
            datasets: [{
                data: [liquidB, cashB],
                backgroundColor: ['#155DFC', '#64748B'],
                borderColor: body.classList.contains('dark-mode') ? '#111827' : '#FFFFFF',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: body.classList.contains('dark-mode') ? '#94A3B8' : '#475569' } }
            }
        }
    });
}

// --- CLIENT CASE STORIES ---
function initStories() {
    // nothing specific to load, toggle handlers do the work
}

function switchStoryPane(storyNum, paneType) {
    const storyCard = document.querySelector(`.story-card[data-story="${storyNum}"]`);
    if (!storyCard) return;

    // Toggle panes active class
    const panes = storyCard.querySelectorAll('.story-pane');
    panes.forEach(pane => {
        if (pane.classList.contains(`${paneType}-pane`)) pane.classList.add('active');
        else pane.classList.remove('active');
    });

    // Toggle buttons active class
    const buttons = storyCard.querySelectorAll('.story-switch-btn');
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase() === paneType) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

// --- FINANCIAL INSIGHTS SEARCH & FILTER ---
function initInsights() {
    filterInsights('all');
}

function filterInsights(category) {
    const buttons = document.querySelectorAll('.insights-tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(category)) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    const cards = document.querySelectorAll('.insight-card');
    cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (category === 'all' || cat === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchInsights() {
    const query = document.getElementById('insightSearch').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.insight-card');
    
    // Clear tab highlight
    const buttons = document.querySelectorAll('.insights-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.insights-tab-btn[onclick*="all"]').classList.add('active');

    cards.forEach(card => {
        const title = card.querySelector('.insight-title').innerText.toLowerCase();
        const desc = card.querySelector('.insight-desc').innerText.toLowerCase();
        const tag = card.querySelector('.insight-tag').innerText.toLowerCase();

        if (title.includes(query) || desc.includes(query) || tag.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- FAQ ACCORDION ---
function toggleFaq(triggerElement) {
    const faqItem = triggerElement.parentElement;
    const panel = faqItem.querySelector('.faq-panel');
    const isActive = faqItem.classList.contains('active');

    // Collapse others
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        item.classList.remove('active');
        const p = item.querySelector('.faq-panel');
        if (p) p.style.maxHeight = '0px';
    });

    if (!isActive) {
        faqItem.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
        faqItem.classList.remove('active');
        panel.style.maxHeight = '0px';
    }
}

// --- MULTI-STEP ONBOARDING WIZARD ---
function initWizard() {
    goToWizardStep(1);
}

function goToWizardStep(stepNum) {
    // Validate fields for current step before going forward
    if (stepNum > currentWizardStep) {
        if (!validateWizardStep(currentWizardStep)) return;
    }

    currentWizardStep = stepNum;

    // Update active panel
    const panels = document.querySelectorAll('.wizard-step-panel');
    panels.forEach((p, idx) => {
        if (idx === stepNum - 1) p.classList.add('active');
        else p.classList.remove('active');
    });

    // Update node status
    const nodes = document.querySelectorAll('.wizard-node');
    nodes.forEach((node, idx) => {
        const nodeNum = idx + 1;
        if (nodeNum === stepNum) {
            node.className = 'wizard-node active';
        } else if (nodeNum < stepNum) {
            node.className = 'wizard-node completed';
        } else {
            node.className = 'wizard-node';
        }
    });

    // Progress bar width
    const progressBar = document.getElementById('wizardProgressBar');
    if (progressBar) {
        let percentage = ((stepNum - 1) / 3) * 100;
        progressBar.style.width = percentage + '%';
    }

    // Populate summary details on final step
    if (stepNum === 4) {
        document.getElementById('sumName').innerText = document.getElementById('wizName').value;
        document.getElementById('sumContact').innerText = `${document.getElementById('wizPhone').value} / ${document.getElementById('wizEmail').value}`;
        document.getElementById('sumAssets').innerText = `${document.getElementById('wizResidence').value} (${document.getElementById('wizAssets').value})`;
        document.getElementById('sumGoal').innerText = document.getElementById('wizGoal').value;
        document.getElementById('sumTime').innerText = `${document.getElementById('wizDate').value} (${document.getElementById('wizSlot').value})`;
    }
}

function validateWizardStep(stepNum) {
    if (stepNum === 1) {
        const name = document.getElementById('wizName').value.trim();
        const email = document.getElementById('wizEmail').value.trim();
        const phone = document.getElementById('wizPhone').value.trim();
        if (!name || !email || !phone) {
            alert('Please fill out all contact fields.');
            return false;
        }
    } else if (stepNum === 2) {
        const assets = document.getElementById('wizAssets').value;
        const goal = document.getElementById('wizGoal').value;
        if (!assets || !goal) {
            alert('Please select your assets bracket and financial requirement.');
            return false;
        }
    } else if (stepNum === 3) {
        const date = document.getElementById('wizDate').value;
        const slot = document.getElementById('wizSlot').value;
        if (!date || !slot) {
            alert('Please select date and preferred time slot.');
            return false;
        }
    }
    return true;
}

function handleWizardSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('wizName').value;
    alert(`Handshake Complete! Welcome to the NWY Fiduciary Platform, ${name}.\n\nYour call booking has been logged. A certified advisor will contact you on your registered slot.`);
    
    // Reset wizard
    document.getElementById('onboardingWizard').reset();
    goToWizardStep(1);
}

// Simple newsletter trigger
function handleNewsletter(event) {
    event.preventDefault();
    const email = document.getElementById('nlEmail').value;
    alert(`Subscribed! You have joined the NWY Brief at: ${email}`);
    document.getElementById('nlEmail').value = '';
}
