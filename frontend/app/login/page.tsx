"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

 const Login=()=> {
  const router = useRouter();

  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      console.log("login success", response.data);

      
      router.push("/"); 
    } catch (error: any) {
      console.error("login error", error.message);
    }
  };

  return (
    <>
      <h2>Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Sign In</button>
    </>
  );
}

export default Login;