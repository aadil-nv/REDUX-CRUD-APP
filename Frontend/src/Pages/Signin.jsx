import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/toast";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../Redux/user/userSlice";
import OAuth from "../Components/OAuth";

function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email && !password) {
      toast({
        description: "Both email and password are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!email) {
      toast({
        description: "Email is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        description: "Email is not valid.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!password) {
      toast({
        description: "Password is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        description: "Password must be at least 6 characters, contain 1 uppercase letter, 1 symbol, and 1 digit.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast({
          description: data.message || "An error occurred.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      dispatch(signInSuccess(data));
      toast({
        description: "Signed in successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast({
        description: "An error occurred. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-extrabold my-7">Sign-In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          id="email"
          onChange={handleChange}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Enter your password"
          id="password"
          onChange={handleChange}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>
    </div>
  );
}

export default Signin;
