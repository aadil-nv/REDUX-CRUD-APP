import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 
  currentAdmin:null,
  loading: false,
  error: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    
    adminSignInStart: (state) => {
      state.loading = true;
    },
    adminSignInSuccess: (state, action) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = false;
    },
    adminSignInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
    
  },
});

export const {
     
     adminSignInFailure,
     adminSignInSuccess,
     adminSignInStart
    
    } = adminSlice.actions;
export default adminSlice.reducer;
