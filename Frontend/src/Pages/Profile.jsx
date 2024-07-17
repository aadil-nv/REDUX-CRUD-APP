import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../fireBase';
import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button } from '@chakra-ui/react';
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

  // Confirmation Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const onOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const onCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const onOpenSignOutModal = () => setIsSignOutModalOpen(true);
  const onCloseSignOutModal = () => setIsSignOutModalOpen(false);

  // Validate Username
  const validateUsername = (username) => {
    // Your username validation logic here
    return /^[A-Za-z0-9]{3,}$/.test(username);
  };

  // Validate Email
  const validateEmail = (email) => {
    // Email syntax validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  

  // Validate Password
  const validatePassword = (password) => {
    // Your password validation logic here
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?!.*\s).{6,}$/.test(password);
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (validateImage(file)) {
      setImage(file);
    }
  };

  // Image Validation
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

  // Handle Image Upload
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

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateUsername(formData.username)) {
      toast({
        title: "Invalid Username",
        description: "Username should be at least 3 characters long and contain only alphanumeric characters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!validatePassword(formData.password)) {
      toast({
        title: "Invalid Password",
        description: "Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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

  // Handle Delete Account
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

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await fetch('api/auth/sign-out');
      dispatch(signOut());
      toast({
        title: "Sign Out Successful",
        description: "You have been signed out.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Sign Out Failed",
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
        {/* Profile Picture Upload */}
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
        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-300 p-3 rounded-lg w-full"
          defaultValue={currentUser.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        {/* Email Input */}
        <input
          type="text"
          placeholder="Email"
          id="email"
          className="bg-slate-300 p-3 rounded-lg w-full"
          defaultValue={currentUser.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-300 p-3 rounded-lg w-full"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {/* Submit Button */}
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 w-full'>
          UPDATE
        </button>
      </form>
      {/* Delete Account and Sign Out Buttons */}
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={onOpenDeleteModal}>
          Delete Account
        </span>
        <span className='text-red-700 cursor-pointer' onClick={onOpenSignOutModal}>
          Sign Out
        </span>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Account Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete your account? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteAccount}>
              Confirm
            </Button>
            <Button onClick={onCloseDeleteModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Sign Out Confirmation Modal */}
      <Modal isOpen={isSignOutModalOpen} onClose={onCloseSignOutModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Sign Out</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to sign out?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSignOut}>
              Confirm
            </Button>
            <Button onClick={onCloseSignOutModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}

export default Profile;
