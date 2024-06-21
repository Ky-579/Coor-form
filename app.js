// Include Proj4js definitions for various projections
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
proj4.defs("EPSG:4742", "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs");
proj4.defs("EPSG:32647", "+proj=utm +zone=47 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32648", "+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs");

// Event listener for transformation type selection
document.getElementById('transform-choice-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const transformationType = document.getElementById('transformation-type').value;
    document.getElementById('transform-form').style.display = 'block';

    if (transformationType === 'to-en') {
        document.getElementById('ll-inputs').style.display = 'block';
        document.getElementById('en-inputs').style.display = 'none';
    } else {
        document.getElementById('ll-inputs').style.display = 'none';
        document.getElementById('en-inputs').style.display = 'block';
    }
});

// Event listener for forward and reverse transformation
document.getElementById('transform-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const transformationType = document.getElementById('transformation-type').value;
    const sourceProjection = document.getElementById('source-projection').value;
    const targetProjection = document.getElementById('target-projection').value;

    console.log("Transformation Type:", transformationType);
    console.log("Source Projection:", sourceProjection);
    console.log("Target Projection:", targetProjection);

    try {
        let transformed;
        if (transformationType === 'to-en') {
            const lon = parseFloat(document.getElementById('longitude').value);
            const lat = parseFloat(document.getElementById('latitude').value);

            if (isNaN(lon) || isNaN(lat)) {
                throw new Error("Invalid longitude or latitude values");
            }

            console.log("Longitude:", lon, "Latitude:", lat);
            transformed = proj4(sourceProjection, targetProjection, [lon, lat]);

            document.getElementById('transformed-easting').style.display = 'block';
            document.getElementById('transformed-northing').style.display = 'block';
            document.getElementById('transformed-longitude').style.display = 'none';
            document.getElementById('transformed-latitude').style.display = 'none';
            document.getElementById('transformed-easting').textContent = 'Easting: ' + transformed[0].toFixed(2);
            document.getElementById('transformed-northing').textContent = 'Northing: ' + transformed[1].toFixed(2);
        } else {
            const easting = parseFloat(document.getElementById('easting').value);
            const northing = parseFloat(document.getElementById('northing').value);

            if (isNaN(easting) || isNaN(northing)) {
                throw new Error("Invalid easting or northing values");
            }

            console.log("Easting:", easting, "Northing:", northing);
            transformed = proj4(sourceProjection, targetProjection, [easting, northing]);

            document.getElementById('transformed-longitude').style.display = 'block';
            document.getElementById('transformed-latitude').style.display = 'block';
            document.getElementById('transformed-easting').style.display = 'none';
            document.getElementById('transformed-northing').style.display = 'none';
            document.getElementById('transformed-longitude').textContent = 'Longitude: ' + transformed[0].toFixed(6);
            document.getElementById('transformed-latitude').textContent = 'Latitude: ' + transformed[1].toFixed(6);
        }
        console.log("Transformed Coordinates:", transformed);
        document.getElementById('result').style.display = 'block';
    } catch (error) {
        console.error("Transformation error:", error);
        alert("Transformation failed: " + error.message);
    }
});
