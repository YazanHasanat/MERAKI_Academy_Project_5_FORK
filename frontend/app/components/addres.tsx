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
const Marker = () => (
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
}
