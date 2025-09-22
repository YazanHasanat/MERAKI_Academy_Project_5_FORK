"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";


type UserType = {
  firstname: string;
  lastname: string;
  country: string;
  email: string;
  password: string;
  age: number;
  role_id?: number;
};



const user = () => {
  const [user, setUser] = useState<UserType[]>([]);
  const getInformation=async()=>{
    const res=await axios.get("http://localhost:5000/users/mypage",{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    setUser(res.data)
    console.log(res.data);
  }
useEffect(()=>{
  getInformation()
},[])


return (
  <Box
    sx={{
      minHeight: "80vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "start",
      padding: 3,
    }}
  >
    <Stack spacing={2} sx={{ width: 400 }}>
      {user.length === 0 && (
        <Typography variant="h6" align="center">
          No user data available.
        </Typography>
      )}

      {user.map((ele, index) => (
        <Card key={index} sx={{ boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              {ele.firstname} {ele.lastname}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Country:</strong> {ele.country}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {ele.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Password:</strong> {ele.password}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Age:</strong> {ele.age}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Box>
);
};

export default user;