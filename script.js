// 1) Prompt for user name or retrieve from localStorage
const namePromptDiv = document.getElementById('name-prompt');
const userNameInput = document.getElementById('userName');
const saveNameBtn = document.getElementById('saveName');
let savedName = localStorage.getItem('yxUserName');

if (savedName) {
  namePromptDiv.style.display = 'none';
} else {
  namePromptDiv.style.display = 'flex';
}

saveNameBtn.addEventListener('click', () => {
  const enteredName = userNameInput.value.trim();
  if (enteredName) {
    localStorage.setItem('yxUserName', enteredName);
    savedName = enteredName;
    namePromptDiv.style.display = 'none';
  } else {
    alert('Please enter a name.');
  }
});

// 2) Initialize the map (once the user has a name)
let map;
function initMap(lat, lon) {
  if (!map) {
    map = L.map('map').setView([lat, lon], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
  }

  // Place a marker for the current user (optional)
  L.marker([lat, lon]).addTo(map)
    .bindPopup("You're here!")
    .openPopup();
}

// 3) Get location via IP or GPS
// For example, using ipapi.co:
function getLocationAndStore() {
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      const lat = data.latitude;
      const lon = data.longitude;

      initMap(lat, lon);

      // 4) Save to Firestore
      if (savedName) {
        db.collection('locations').doc(savedName).set({
          name: savedName,
          lat: lat,
          lon: lon,
          updatedAt: new Date().toISOString()
        });
      }
    })
    .catch(err => console.error(err));
}

// 5) Listen to the 'locations' collection for changes
let markers = [];  // keep track of markers so we can remove them
function removeAllMarkers() {
  markers.forEach(m => {
    map.removeLayer(m);
  });
  markers = [];
}

db.collection('locations').onSnapshot(snapshot => {
  // Clear existing markers
  removeAllMarkers();

  snapshot.forEach(doc => {
    const data = doc.data();
    const newMarker = L.marker([data.lat, data.lon]).addTo(map)
      .bindPopup(`Name: ${data.name}`);
    markers.push(newMarker);
  });
});

// 6) Once we have a user name, call getLocationAndStore()
if (savedName) {
  getLocationAndStore();
} else {
  // Listen for the Save Name button
  saveNameBtn.addEventListener('click', () => {
    if (userNameInput.value.trim()) {
      getLocationAndStore();
    }
  });
}