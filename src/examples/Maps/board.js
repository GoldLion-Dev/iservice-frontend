import { Card } from '@mui/material';
import MDBox from 'components/MDBox';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import React, { useEffect, useRef } from 'react';

const GoogleMapBoardComponent = React.forwardRef(({ devices, selectedRow, onSelectRow }, ref) => {
  const mapRef = ref || useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Define a custom pin icon
  const customPin = (color) => {
    return {
      path: 'M8 12l-2-2V4a4 4 0 1 1 8 0v6l-2 2z',
      fillColor: color,
      fillOpacity: 0.6,
      strokeWeight: 2,
      strokeColor: '#fff',
      scale: 2, // Size of the icon
    };
  };

  const initMap = () => {
    const defaultLocation = { lat: 0, lng: 0 };
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 2,
      center: defaultLocation,
    });

    const bounds = new window.google.maps.LatLngBounds();

    markersRef.current = devices.map(device => {
      let lat = device?.attributes?.EntityAddressItem?.Address?.latitude;
      let lng = device?.attributes?.EntityAddressItem?.Address?.longitude;
      const { name, device_id } = device?.attributes;
      let alert = device.alert;
      const location = { lat: parseFloat(lat), lng: parseFloat(lng) };

      bounds.extend(location);

      // Determine the pin color based on device alert
      const pinColor = alert ? 'red' : 'blue';

      const marker = new window.google.maps.Marker({
        position: location,
        map: mapInstanceRef.current,
        title: `${name} #${device_id}`,
        icon: customPin(pinColor), // Use custom pin color based on alert validity
      });

      // Add click event listener to marker
      marker.addListener('click', () => {
        onSelectRow(device); // Call the callback function with the selected device
      });

      return marker;
    });

    // Adjust the map to fit all markers
    mapInstanceRef.current.fitBounds(bounds);
  };

  const updateMap = () => {
    if (!selectedRow || !mapInstanceRef.current) return;

    let lat = selectedRow?.attributes?.EntityAddressItem?.Address?.latitude;
    let lng = selectedRow?.attributes?.EntityAddressItem?.Address?.longitude;
    const pinLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };

    // Highlight the selected device
    markersRef.current.forEach(marker => {
        // Determine the pin color based on device alert
        const device = devices.find(item => parseFloat(item?.attributes?.EntityAddressItem?.Address?.latitude) === marker.position.lat() && parseFloat(item?.attributes?.EntityAddressItem?.Address?.longitude) === marker.position.lng());
        console.log(devices, device, marker.position.lat(), marker.position.lng(), '=================')
        const pinColor = device?.alert ? 'red' : 'blue';
        marker.setIcon(customPin(pinColor)); // Reset others to default
    });

    // Center and zoom the map on the selected row
    mapInstanceRef.current.setCenter(pinLocation);
    mapInstanceRef.current.setZoom(20);
  };

  useEffect(() => {
    const loadGoogleMapScript = () => {
      if (window.google && window.google.maps) {
        initMap(); // Call initMap if Google Maps API is already loaded
      } else {
        window.initMap = initMap; // Define initMap globally
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBwzbz3UcUkp4l5qsD0clePzJZtyLIhf9U&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
          // Clean up the script when the component unmounts
          document.head.removeChild(script);
        };
      }
    };

    loadGoogleMapScript();

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [devices]);

  useEffect(() => {
    updateMap();
  }, [selectedRow]);

  const formatAddress = (address) => {  
    const parts = [  
      address?.street_address1,  
      address?.street_address2,  
      address?.city,  
      address?.state,  
      address?.postal_code,  
      address?.country  
    ];  
  
    // Filter out any empty or undefined values  
    const filteredParts = parts.filter(part => part);  
  
    // Join the remaining parts with a comma  
    return filteredParts.join(', ');  
  }; 

  return (
    <MDBox ref={mapRef} style={{ height: '40vh', width: '100%' }}>
      {selectedRow && (
        <Card sx={{ position: 'absolute', bottom: 16, left: 16, padding: 2, backgroundColor: 'white' }}>          
          <MDTypography fontSize sx={{ fontSize: '20px' }}>{selectedRow.attributes.name} #{selectedRow.attributes.device_id}</MDTypography>
          <MDTypography fontSize sx={{ fontSize: '15px' }}>Address: {formatAddress(selectedRow.attributes?.EntityAddressItem?.Address)}</MDTypography>
          <MDTypography fontSize sx={{ fontSize: '15px' }}>Inch Level: {selectedRow.paramValue?.value?.device_data?.inch_level}</MDTypography>
          <MDTypography fontSize sx={{ fontSize: '15px' }}>Volume Level: {selectedRow.paramValue?.value?.device_data?.volume_level}</MDTypography>
          <MDTypography fontSize sx={{ fontSize: '15px' }}>Percent Level: {selectedRow.paramValue?.value?.device_data?.percent_level}</MDTypography>
          <MDTypography fontSize sx={{ fontSize: '15px' }}>Battery Status: {selectedRow.paramValue?.value?.device_data?.battery_status}</MDTypography>
          <MDTypography fontSize sx={{ fontSize: '15px' }}>Battery Voltage: {selectedRow.paramValue?.value?.device_data?.battery_voltage}</MDTypography>
          <MDTypography fontSize sx={{ fontSize: '15px' }}>Wifi Signal: {selectedRow.paramValue?.value?.wifi_signal}</MDTypography>
          <MDTypography fontSize sx={{ fontSize: '15px' }}>Reported: {selectedRow.paramValue?.value?.tx_reported}</MDTypography>
          <MDTypography fontSize sx={{ fontSize: '15px' }}>Last Updated: {selectedRow.paramValue?.value?.last_updated_on}</MDTypography>
          <MDButton color="dark" onClick={() => onSelectRow(null)}>Close</MDButton>
          {/* Add more fields as needed */}
        </Card>
      )}
    </MDBox>
  );
});

export default GoogleMapBoardComponent;
