// Path of the CSV file
var url = 'inputs/lab_info.csv';

fetch(url)
    .then(response => response.text())
    .then(data => {
        var results = Papa.parse(data, {header: true});
        var table = document.getElementById('csv-table').getElementsByTagName('tbody')[0];
        results.data.forEach(row => {
            var newRow = table.insertRow();
            var nameCell = newRow.insertCell(0);
            var postcodeCell = newRow.insertCell(1);
            nameCell.textContent = row.name;
            postcodeCell.textContent = row.postcode;
        });
    })
    .catch(error => console.error('Failed to fetch data:', error));