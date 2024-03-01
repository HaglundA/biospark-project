var map = L.map('mapid').setView([55.3781, -3.4360], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);
var markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        return L.divIcon({
            html: '<div style="background-color: lightblue; color: black; border: 1px solid black; border-radius: 50%; padding: 10px; display: flex; justify-content: center; align-items: center;">' + cluster.getChildCount() + '</div>',
            className: 'marker-cluster', 
            iconSize: L.point(40, 40, true)
        });
    }
});

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
                        <h2>${lab['Lab name / Organisation']}</h2>
                        <p>${lab.Description}</p>
                        <p>${lab['Contact email']}</p>
                        <p>Follow-up: ${lab['Follow-up']}</p>
                    </div>
                `;

                var color;
                switch (lab['Follow-up']) {
                    case 'Yes':
                        color = '#77D970'; // Yellow for low priority
                        break;
                    default:
                        color = '#FFB347'; // Default to red if score is not 1, 2, or 3
                }

                var markerHtmlStyles = `
                    background-color: ${color};
                    width: 1.5rem;
                    height: 1.5rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    left: -0.75rem;
                    top: -0.75rem;
                    position: relative;
                    border-radius: 50%;
                    border: 1px solid #000000;
                    color: #000000;
                    font-size: 0.5rem;
                `;

                var icon = L.divIcon({
                    className: "my-custom-pin",
                    iconAnchor: [0, 24],
                    labelAnchor: [-6, 0],
                    popupAnchor: [0, -36],
                    html: `<span style="${markerHtmlStyles}">
                                <div style="position: relative; top: 40%; left: 10%; transform: translate(-50%, -50%);"></div>
                            </span>`
                });

                // Create a new marker and add it to the marker cluster group
                var marker = L.marker([lat, lon], { icon }).bindPopup(popupContent);
                markers.addLayer(marker);
            } else {
                console.error('Failed to get postcode coordinates:', data.error);
            }
        })
        .catch(error => console.error('Failed to fetch postcode coordinates:', error));
}

// Path of the CSV file
var url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQPbkc2gsNVnmRdUvKzMsnTumtNBbIMc5iuEnoDPV6k6tffyJMCwPd0KCCrDueHHcfMcWNwn239Sytb/pub?output=csv';

fetch(url)
    .then(response => response.text())
    .then(data => {
        var results = Papa.parse(data, {header: true});
        results.data.forEach(lab => {
            console.log(lab.Location); // Print the "Location" column
            addMarkerFromPostcode(lab.postcode, lab);
        });

        // Add the marker cluster group to the map
        map.addLayer(markers);
    })
    .catch(error => console.error('Failed to fetch data:', error));