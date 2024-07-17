import React from 'react';

function About() {
  return (
    <div className="max-w-2xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">About Redux CRUD App</h1>
      <div className="mb-5">
        <h2 className="text-xl font-bold mb-2">User-Side CRUD Operations</h2>
        <p>
          The Redux CRUD App allows users to perform basic CRUD operations (Create, Read, Update, Delete) on their profile information. Users can update their username, email, password, and profile picture through a user-friendly interface.
        </p>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Admin-Side CRUD Operations</h2>
        <p>
          Admins have additional privileges to manage user accounts and data. They can view a list of all users, edit user details, deactivate or delete user accounts, and perform other administrative tasks to maintain the application.
        </p>
      </div>
    </div>
  );
}

export default About;
