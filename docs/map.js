var map = L.map('mapid').setView([55.3781, -3.4360], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to fetch coordinates for a postcode
function addMarkerFromPostcode(postcode, name) {
    fetch(`https://api.postcodes.io/postcodes/${postcode}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                var lat = data.result.latitude;
                var lon = data.result.longitude;
                L.marker([lat, lon]).addTo(map).bindPopup(name);
            } else {
                console.error('Failed to get postcode coordinates:', data.error);
            }
        })
        .catch(error => console.error('Failed to fetch postcode coordinates:', error));
}

// Use the function to add markers
addMarkerFromPostcode('CB1 9YE', 'Lab 1');
addMarkerFromPostcode('M1 1AE', 'Lab 2');

