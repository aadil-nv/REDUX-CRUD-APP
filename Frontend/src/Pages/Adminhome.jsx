import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import Cookies from 'js-cookie'; // Import js-cookie library

function Adminhome() {
  const [usersData, setUsersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch('/api/admin/users-data')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Not authorized');
        }
        return res.json();
      })
      .then((data) => {
        setUsersData(data);
        setFilteredUsers(data); // Initialize filteredUsers with all users on first load
      })
      .catch((error) => {
        console.log(error);
        navigate('/404'); // Redirect to a 404 page or an error page
      });
  }, [navigate]);

  useEffect(() => {
    const results = usersData.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id.includes(searchTerm)
    );
    setFilteredUsers(results);
  }, [searchTerm, usersData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRemoveUser = async (id) => {
    try {
      const res = await fetch(`/api/admin/delete-user/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      setUsersData(usersData.filter((user) => user._id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== id));

      toast({
        title: 'Account Deleted',
        description: 'The account has been deleted.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleOpenConfirmation = (id) => {
    setSelectedUserId(id);
    onOpen();
  };

  const handleConfirmDelete = () => {
    handleRemoveUser(selectedUserId);
    onClose();
  };

  const handleSignOut = async () => {
    try {
        await fetch('api/admin/admin-signout');
        
        toast({
          title: "Sign Out Successfulll 235235235",
          description: "You have been signed out53255535.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate('/admin-signin')
    } catch (error) {
      toast({
        title: 'Sign Out Failed',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <h1 className="text-2xl font-bold text-center py-4 bg-blue-500 text-white">USERS LIST</h1>
        <div className="p-4 flex justify-between items-center">
          <div className="flex">
            <Link to={'/add-newuser'}>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
                Add User
              </button>
            </Link>
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Search by username, email, or ID"
              className="bg-gray-200 px-3 py-2 rounded-md"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-700 transition duration-200">
              Search
            </button>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No data found</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Picture</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={user.profilepicture} alt={user.username} className="h-10 w-10 rounded-full object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link to={`/edit-userdata/${user._id}`}>
                          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">Edit</button>
                        </Link>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                          onClick={() => handleOpenConfirmation(user._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this user? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Button
        position="fixed"
        top="4"
        right="4"
        onClick={handleSignOut}
        colorScheme="red"
        variant="outline"
      >
        Sign Out
      </Button>
    </div>
  );
}

export default Adminhome;
