import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast, Progress, Box, Image, Text, Button } from '@chakra-ui/react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../fireBase';

function Edituserdata() {
  const { id } = useParams();
  const fileRef = useRef(null);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [imagePercentage, setImagePercentage] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(true); // Initially true if no password input

  const toast = useToast();

  useEffect(() => {
    fetch(`/api/admin/admin-fetch-userdata/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        // Decrypting the password for display (for demonstration purposes)
        const decryptedPassword = decryptedPassword(data[0].password); // Replace with actual decryption logic
        setFormData({ ...data[0], password: decryptedPassword });
      })
      
  }, [id, toast]);

  useEffect(() => {
    if (image) {
      handleImageUpload();
    }
  }, [image]);

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
          setData([{ ...data[0], profilepicture: downloadURL }]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/admin-update-userdata/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update user');
      }

      toast({
        title: "Profile Update Successful",
        description: "Your profile has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const validatePassword = (password) => {
    // Regex for password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    if (password.trim() === "") {
      setPasswordValidation(true); // No validation if password is empty
    } else {
      const isValid = validatePassword(password);
      setPasswordValidation(isValid);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-extrabold my-7 text-blue-900">
        EDIT USER DATA
      </h1>
      {data.length > 0 ? (
        <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
          <input type="file" ref={fileRef} hidden accept='image/*' onChange={handleFileChange} />
          <Box 
            position="relative"
            width="100px"
            height="100px"
            cursor="pointer"
            onClick={() => fileRef.current.click()}
          >
            <Image
              src={formData.profilepicture || data[0].profilepicture}
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
            defaultValue={data[0].username}
            className="bg-slate-300 p-3 rounded-lg w-full"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Enter your email"
            id="email"
            defaultValue={data[0].email}
            className="bg-slate-300 p-3 rounded-lg w-full"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter new password"
            id="password"
            defaultValue={data[0].password} // Display decrypted password (for demonstration only)
            className="bg-slate-300 p-3 rounded-lg w-full"
            onChange={handlePasswordChange}
          />
          {!passwordValidation && (
            <Text className="text-red-500 text-sm">Password must be at least 6 characters long, include at least one uppercase letter, one digit, and one special symbol.</Text>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            width="full"
            mt={4}
            isLoading={imagePercentage > 0}
            loadingText="Updating"
            isDisabled={!passwordValidation} // Disable button if password validation fails
          >
            UPDATE
          </Button>
        </form>
      ) : (
        <p className="text-center text-lg text-blue-900 font-bold">Loading...</p>
      )}
      {uploadComplete && (
        <Text className="text-center text-lg text-green-600 font-bold mt-4">Upload Complete</Text>
      )}
    </div>
  );
}

export default Edituserdata;
