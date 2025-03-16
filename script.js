let defaultDate = '';
let defaultClientFxRate = 0;

document.getElementById('defaultDate').addEventListener('change', function() {
    defaultDate = this.value;
});

document.getElementById('defaultClientFxRate').addEventListener('input', function() {
    defaultClientFxRate = parseFloat(this.value);
});

document.getElementById('addEntry').addEventListener('click', function() {
    const artistName = document.getElementById('artistName').value;
    const labelName = document.getElementById('labelName').value;
    const usd = parseFloat(document.getElementById('usd').value);
    const companyFxRate = parseFloat(document.getElementById('companyFxRate').value);
    const revenueDeduction = parseFloat(document.getElementById('revenueDeduction').value);
    const prevMonthDue = parseFloat(document.getElementById('prevMonthDue').value);

    if (!artistName || !labelName || isNaN(usd) || isNaN(companyFxRate) || isNaN(revenueDeduction)) {
        alert("Please fill all fields correctly!");
        return;
    }

    const date = defaultDate || document.getElementById('defaultDate').value;
    const clientFxRate = defaultClientFxRate || parseFloat(document.getElementById('defaultClientFxRate').value);

    const clientBdt = usd * clientFxRate;
    const companyBdt = usd * companyFxRate;
    const revenueDeductionAmount = clientBdt * (revenueDeduction / 100);
    const finalArtistRevenue = clientBdt - revenueDeductionAmount;
    const totalCompanyRevenue = companyBdt + prevMonthDue;
    
    const profitOfCompany = totalCompanyRevenue - finalArtistRevenue;

    const companyBankRate = 124;
    const artistBankRate = 115;
    const bankRateDiff = companyBankRate - artistBankRate;

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
        <td class="px-4 py-2">${profitOfCompany.toFixed(2)}</td>
        <td class="px-4 py-2">${companyBankRate}</td>
        <td class="px-4 py-2">${artistBankRate}</td>
        <td class="px-4 py-2">${bankRateDiff}</td>
    `;

    document.querySelector('#revenueTable tbody').appendChild(row);

    updateTotalRevenue();
});

function updateTotalRevenue() {
    let totalCompanyRevenue = 0;
    let totalArtistRevenue = 0;
    let totalPrevDue = 0;
    let totalProfitOfCompany = 0;

    const rows = document.querySelectorAll('#revenueTable tbody tr');
    rows.forEach(row => {
        totalCompanyRevenue += parseFloat(row.cells[11].textContent);  // Company Revenue
        totalArtistRevenue += parseFloat(row.cells[9].textContent);     // Artist Revenue
        totalPrevDue += parseFloat(row.cells[10].textContent);          // Previous Due
        totalProfitOfCompany += parseFloat(row.cells[12].textContent);  // Profit of Company
    });

    // Corrected for Profit of Company display
    document.getElementById('totalCompanyRevenue').textContent = totalCompanyRevenue.toFixed(2);
    document.getElementById('totalArtistRevenue').textContent = totalArtistRevenue.toFixed(2);
    document.getElementById('totalPreviousDue').textContent = totalPrevDue.toFixed(2);
    document.getElementById('totalProfitOfCompany').textContent = totalProfitOfCompany.toFixed(2);
}

document.getElementById('exportCSV').addEventListener('click', function () {
    let csvContent = "data:text/csv;charset=utf-8,";

    const rows = document.querySelectorAll("#revenueTable tr");
    rows.forEach(row => {
        const cols = row.querySelectorAll("th, td");
        const rowData = Array.from(cols).map(col => col.textContent).join(",");
        csvContent += rowData + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "RevenueSplit.csv");
    document.body.appendChild(link);
    link.click();
});

document.getElementById('exportExcel').addEventListener('click', function() {
    const wb = XLSX.utils.table_to_book(document.getElementById('revenueTable'), {sheet: 'Revenue'});
    XLSX.writeFile(wb, 'RevenueSplit.xlsx');
});
