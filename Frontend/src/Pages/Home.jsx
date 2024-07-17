import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

function Home() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-lg p-8 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to MERN Auth App  {!currentUser ? "" :` Mr/Ms ${currentUser.username}` }</h1>
        <p className="text-lg mb-6">
          This is a MERN stack authentication application created for training purposes by Muhammed Aadil NV, a full-stack developer.
        </p>
        <p className="text-gray-600">
          Explore the features and functionalities, and learn more about building full-stack applications with MongoDB, Express.js, React, and Node.js.
        </p>
      </div>
    </div>
  );
}

export default Home;
