'use client'
import axios from 'axios'
import React,{ useState } from 'react'
// type Country = {
//   firstName: string
//   lastName: string
//   country: string
//   email: string
//   password: string
//   age: number

// }
const register = async () => {

  const [firstName,setFirstName]=useState<string>("")
  const [lastName,setLastName]=useState<string>("")
  const [country,setCountry]=useState<string>("")
  const [email,setEmail]=useState<string>("")
  const [password,setPassword]=useState<string>("")
  const [age,setAge]=useState<number>()

  const res = await axios.post('http://localhost:5000/users/register',{firstName,lastName,country,email,password,age})
 

  return (
    <>
    <div>register</div>
    <input type ="firstName" name="firstName" placeholder="First Name" onChange={(e) => {
          setFirstName(e.target.value);
        }} />
    <input type ="lastName" name="lastName" placeholder="Last Name" onChange={(e) => {
          setLastName(e.target.value);
        }}  />
    <input type ="country"name="country" placeholder="Country" onChange={(e) => {
          setCountry(e.target.value);
        }} />
    <input type ="email" name="email" placeholder="Email" onChange={(e) => {
          setEmail(e.target.value);
        }}  />
    <input type ="password" name="password" placeholder="Password" onChange={(e) => {
          setPassword(e.target.value);
        }} />
    <input type ="age"name="age" placeholder="Age" onChange={(e) => {
          setAge(e.target.value);
        }} />
    <button >Sin Up</button>
    


        
    </>
  );
};

export default register;