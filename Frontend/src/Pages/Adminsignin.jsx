import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {  adminSignInFailure,adminSignInStart,adminSignInSuccess } from "../Redux/user/adminSlice";

function Adminsignin() {
  const [adminData, setAdminData] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.id]: e.target.value });
  };

  const handleForm = async (e) => {
    e.preventDefault();

    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password validation regex patterns
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!emailRegex.test(adminData.adminemail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!passwordRegex.test(adminData.password)) {
      toast({
        title: "Invalid Password",
        description:
          "Password must be at least 6 characters long and contain at least one uppercase letter, one digit, and one special character.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      dispatch(adminSignInStart())

      const res = await fetch("/api/admin/admin-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "An error occurred while signing in.");
      }

      const data = await res.json();
      

      toast({
        title: "Sign-in Successful",
        description: "You have successfully signed in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      dispatch(adminSignInSuccess(true))
      navigate("/admin-home");
    } catch (error) {
      dispatch(adminSignInFailure(error.message))
      toast({
        title: "Sign-in Error",
        description: error.message || "An error occurred. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-extrabold my-7">ADMIN SIGN-IN</h1>
      <form className="flex flex-col gap-4" onSubmit={handleForm}>
        <input
          type="email"
          placeholder="Enter your email"
          id="adminemail"
          className="bg-gray-200 p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          id="password"
          className="bg-gray-200 p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg uppercase hover:bg-blue-700"
        >
          Sign-in
        </button>
      </form>
    </div>
  );
}

export default Adminsignin;
