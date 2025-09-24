import GoogleMapReact from "google-map-react";
import {
  Button,
  Box,
  Typography,
  Paper,
  InputLabel,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
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

interface GetAddressProps {
  onClose?: () => void;
}

export default function GetAddress({ onClose }: GetAddressProps) {
  const [myLocation, setMyLocation] = useState<any>(null);
  const [marker, setMarker] = useState<MarkerType | null>(null);
  const [locationText, setLocationText] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultProps = {
    center: { lat: 31.9539, lng: 35.9106 },
    zoom: 11,
  };

  const getDeviceLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setMarker({ lat: latitude, lng: longitude });

          const addr = await getAddressFromCoords(latitude, longitude);
          setLocationText(addr || "");
          setLoading(false);
        },
        (err) => {
          console.error("Error getting device location:", err);
          setError("Unable to fetch device location. Please select manually.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  const handleMapClick = async ({ lat, lng }: { lat: number; lng: number }) => {
    setMarker({ lat, lng });
    setError("");
    const addr = await getAddressFromCoords(lat, lng);
    if (addr) {
      setLocationText(addr);
    }
  };

  const handleConfirm = async () => {
    if (marker && locationText.trim() !== "") {
      try {
        let result;

        if (myLocation) {
          result = await axios.put(
            "http://localhost:5000/location",
            {
              address: locationText,
              latitude: marker.lat,
              longitude: marker.lng,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        } else {
          result = await axios.post(
            "http://localhost:5000/location",
            {
              address: locationText,
              latitude: marker.lat,
              longitude: marker.lng,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
        }

        setError("");
        setIsEditing(false);
        setMyLocation({
          address: locationText,
          latitude: marker.lat,
          longitude: marker.lng,
        });

        if (onClose) onClose();
      } catch (err) {
        console.error(err);
        setError("Something went wrong while saving your location.");
      }
    } else {
      setError("Please select your location on the map and enter text.");
    }
  };

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBMwLSriIi1nEkpz5YTX78wIPdhL8vE-d4`
      );

      if (response.data.status === "OK") {
        return response.data.results[0].formatted_address;
      } else {
        console.error("Geocoding error:", response.data.status);
        return "";
      }
    } catch (err) {
      console.error("Error in geocoding:", err);
      return "";
    }
  };

  const getLocationById = async () => {
    try {
      const result = await axios.get("http://localhost:5000/location", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (result.data.location) {
        setMyLocation(result.data.location);
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  useEffect(() => {
    getLocationById();
  }, []);

  const hasLocation =
    myLocation &&
    myLocation.address &&
    myLocation.latitude &&
    myLocation.longitude;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography>Welcome {localStorage.getItem("firstName")}</Typography>

      {!hasLocation && !isEditing && (
        <Paper sx={{ padding: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            You haven’t selected a location yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please choose a location on the map or enter it manually.
          </Typography>
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => {
              setIsEditing(true);
              getDeviceLocation(); 
            }}
          >
            Choose Location
          </Button>
        </Paper>
      )}

      {hasLocation && !isEditing && (
        <Paper sx={{ padding: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your current location:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography>Nearest Location: {myLocation.address}</Typography>
            <Typography>Lat: {myLocation.latitude}</Typography>
            <Typography>Lng: {myLocation.longitude}</Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (onClose) onClose();
              }}
            >
              Keep this location
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setIsEditing(true);
                setLocationText(myLocation.address);
                setMarker({
                  lat: myLocation.latitude,
                  lng: myLocation.longitude,
                });
              }}
            >
              Edit
            </Button>
          </Stack>
        </Paper>
      )}

      {isEditing && (
        <>
          <Box
            sx={{
              height: "300px",
              width: "100%",
              borderRadius: "10px",
              overflow: "hidden",
              mb: 2,
            }}
          >
            {loading && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                  backgroundColor: "rgba(255,255,255,0.7)", 
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyBMwLSriIi1nEkpz5YTX78wIPdhL8vE-d4",
              }}
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
            placeholder="E.g. Mosque, Roundabout, School..."
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
        </>
      )}
    </Box>
  );
}
