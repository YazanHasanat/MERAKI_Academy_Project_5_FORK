"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const user = () => {
  const { id } = useParams();
  const [user,setuser]=useState([])
  const getInformation=async()=>{
    const res=await axios.get("http://localhost:5000/users/mypage",{
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    })
    setuser(res.data)
    console.log(res.data);
  }
useEffect(()=>{
  getInformation()
},[])

  return (
    <div>user
      {user.map((ele)=>{
        return(<div>
        </div>)
      })}
    </div>
  );
};

export default user;