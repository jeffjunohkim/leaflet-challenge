// Initialize the map
const map = L.map('map').setView([37.09, -95.71], 4);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get color based on earthquake depth
function getColor(depth) {
    return depth > 90 ? '#FF5F65' :
           depth > 70 ? '#FCA35D' :
           depth > 50 ? '#FDB72A' :
           depth > 30 ? '#F7DB11' :
           depth > 10 ? '#DCFF5E' :
                        '#A3F600';
}

// Function to get radius based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude ? magnitude * 4 : 1;
}

// Fetch the earthquake data
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
    // Add each earthquake to the map
    data.features.forEach(function(feature) {
        const coords = feature.geometry.coordinates;
        const magnitude = feature.properties.mag;
        const depth = coords[2];

        L.circleMarker([coords[1], coords[0]], {
            radius: getRadius(magnitude),
            fillColor: getColor(depth),
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`
            <h3>${feature.properties.place}</h3>
            <hr>
            <p>Magnitude: ${magnitude}</p>
            <p>Depth: ${depth} km</p>
            <p>${new Date(feature.properties.time)}</p>
        `).addTo(map);
    });

    // Add legend
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'legend');
        const depths = [-10, 10, 30, 50, 70, 90];
        const colors = ['#A3F600', '#DCFF5E', '#F7DB11', '#FDB72A', '#FCA35D', '#FF5F65'];
        const labels = [];

        div.innerHTML += '<strong>Depth (km)</strong><br>';
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(map);
});
