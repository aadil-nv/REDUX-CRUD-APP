import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/toast";
import OAuth from "../Components/OAuth";

function Signup() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[A-Za-z0-9@#$%^&*()_+=[\]{}|\\,.?: -]{3,}$/;
    return usernameRegex.test(username);
  };
  

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.trim().length > 0;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password) && password.trim().length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;

    if (!validateUsername(username)) {
      toast({
        description: "Username must be at least 3 characters long and contain only letters.",
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
      setLoading(true);
      setError(false);

      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(true);
        toast({
          description: data.message || "An error occurred.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      toast({
        description: "Account created successfully. Please sign in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(true);
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
      <h1 className="text-3xl text-center font-extrabold my-7">Sign-Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          id="username"
          onChange={handleChange}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="Enter your email"
          id="email"
          onChange={handleChange}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Enter new password"
          id="password"
          onChange={handleChange}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
