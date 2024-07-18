import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom';

function AdminPrivateRoutes() {

    const {currentAdmin} = useSelector(state => state.admin);
    console.log("current adminn is ---"+currentAdmin);
  return currentAdmin ? <Outlet  /> : <Navigate to={'/admin-signin'}/>
}

export default AdminPrivateRoutes
