import React, { useRef, useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../fireBase';
import { useToast, Progress, Box, Image, Text, Button } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

function Addnewuser() {
  const fileRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [imagePercentage, setImagePercentage] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateImage(file)) {
      setImage(file);
    }
  };

  const validateImage = (file) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.img)$/i;
    if (!allowedExtensions.exec(file.name)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPG, JPEG, PNG, or IMG file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 2MB.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (image) {
      handleImageUpload();
    }
  }, [image]);

  const handleImageUpload = async () => {
    if (!image) return;

    const storage = getStorage(app);
    const filename = new Date().getTime() + image.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercentage(Math.round(progress));
        setUploadComplete(false);
      },
      (error) => {
        toast({
          title: "Image Upload Failed",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setImagePercentage(0);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({ ...prevFormData, profilepicture: downloadURL }));
          setUploadComplete(true);
          setImagePercentage(0);
          toast({
            title: "Image Upload Complete",
            description: "The image has been uploaded successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          // Clear upload complete message after 3 seconds
          setTimeout(() => setUploadComplete(false), 3000);
        });
      }
    );
  };

  const handleFormData = async (e) => {
    e.preventDefault();

    // Validation
    const { username, email, password } = formData;

    if (!username || !email || !password) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (username.trim().length < 3) {
      toast({
        title: "Validation Error",
        description: "Username must be at least 3 characters long and not contain only spaces.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email) || email.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(password)) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long and contain 1 uppercase letter, 1 digit, and 1 special character.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch('/api/admin/admin-add-userdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add new user');
      }

      toast({
        title: "New user added Successful",
        description: "Your profile has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Clear the form
      setFormData({});
      setImage(null);
      fileRef.current.value = null;

    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      // navigate('/admin-signin');
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-extrabold my-7 text-blue-900">
        ADD NEW USER
      </h1>

      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleFormData}
      >
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <Box 
          position="relative"
          width="100px"
          height="100px"
          cursor="pointer"
          onClick={() => fileRef.current.click()}
        >
          <Image
            src={formData.profilepicture || "https://via.placeholder.com/50"}
            alt="profile_pic"
            borderRadius="full"
            boxSize="100px"
            objectFit="cover"
          />
          {imagePercentage > 0 && (
            <Progress
              value={imagePercentage}
              size="xs"
              colorScheme="blue"
              position="absolute"
              bottom="0"
              width="100%"
            />
          )}
        </Box>
        <input
          type="text"
          placeholder="Enter your name"
          id="username"
          value={formData.username || ""}
          className="bg-slate-300 p-3 rounded-lg w-full"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Enter your email"
          id="email"
          value={formData.email || ""}
          className="bg-slate-300 p-3 rounded-lg w-full"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Enter new password"
          id="password"
          value={formData.password || ""}
          className="bg-slate-300 p-3 rounded-lg w-full"
          onChange={handleChange}
        />

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
          mt={4}
          isLoading={imagePercentage > 0}
          loadingText="Adding User"
        >
          ADD NEW USER
        </Button>
      </form>

      {uploadComplete && (
        <Text className="text-center text-lg text-green-600 font-bold mt-4">Upload Complete</Text>
      )}
    </div>
  );
}

export default Addnewuser;
