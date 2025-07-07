const apiKey = "TfN3q4DvUvVtAUPeo3hFXl7DTA4QfsaE";

var map = tt.map({
    key: apiKey,
    container: "map",
    center: [77.5946, 12.9716], 
    zoom: 12
});

map.addControl(new tt.NavigationControl());

// Get recommended center type from URL
const urlParams = new URLSearchParams(window.location.search);
const recommendedType = urlParams.get('type');

const recyclingCenters = [
    {
        name: "Zolopik E-Waste Recycling",
        coords: [77.6010, 12.9604],
        phone: "8884449985",
        address: "Koramangala, Bengaluru",
        types: ["Mobile", "Player"]
    },
    {
        name: "Saahas Zero Waste",
        coords: [77.6452, 12.9280],
        phone: "080 41689889",
        address: "HSR Layout, Bengaluru",
        types: ["Microwave"]
    },
    {
        name: "E-Scrappy Recyclers",
        coords: [77.5802, 12.9206],
        phone: "1800 572 9298",
        address: "JP Nagar, Bengaluru",
        types: []
    },
    {
        name: "Gravity E-Waste Management",
        coords: [77.6956, 12.8352],
        phone: "080 23456789",
        address: "Whitefield, Bengaluru",
        types: ["Battery"]
    },
    {
        name: "Earth Sense Recycle",
        coords: [77.5004, 12.8501],
        phone: "080 41234567",
        address: "Yeshwanthpur, Bengaluru",
        types: ["Washing Machine"]
    },
    {
        name: "E-Parisara Pvt Ltd",
        coords: [77.4653, 12.9103],
        phone: "080 27839999",
        address: "Peenya, Bengaluru",
        types: ["PCB", "Television"]
    },
    {
        name: "Ash Recyclers",
        coords: [77.6892, 12.9865],
        phone: "080 26789012",
        address: "Indiranagar, Bengaluru",
        types: ["Keyboard", "Mouse"]
    },
    {
        name: "Eco-Ewaste Recyclers India Pvt Ltd",
        coords: [77.6208, 12.9309],
        phone: "080 29012345",
        address: "Jayanagar, Bengaluru",
        types: ["Printer"]
    }
];

// Create custom icon for highlighted marker
const customIcon = document.createElement('div');
customIcon.className = 'custom-marker';
customIcon.style.width = '30px';
customIcon.style.height = '30px';
customIcon.style.backgroundColor = '#FF5733'; // Orange-red color
customIcon.style.borderRadius = '50%';
customIcon.style.border = '3px solid white';
customIcon.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';

recyclingCenters.forEach(center => {
    // Check if this is the recommended center
    const isRecommended = recommendedType && center.types.includes(recommendedType);
    
    var marker = new tt.Marker({
        element: isRecommended ? customIcon.cloneNode(true) : undefined
    })
    .setLngLat(center.coords)
    .addTo(map);

    var popupContent = `
        <strong>${center.name}</strong><br>
        📞 <a href="tel:${center.phone}">${center.phone}</a><br>
        📍 ${center.address}
        ${isRecommended ? '<br><span style="color:rgb(90, 230, 72); font-weight: bold;">★ Recommended for your item</span>' : ''}
    `;

    var popup = new tt.Popup({ offset: 35 })
        .setHTML(popupContent);

    marker.setPopup(popup);
});