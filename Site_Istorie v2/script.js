// Menu Toggle Functionality
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu');
const sideMenu = document.getElementById('side-menu');

if (menuToggle && closeMenu && sideMenu) {
    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });

    closeMenu.addEventListener('click', () => {
        sideMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
    });
}

// Page Transitions
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (main) {
        // Initial page load animation
        main.style.transform = 'translateX(100%)';
        main.style.opacity = '0';
        
        requestAnimationFrame(() => {
            main.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            main.style.transform = 'translateX(0)';
            main.style.opacity = '1';
        });
    }

    // Internal Links Transition
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.href;
                
                // Slide out current page
                main.style.transform = 'translateX(-100%)';
                main.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = target;
                }, 500);
            });
        }
    });
});

// Add this to prevent transition on back/forward navigation
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const main = document.querySelector('main');
        main.style.transition = 'none';
        main.style.transform = 'translateX(0)';
        main.style.opacity = '1';
    }
});


var map = L.map('map', {
    center: [54, 15], // Center on Europe
    zoom: 4,
    zoomControl: false, // Disable zoom controls
    dragging: false, // Disable panning
    scrollWheelZoom: false, // Disable scroll zoom
    doubleClickZoom: false, // Disable double-click zoom
    boxZoom: false, // Disable shift + drag zoom
    touchZoom: false, // Disable pinch zoom
    maxBounds: [[72, -25], [32, 50]], // Prevents scrolling outside Europe
    maxBoundsViscosity: 1.0
});

// Add a light-colored tile layer (optional)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors & Carto'
}).addTo(map);

// Countries to highlight with links
var highlightedCountries = {
    "Germany": "nazism.html",
    "Italy": "fascism.html",
    "Russia": "comunism.html",
    "Romania": "comunism.html"
};

var info = L.control();
info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function(country) {
    this._div.innerHTML = country ? `<strong>${country}</strong>` : "";
    this._div.style.opacity = country ? "1" : "0";
};
info.addTo(map);

// Add this tooltip div to your map
var tooltip = L.DomUtil.create('div', 'country-tooltip');
document.querySelector('#map').appendChild(tooltip);

// Define Moscow coordinates
const moscowCoords = { lat: 55.7558, lng: 37.6173 };

// Update tooltip styles
const tooltipStyles = `
.country-tooltip {
    position: absolute;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.2);
    pointer-events: none;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 1000;
    max-width: min(300px, 80vw);
    font-size: 14px;
    text-align: center;
}

@media (max-width: 768px) {
    .country-tooltip {
        font-size: 12px;
        padding: 10px;
    }
}`;

// Add the styles programmatically
const styleSheet = document.createElement('style');
styleSheet.textContent = tooltipStyles;
document.head.appendChild(styleSheet);

// Define tooltip content for each country
var countryInfo = {
    "Germany": "Germania nazistă sub conducerea lui Hitler a fost responsabilă pentru Holocaust și a declanșat Al Doilea Război Mondial.",
    "Italy": "Italia fascistă condusă de Mussolini a introdus primul regim fascist din istorie.",
    "Russia": "Rusia sovietică a fost primul stat comunist din lume, sub conducerea lui Lenin și apoi Stalin.",
    "Romania": "România comunistă a fost sub conducerea lui Gheorghe Gheorghiu-Dej și Nicolae Ceaușescu."
};

// Load GeoJSON file
$.getJSON("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json", function(data) {
    L.geoJSON(data, {
        style: function(feature) {
            var countryName = feature.properties.name;
            return {
                fillColor: highlightedCountries[countryName] ? "#003366" : "#ffffff", // Highlighted countries in deep blue
                color: "#555", // Border color
                weight: 1,
                fillOpacity: 1,
                transition: "fill-opacity 0.3s ease-in-out"
            };
        },
        onEachFeature: function(feature, layer) {
            var countryName = feature.properties.name;
            let tooltipTimeout;

            if (highlightedCountries[countryName]) {
                layer.on({
                    mouseover: function(e) {
                        // Clear any existing timeout
                        if (tooltipTimeout) {
                            clearTimeout(tooltipTimeout);
                        }

                        var layer = e.target;
                        layer.setStyle({
                            fillColor: "#0055AA",
                            fillOpacity: 0.8
                        });
                        info.update(countryName);

                        // Show and position tooltip
                        tooltip.style.display = 'block';
                        tooltip.innerHTML = countryInfo[countryName];

                        // Get position based on country
                        let position;
                        if (countryName === "Russia") {
                            position = map.latLngToContainerPoint([moscowCoords.lat, moscowCoords.lng]);
                        } else {
                            var bounds = layer.getBounds();
                            var center = bounds.getCenter();
                            position = map.latLngToContainerPoint(center);
                        }

                        // Position tooltip
                        requestAnimationFrame(() => {
                            tooltip.style.left = (position.x - tooltip.offsetWidth/2) + 'px';
                            tooltip.style.top = (position.y - tooltip.offsetHeight - 20) + 'px';
                            tooltip.style.opacity = '1';
                            tooltip.style.transform = 'translateY(0)';
                        });
                    },
                    mouseout: function(e) {
                        var layer = e.target;
                        layer.setStyle({
                            fillColor: "#003366",
                            fillOpacity: 1
                        });
                        info.update();

                        // Delay hiding tooltip
                        tooltipTimeout = setTimeout(() => {
                            tooltip.style.opacity = '0';
                            tooltip.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                if (tooltip.style.opacity === '0') {
                                    tooltip.style.display = 'none';
                                }
                            }, 300);
                        }, 100);
                    },
                    mousemove: function(e) {
                        // Clear any hide timeout when moving within the country
                        if (tooltipTimeout) {
                            clearTimeout(tooltipTimeout);
                        }
                    },
                    click: function() {
                        window.location.href = highlightedCountries[countryName];
                    }
                });
            }
        }
    }).addTo(map);
});