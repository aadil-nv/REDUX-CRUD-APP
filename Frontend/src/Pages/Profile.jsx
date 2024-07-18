import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../fireBase';
import { useToast } from '@chakra-ui/react';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUser, signOut } from '../Redux/user/userSlice';

function Profile() {
  const fileRef = useRef();
  const [image, setImage] = useState(undefined);
  const [imagePercentage, setImagePercentage] = useState(0);
  const [formData, setFormData] = useState({});
  const [uploadComplete, setUploadComplete] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  const validateImage = (file) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.img)$/i;
    if (!allowedExtensions.exec(file.name)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a file with a valid image format (jpg, jpeg, png, img).",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 2 MB.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleImageUpload = async (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
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
        setTimeout(() => setImagePercentage(0), 10);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({ ...prevFormData, profilePicture: downloadURL }));
          setUploadComplete(true);
          setTimeout(() => setImagePercentage(0), 1000);
          toast({
            title: "Image Upload Successful",
            description: "Your profile picture has been updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        });
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateImage(file)) {
      setImage(file);
    }
  };

  const validateForm = () => {
    const { username, email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!username) {
      toast({
        title: "Validation Error",
        description: "Username cannot be empty.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (username.length < 3) {
      toast({
        title: "Validation Error",
        description: "Username must be at least 3 characters long.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!emailRegex.test(email)) {
      toast({
        title: "Validation Error",
        description: "Invalid email format.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (password && !passwordRegex.test(password)) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long and contain at least one uppercase letter, one digit, and one symbol.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/users/update/${currentUser._id}`, {
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
      dispatch(updateUserSuccess(data));
      toast({
        title: "Profile Update Successful",
        description: "Your profile has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast({
        title: "Update Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }
      dispatch(deleteUser());
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('api/auth/sign-out');
      dispatch(signOut());
      toast({
        title: "Signout successfully",
        description: "You have signed out successfully.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Signout Failed",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-extrabold text-center my-7'>Profile</h1>
      <form className='flex flex-col items-center gap-4' onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept='image/*' onChange={handleFileChange} />
        <img
          src={formData.profilePicture || currentUser.profilepicture}
          alt='profile_pic'
          className='h-24 w-24 cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        />
        {imagePercentage > 0 && !uploadComplete && (
          <div className='w-full bg-gray-200 rounded-full mt-4'>
            <div
              className='bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full'
              style={{ width: `${imagePercentage}%` }}
            >
              {imagePercentage}%
            </div>
          </div>
        )}
        <input
          type="text"
          placeholder="username"
          id="username"
          className="bg-slate-300 p-3 rounded-lg w-full"
          defaultValue={currentUser.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="bg-slate-300 p-3 rounded-lg w-full"
          defaultValue={currentUser.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="bg-slate-300 p-3 rounded-lg w-full"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full'>
          UPDATE
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDeleteAccount}>
          Delete Account
        </span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>
          Sign Out
        </span>
      </div>
    </div>
  );
}

export default Profile;
