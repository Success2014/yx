// --------------------------
// 1. Prompt for user name
// --------------------------
const namePromptDiv = document.getElementById('name-prompt');
const userNameInput = document.getElementById('userName');
const saveNameBtn = document.getElementById('saveName');

// Check if there's a saved name in local storage
let savedName = localStorage.getItem('yxUserName');

if (savedName) {
  // If we already have a name, hide the prompt and show the map
  namePromptDiv.style.display = 'none';
} else {
  // Show the name prompt
  namePromptDiv.style.display = 'flex';
}

saveNameBtn.addEventListener('click', () => {
  const enteredName = userNameInput.value.trim();
  if (enteredName) {
    localStorage.setItem('yxUserName', enteredName);
    // Hide the prompt after saving
    namePromptDiv.style.display = 'none';
  } else {
    alert('Please enter a name.');
  }
});

// --------------------------
// 2. Get location by IP
// --------------------------
fetch('http://ip-api.com/json/')
  .then(response => response.json())
  .then(data => {
    // Data contains lat, lon, city, etc.
    const { lat, lon } = data;

    // --------------------------
    // 3. Initialize the map
    // --------------------------
    // Center map on user's location, zoom level ~ 10 for city
    const map = L.map('map').setView([lat, lon], 10);

    // Add a tile layer (using OpenStreetMap as an example)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Add a marker at user's location
    L.marker([lat, lon]).addTo(map)
      .bindPopup("You're here!")
      .openPopup();
  })
  .catch(error => {
    console.error('Error retrieving IP location:', error);
  });
