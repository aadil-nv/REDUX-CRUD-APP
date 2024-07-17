import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart:(state)=>{
      state.loading = true;
    },
    updateUserSuccess:(state,action)=>{
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateUserFailure:(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart:(state)=>{
      state.loading = true;
    },
    deleteUserSuccess:(state,action)=>{
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    deleteUserFailure:(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
    },
    deleteUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    signOut:(state)=>{
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    }
  },
});

export const {
     signInStart,
     signInSuccess,
     signInFailure,
     updateUserFailure,
     updateUserSuccess,
     updateUserStart ,
     deleteUserFailure,
     deleteUserStart,
     deleteUserSuccess,
     logoutUser,
     deleteUser,
     signOut
    } = userSlice.actions;
export default userSlice.reducer;
