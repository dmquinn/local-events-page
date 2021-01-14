mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/dark-v10",
	center: [event.geometry.coordinates],
	zoom: 4,
});
new mapboxgl.Marker()
	.setLngLat(event.geometry.coordinates)
	.addTo(map)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${event.title}</h3>`)
	)
	.addTo(map);
