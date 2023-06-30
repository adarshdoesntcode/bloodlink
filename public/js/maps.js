

const getUsers = async ()=>{
  const res = await axios({
    method:"GET",
    url:"/admin/unverifiedUsers"
  })

  console.log("cecjshvdc",res);

  let features;

  features =  res.data.data.users.map((user)=>{
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [user.latitude, user.longitude]
      },
      properties: {
        title: user.bloodGroup,
        description: user.address
      }
    }
  })


   const geojson = {
    type: 'FeatureCollection',
    features
  }

  displayMap(geojson)
}


const displayMap = (geojson)=>{


  mapboxgl.accessToken = "pk.eyJ1IjoiZG90YmFzaWMiLCJhIjoiY2xqZ3B5NW8wMDM4bTNxbXpxdHQwZHhldCJ9.k6_x63sVhdrU_ZoFMJzalQ";

  let map = new mapboxgl.Map({
   container: 'map-container', // container ID
   style: 'mapbox://styles/mapbox/streets-v12', // style URL
   center: [85.319612,27.708910], // starting position [lng, lat]
   zoom: 11 // starting zoom
  })
  map.addControl(new mapboxgl.FullscreenControl());
  
  
  // add markers to map
  for (const feature of geojson.features) {
    // create a HTML element for each feature
    const el = document.createElement('div');
    el.className = 'marker';
  
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
  }
}


getUsers()

