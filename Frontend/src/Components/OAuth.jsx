import React from "react";
import { useToast } from "@chakra-ui/toast";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../fireBase";
import { useDispatch } from "react-redux";
import { signInStart, signInSuccess } from "../Redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function OAuth() {

    const toast = useToast();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick =async (e)=>{
      e.preventDefault()
        try {

            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result =  await signInWithPopup(auth,provider)
            const res = await fetch('/api/auth/google-auth',{
                method:"POST", headers : {"Content-type":"application/json"},
                body : JSON.stringify({
                    name : result.user.displayName,
                    email: result.user.email,
                    photo : result.user.photoURL
                })
            })

            const data = await res.json();
         
            dispatch(signInSuccess(data));
            navigate('/')

            
        } catch (error) {
            console.log("could login with google",error);
            toast({description: error.message || "An error occurred.",status: "error",duration: 3000,});
        }
    }
  return (
    <div>
      <button className="bg-red-700 text-white p-3  rounded-lg uppercase hover:opacity-95 w-full "  
      onClick={handleGoogleClick}>
        Continue with google
      </button>
    </div>
  );
}

export default OAuth;
