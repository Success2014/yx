/**********************************************
 * 1. Handle the User Name Prompt
 **********************************************/

// Grab references to the name prompt elements
const namePromptDiv = document.getElementById('name-prompt');
const userNameInput = document.getElementById('userName');
const saveNameBtn = document.getElementById('saveName');

// Check if there's a saved name in local storage
let savedName = localStorage.getItem('yxUserName');

if (savedName) {
  // If a name is already saved, hide the prompt
  namePromptDiv.style.display = 'none';
} else {
  // Otherwise, show the prompt
  namePromptDiv.style.display = 'flex';
}

// When the user clicks "Save Name"
saveNameBtn.addEventListener('click', () => {
  const enteredName = userNameInput.value.trim();
  if (enteredName) {
    localStorage.setItem('yxUserName', enteredName);
    // Hide the prompt
    namePromptDiv.style.display = 'none';
  } else {
    alert('Please enter a name.');
  }
});

/**********************************************
 * 2. Fetch User's Location via HTTPS
 *    (Using ipapi.co for IP-based geolocation)
 **********************************************/
fetch('https://ipapi.co/json/')  
  .then(response => response.json())
  .then(data => {
    // ipapi.co returns latitude and longitude fields
    const lat = data.latitude;
    const lon = data.longitude;

    // If the fields are missing or undefined, we can use defaults
    // But typically ipapi.co does return them correctly
    if (lat === undefined || lon === undefined) {
      console.error('Could not find lat/lon in ipapi.co response.', data);
      // Fall back to a default location if needed
      initMap(0, 0);
    } else {
      initMap(lat, lon);
    }
  })
  .catch(error => {
    console.error('Error retrieving IP location:', error);
    // Fall back to a default location if needed
    initMap(0, 0);
  });

/**********************************************
 * 3. Initialize Leaflet Map
 **********************************************/
function initMap(lat, lon) {
  // Create the map centered on the user's location
  const map = L.map('map').setView([lat, lon], 10);

  // Add the OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Place a marker at the user's location
  L.marker([lat, lon]).addTo(map)
    .bindPopup("You're here!")
    .openPopup();
}