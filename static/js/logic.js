//create title layer for map

let basemap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: "Map data: &copy;"
});

//create the map object
let map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
})

basemap.addTo(map);

// set the if function to determine which color will polulate on the marker based on the depth of the earthquake
function getColor(depth) {
    if(depth > 90) {
        return "#ea2c2c"
    } else if (depth > 70) {
        return "#ea822c"
    } else if (depth > 50) {
        return "#ee9c00"
    } else if (depth > 30) {
        return "eecc00"
    } else if (depth > 10) {
        return "#d4ee00"
    } else {
        return "#98ee00"
    }
}

// set the radius of the marker depending on the magnitude of the earthquake
function getRadius(magnitude) {
    if(magnitude === 0) {
        return 1
    }
    return magnitude * 4
}


//get the geoJson data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  console.log(data);  

  //create a function to determine the style of the markers
  function styleInfo(feature) {
    return{
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.6
    }
  }

  // use the geojson data to determine where to place each marker and set the styles of the markers
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEacFeature: function(feature, layer) {
       layer.bindPopup(`
       Magnitude: ${feature.properties.mag} <br>
       Depth: ${feature.geometry.coordinates[2]} <br>
       Location: ${feature.properties.place} 
       `);
    }
  }).addTo(map);

  //create the legend and add it to the map
  let legend = L.control({
    position: "bottomright"
  });

  //set legend fields based off of depth and color
  legend.onAdd = function(){
    let container = L.DomUtil.create("div", "info legend");
    let grades = [-10, 10, 30, 50, 70, 90];
    let colors = ['#98ee00', '#d4ee00', '#eecc00', '#ee9c00', '#ea822c', '#ea2c2c'];

    //loop through the grades array and add the container to the HTML
    for(let index = 0; index < grades.length; index++){
        container.innerHTML += `<i style="background: ${colors[index]}"></i> ${grades[index]}+ <br>`
    }
    return container;
  }

  legend.addTo(map);
})

