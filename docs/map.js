var map = L.map('mapid').setView([55.3781, -3.4360], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to fetch coordinates for a postcode
function addMarkerFromPostcode(postcode, lab) {
    fetch(`https://api.postcodes.io/postcodes/${postcode}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                var lat = data.result.latitude;
                var lon = data.result.longitude;
                var popupContent = `
                    <div>
                        <h2>${lab.name}</h2>
                        <p>${lab.description}</p>
                    </div>
                `;

                var color;
                switch (lab.score) {
                    case '1':
                        color = '#FFD700'; // Yellow for low priority
                        break;
                    case '2':
                        color = '#FFA500'; // Orange for medium priority
                        break;
                    case '3':
                        color = '#FF0000'; // Red for high priority
                        break;
                    default:
                        color = '#D3D3D3'; // Default to red if score is not 1, 2, or 3
                }

                var markerHtmlStyles = `
                    background-color: ${color};
                    width: 1rem;
                    height: 1rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    left: -0.75rem;
                    top: -0.75rem;
                    position: relative;
                    border-radius: 50%;
                    border: 1px solid #FFFFFF;
                    color: #FFFFFF;
                    font-size: 0.5rem;
                `;

                var icon = L.divIcon({
                    className: "my-custom-pin",
                    iconAnchor: [0, 24],
                    labelAnchor: [-6, 0],
                    popupAnchor: [0, -36],
                    html: `<span style="${markerHtmlStyles}">
                                <div style="position: relative; top: 40%; left: 10%; transform: translate(-50%, -50%);">${lab.score}</div>
                            </span>`
                });

                L.marker([lat, lon], { icon }).addTo(map).bindPopup(popupContent);
            } else {
                console.error('Failed to get postcode coordinates:', data.error);
            }
        })
        .catch(error => console.error('Failed to fetch postcode coordinates:', error));
}
// Path of the CSV file
var url = '/inputs/lab_info.csv';

fetch(url)
    .then(response => response.text())
    .then(data => {
        var results = Papa.parse(data, {header: true});
        console.log(data);
        results.data.forEach(lab => { // Change 'row' to 'lab'
            addMarkerFromPostcode(lab.postcode, lab); // Pass the entire 'lab' object
        });
    })
    .catch(error => console.error('Failed to fetch data:', error));