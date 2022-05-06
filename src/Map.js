import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "./Map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFydmluMTkwMDEiLCJhIjoiY2wyZWNoaDh3MTZ1bTNqbGFlb2VtdjkzdyJ9.xv0Q840ksCmbWY7HX_l2sQ";

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(5);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(1.5);
  const [routeDistance, setRouteDistance] = useState(0);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    // Add directiions control
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/driving",
      controls: { instructions: false, profileSwitcher: false },
    });
    map.addControl(directions, "top-left");

    // Docs for route event is here:
    // https://github.com/mapbox/mapbox-gl-directions/blob/master/API.md#on`enter code here`
    directions.on("route", (e) => {
      // routes is an array of route objects as documented here:
      // https://docs.mapbox.com/api/navigation/#route-object
      let routes = e.route;
      let rDistance = routes.map((r) => r.distance);

      // logs the route distance
      console.log("rDistance", rDistance);

      // Save the distance
      setRouteDistance(rDistance);
    });

    // Get center coordinates of the map
    // map.on("move", () => {
    //   setLng(map.getCenter().lng.toFixed(4));
    //   setLat(map.getCenter().lat.toFixed(4));
    //   setZoom(map.getZoom().toFixed(2));
    // });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="map-container" ref={mapContainerRef} />
      <div className="sidebarStyle">
        <div>Distance: {routeDistance}</div>
      </div>
    </div>
  );
};

export default Map;
