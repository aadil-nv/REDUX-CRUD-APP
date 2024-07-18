import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Profile from "./Pages/Profile";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import Header from "./Components/Header";
import PrivateRoutes from "./Components/PrivateRoutes";
import Adminsignin from "./Pages/Adminsignin";
import Adminhome from "./Pages/Adminhome";
import Edituserdata from "./Pages/Edituserdata";
import Addnewuser from "./Pages/Addnewuser";
import Page404 from "./Pages/Page404";
import AdminPrivateRoutes from "./Components/AdminPrivateRoutes";


function App() {
  return (
    <BrowserRouter>
    
        
      <Routes>
        <Route  path="/"  element={<><Header/><Home/></>} />
        <Route  path="/about"  element={ <><Header/><About/> </>} />
        <Route  path="/sign-in"  element={  <> <Header/>    <Signin/> </>} />
        <Route  path="/sign-up"  element={  <><Header/>   <Signup/> </>} />
        <Route element={<PrivateRoutes/>} ><Route  path="/profile"  element={ <> <Header/>   <Profile/> </>} /></Route>
      

        <Route  path="/admin-signin"  element={<Adminsignin/>} />
        <Route element={<AdminPrivateRoutes/>}> <Route  path="/admin-home"  element={<Adminhome/>} /> </Route>
        <Route element={<AdminPrivateRoutes/>}> <Route  path="/edit-userdata/:id"  element={<Edituserdata/>} /> </Route>
      <Route element={<AdminPrivateRoutes/>}> <Route  path="/admin-add-userdata"  element={<Addnewuser/>} /> </Route>
       
        <Route  path="/404"  element={<Page404/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
