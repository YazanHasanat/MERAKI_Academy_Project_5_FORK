"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const { id } = useParams();
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
    <div>
      {user.map((ele, index) => {
    return (
      <>
      <div key={index}>First Name: {ele.firstname}</div>
        <div key={index}>Last Name: {ele.lastname}</div>
        <div key={index}>Country: {ele.country}</div>
        <div key={index}>Email: {ele.email}</div>
        <div key={index}>Password: {ele.password}</div>
        <div key={index}>Age:{ele.age}</div>
        
      </>

    );
  })}
    </div>
  );
};

export default user;