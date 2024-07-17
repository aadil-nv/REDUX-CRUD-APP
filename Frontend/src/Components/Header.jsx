import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../Redux/user/userSlice'; // Ensure this action is defined in your Redux slice

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(logoutUser());
    navigate('/sign-in');
  };

  return (
    <header className="bg-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to={'/'}>
          <h1 className="font-extrabold text-xl text-gray-800">REDUX-CRUD-APP</h1>
        </Link>
        <nav>
          <ul className="flex gap-4 items-center">
            <li>
              <Link to={'/'} className="text-gray-800 hover:text-gray-600">
                Home
              </Link>
            </li>
            <li>
              <Link to={'/about'} className="text-gray-800 hover:text-gray-600">
                About
              </Link>
            </li>
            <li className="flex items-center">
              {!currentUser ? (
                <span
                  onClick={handleSignOut}
                  className="text-gray-800 hover:text-gray-600 cursor-pointer"
                >
                  Sign in
                </span>
              ) : (
                <>
                  <span className="text-gray-800 mr-1 underline hover:text-gray-700"  onClick={() => navigate('/profile')}>{currentUser.username} </span>
                  <img
                    src={currentUser.profilepicture || '/default-profile-picture-url'} // Provide a default profile picture URL
                    alt="profile-pic"
                    className="h-10 w-10 rounded-full object-cover cursor-pointer"
                    onClick={() => navigate('/profile')}
                  />
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
