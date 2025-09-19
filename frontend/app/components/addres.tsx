import GoogleMapReact from "google-map-react";
import {
  Button,
  Box,
  Typography,
  Paper,
  InputLabel,
  TextField,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
interface MarkerProps {
  lat: number;
  lng: number;
}
const Marker: React.FC<MarkerProps> = () => (
  <div
    style={{
      color: "white",
      padding: "5px 8px",
      borderRadius: "50%",
      fontSize: "20px",
      textAlign: "center",
      transform: "translate(-50%, -50%)",
    }}
  >
    📍
  </div>
);
interface MarkerType {
  lat: number;
  lng: number;
}
export default function GetAddress() {
    
  const defaultProps = {
    center: { lat: 31.9539, lng: 35.9106 },
    zoom: 12,
  };
  const [marker, setMarker] = useState<MarkerType | null>(null);
  const [locationText, setLocationText] = useState("");
  const [error, setError] = useState("");
  const handleMapClick = ({ lat, lng }: { lat: number; lng: number }) => {
    setMarker({ lat, lng });
    setError("");
  };
  const handleConfirm = async () => {
    if (marker && locationText.trim() !== "") {
      const result = await axios.post("http://localhost:5000/location", {
        user_id: 1,
        address: locationText,
        latitude: marker.lat,
        longitude: marker.lng,
      });
      console.log("Location confirmed:", result.data);
      setError("");
    } else {
      setError("Please select your location on the map or write it.");
    }
  };
  return (
    <Box sx={{ padding: 3 }}>
      <Paper sx={{ padding: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Select Delivery Address
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click on the map or write your location.
        </Typography>
      </Paper>

      <Box
        sx={{
          height: "300px",
          width: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          mb: 2,
        }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBMwLSriIi1nEkpz5YTX78wIPdhL8vE-d4" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          onClick={handleMapClick}
        >
          {marker && <Marker lat={marker.lat} lng={marker.lng} />}
        </GoogleMapReact>
      </Box>

      <InputLabel
        sx={{ mb: 1, textAlign: "left", color: "black", fontSize: "18px" }}
      >
        Enter your nearest location:
      </InputLabel>
      <TextField
        fullWidth
        value={locationText}
        onChange={(e) => setLocationText(e.target.value)}
        placeholder="Like Mosque, Roundabout, School..."
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{
          mt: 2,
          height: "50px",
          fontSize: "16px",
          borderRadius: "10px",
        }}
        onClick={handleConfirm}
      >
        Confirm Location
      </Button>
    </Box>
  );
}
