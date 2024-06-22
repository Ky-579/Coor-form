// Define EPSG:4742 (GDM2000), (WGS84), (UTM ZONE47N), (UTM ZONE 48N),
proj4.defs("EPSG:4742", "+proj=longlat +datum=GDM2000 +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
proj4.defs("EPSG:24547", "+proj=utm +zone=47 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:24548", "+proj=utm +zone=48 +ellps=evrst48 +towgs84=-11,851,5,0,0,0,0 +units=m +no_defs");

// Example coordinates (longitude, latitude)
var lonLatCoordinates = [100.0, 50.0]; // Example coordinates in lon/lat format

// Transform from EPSG:4326 (WGS84) to EPSG:24547 (UTM Zone 47N)
var utmCoordinates = proj4("EPSG:4326", "EPSG:24547", lonLatCoordinates);

console.log("UTM Coordinates:", utmCoordinates);

    try {
    var lonLatCoordinates = [100.0, 50.0]; // Example coordinates in lon/lat format

    // Transform from EPSG:4326 (WGS84) or EPSG:4742 (GDM2000) to EPSG:24547 (UTM Zone 47N)
    var utmCoordinates = proj4("EPSG:4326", "EPSG:24547", lonLatCoordinates);

    console.log("UTM Coordinates:", utmCoordinates);
} catch (error) {
    console.error("Error transforming coordinates:", error);
}


document.getElementById('transform-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const sourceProjection = document.getElementById('sourceProjection').value;
    const targetProjection = document.getElementById('targetProjection').value;
    const longitude = parseFloat(document.getElementById('longitude').value.trim());
    const latitude = parseFloat(document.getElementById('latitude').value.trim());
    const resultFormat = document.querySelector('input[name="resultFormat"]:checked').value;

    if (isNaN(longitude) || isNaN(latitude)) {
        document.getElementById('result').innerHTML = '<p style="color: red;">Please enter valid coordinates (Longitude/Easting and Latitude/Northing).</p>';
        return;
    }

    document.getElementById('result').innerHTML = '<p>Transforming coordinates...</p>';

    try {
        console.log('Source Projection:', sourceProjection);
        console.log('Target Projection:', targetProjection);
        console.log('Coordinates:', longitude, latitude);
        
        const transformedCoordinates = proj4(sourceProjection, targetProjection, [longitude, latitude]);
        console.log('Transformed Coordinates:', transformedCoordinates);
        
        let resultText;
        if (resultFormat === 'latlon') {
            resultText = `Transformed Coordinates: ${transformedCoordinates[0].toFixed(6)}, ${transformedCoordinates[1].toFixed(6)} (Longitude, Latitude)`;
        } else {
            resultText = `Transformed Coordinates: ${transformedCoordinates[0].toFixed(6)}, ${transformedCoordinates[1].toFixed(6)} (Easting, Northing)`;
        }

        document.getElementById('result').innerHTML = `<p>${resultText}</p>`;
    } catch (error) {
        console.error('Transformation error:', error);
        document.getElementById('result').innerHTML = `<p style="color: red;">Transformation error: ${error.message}</p>`;
    }
});

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
