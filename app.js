document.getElementById('transform-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const sourceProjection = document.getElementById('sourceProjection').value;
    const targetProjection = document.getElementById('targetProjection').value;
    const coordinates = document.getElementById('coordinates').value.trim().split(',').map(parseFloat);

    if (coordinates.length !== 2 || isNaN(coordinates[0]) || isNaN(coordinates[1])) {
        document.getElementById('result').innerHTML = '<p style="color: red;">Please enter valid coordinates (Lon, Lat or Easting, Northing).</p>';
        return;
    }

    try {
        const transformedCoordinates = proj4(sourceProjection, targetProjection, coordinates);
        document.getElementById('result').innerHTML = `<p>Transformed Coordinates: ${transformedCoordinates[0].toFixed(6)}, ${transformedCoordinates[1].toFixed(6)}</p>`;
    } catch (error) {
        document.getElementById('result').innerHTML = `<p style="color: red;">Transformation error: ${error.message}</p>`;
    }
});
