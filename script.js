let defaultDate = '';
let defaultClientFxRate = 0;

// Listen for date and FX rate input changes
document.getElementById('defaultDate').addEventListener('change', function() {
    defaultDate = this.value;
});

document.getElementById('defaultClientFxRate').addEventListener('input', function() {
    defaultClientFxRate = parseFloat(this.value);
});

// Add event listener for adding entry
document.getElementById('addEntry').addEventListener('click', function() {
    // Get input values
    const artistName = document.getElementById('artistName').value;
    const labelName = document.getElementById('labelName').value;
    const usd = parseFloat(document.getElementById('usd').value);
    const companyFxRate = parseFloat(document.getElementById('companyFxRate').value);
    const revenueDeduction = parseFloat(document.getElementById('revenueDeduction').value);
    const prevMonthDue = parseFloat(document.getElementById('prevMonthDue').value);

    // Make sure values are valid
    if (!artistName || !labelName || isNaN(usd) || isNaN(companyFxRate) || isNaN(revenueDeduction)) {
        alert("Please fill all fields correctly!");
        return;
    }

    // If no date or client FX rate is entered, use the default values
    const date = defaultDate || document.getElementById('defaultDate').value;
    const clientFxRate = defaultClientFxRate || parseFloat(document.getElementById('defaultClientFxRate').value);

    // Perform calculations
    const clientBdt = usd * clientFxRate;
    const companyBdt = usd * companyFxRate;
    const revenueDeductionAmount = clientBdt * (revenueDeduction / 100);
    const finalArtistRevenue = clientBdt - revenueDeductionAmount;
    const totalCompanyRevenue = companyBdt + prevMonthDue;

    // Calculate FX profit and deduction profit
    const fxProfit = companyFxRate - clientFxRate; // Difference in FX rates
    const revenueAfterDeduction = usd - (usd * revenueDeduction / 100); // Deduction from artist's revenue
    const companyRevenue = fxProfit + (usd * revenueDeduction / 100); // Total company revenue from FX and deduction profit

    const companyBankRate = 124; // Static for now
    const artistBankRate = 115; // Static for now
    const bankRateDiff = companyBankRate - artistBankRate;

    // Create new row
    const row = document.createElement('tr');
    row.classList.add('bg-gray-700');
    row.innerHTML = `
        <td class="px-4 py-2">${date}</td>
        <td class="px-4 py-2">${labelName}</td>
        <td class="px-4 py-2">${artistName}</td>
        <td class="px-4 py-2">${usd.toFixed(2)}</td>
        <td class="px-4 py-2">${clientFxRate.toFixed(2)}</td>
        <td class="px-4 py-2">${companyFxRate.toFixed(2)}</td>
        <td class="px-4 py-2">${clientBdt.toFixed(2)}</td>
        <td class="px-4 py-2">${companyBdt.toFixed(2)}</td>
        <td class="px-4 py-2">${revenueDeductionAmount.toFixed(2)}</td>
        <td class="px-4 py-2">${finalArtistRevenue.toFixed(2)}</td>
        <td class="px-4 py-2">${prevMonthDue.toFixed(2)}</td>
        <td class="px-4 py-2">${totalCompanyRevenue.toFixed(2)}</td>
        <td class="px-4 py-2">${companyBankRate}</td>
        <td class="px-4 py-2">${artistBankRate}</td>
        <td class="px-4 py-2">${bankRateDiff}</td>
    `;

    // Append row to table
    document.querySelector('#revenueTable tbody').appendChild(row);

    // Update total revenues
    updateTotalRevenue();
});

// Function to update the total revenue stats
function updateTotalRevenue() {
    let totalCompanyRevenue = 0;
    let totalArtistRevenue = 0;
    let totalPrevDue = 0;

    const rows = document.querySelectorAll('#revenueTable tbody tr');
    rows.forEach(row => {
        // Get the "Total Company Revenue" and "Final Artist Revenue" columns (index 10 for company, 9 for artist)
        totalCompanyRevenue += parseFloat(row.cells[10].textContent);
        totalArtistRevenue += parseFloat(row.cells[9].textContent);
        totalPrevDue += parseFloat(row.cells[10].textContent); // Assuming same value for prevMonthDue and Total Company Revenue
    });

    // Update the displayed totals
    document.getElementById('totalCompanyRevenue').textContent = totalCompanyRevenue.toFixed(2);
    document.getElementById('totalArtistRevenue').textContent = totalArtistRevenue.toFixed(2);
    document.getElementById('totalPreviousDue').textContent = totalPrevDue.toFixed(2);
}

// Export to Excel function
document.getElementById('exportExcel').addEventListener('click', function() {
    const wb = XLSX.utils.table_to_book(document.getElementById('revenueTable'), {sheet: 'Revenue'});
    XLSX.writeFile(wb, 'RevenueSplit.xlsx');
});
