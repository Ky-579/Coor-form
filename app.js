// Define custom transformation parameters for GDM2000 and WGS84
proj4.defs("EPSG:4742", "+proj=longlat +datum=GDM2000 +towgs84=680.507,35.110,508.797,-0.262,-0.026,-0.010,9.421 +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");

// Custom UTM definitions
proj4.defs("EPSG:24547", "+proj=utm +zone=47 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:24548", "+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:24547", "+proj=utm +zone=47 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:24548", "+proj=utm +zone=48 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs");

// Define WGS84
proj4.defs("WGS84", "+proj=longlat +datum=WGS84 +no_defs +ellps=WGS84 +towgs84=0,0,0");

// Define UTM Zone 47N
proj4.defs("UTM47N", "+proj=utm +zone=47 +datum=WGS84 +units=m +no_defs +ellps=WGS84 +towgs84=0,0,0");

// Define UTM Zone 48N
proj4.defs("UTM48N", "+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs +ellps=WGS84 +towgs84=0,0,0");


// Utility function to handle custom transformations
function transformCoordinates(sourceProjection, targetProjection, coordinates) {
    try {
        if (sourceProjection === "EPSG:4742" && targetProjection === "GDM2000_UTM47N") {
            // GDM2000 to UTM Zone 47N
            return proj4("EPSG:4742", "GDM2000_UTM47N", coordinates);
        } else if (sourceProjection === "EPSG:4742" && targetProjection === "GDM2000_UTM48N") {
            // GDM2000 to UTM Zone 48N
            return proj4("EPSG:4742", "GDM2000_UTM48N", coordinates);
        } else if (sourceProjection === "EPSG:4326" && targetProjection === "EPSG:24547") {
            // WGS84 to UTM Zone 47N
            return proj4("EPSG:4326", "EPSG:24547", coordinates);
        } else if (sourceProjection === "EPSG:4326" && targetProjection === "EPSG:24548") {
            // WGS84 to UTM Zone 48N
            return proj4("EPSG:4326", "EPSG:24548", coordinates);
        } else {
            // Default transformation
            return proj4(sourceProjection, targetProjection, coordinates);
        }
    } catch (error) {
        console.error("Error transforming coordinates:", error);
        throw error;
    }
}

document.getElementById('transform-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const sourceProjection = document.getElementById('sourceProjection').value;
    const targetProjection = document.getElementById('targetProjection').value;
    const lon = parseFloat(document.getElementById('longitude').value.trim());
    const lat = parseFloat(document.getElementById('latitude').value.trim());

    if (isNaN(lon) || isNaN(lat)) {
        document.getElementById('result').innerHTML = '<p style="color: red;">Please enter valid coordinates (Longitude/Easting and Latitude/Northing).</p>';
        return;
    }

    try {
        // Perform coordinate transformation using custom utility function
        var transformedCoordinates;
        if (targetProjection === "GDM2000_UTM47N" || targetProjection === "GDM2000_UTM48N") {
            transformedCoordinates = transformCoordinates(sourceProjection, targetProjection, [lon, lat]);
        } else {
            transformedCoordinates = transformCoordinates(sourceProjection, targetProjection, [lon, lat]);
        }
        console.log(`Transformed Coordinates (${sourceProjection} to ${targetProjection}):`, transformedCoordinates);

        // Determine result format
        const resultFormat = document.querySelector('input[name="resultFormat"]:checked').value;
        let resultText;
        if (resultFormat === 'latlon') {
            resultText = `Transformed Coordinates: ${transformedCoordinates[0].toFixed(6)}, ${transformedCoordinates[1].toFixed(6)} (Longitude, Latitude)`;
        } else {
            resultText = `Transformed Coordinates: ${transformedCoordinates[0].toFixed(6)}, ${transformedCoordinates[1].toFixed(6)} (Easting, Northing)`;
        }

        // Display result
        document.getElementById('result').innerHTML = `<p>${resultText}</p>`;
    } catch (error) {
        console.error("Error transforming coordinates:", error.message);
        document.getElementById('result').innerHTML = `<p style="color: red;">Error transforming coordinates: ${error.message}</p>`;
    }
})

// 3D Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x007bff, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}
animate();

// Adjust the 3D canvas when resizing the window
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
