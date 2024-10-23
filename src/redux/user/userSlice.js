import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    signInSuccess: (state, action) => {
    
      console.log(action.payload,'sucessssssssssssssssssss');
      
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {

      console.log(action, 'updateUserSuccesssssssssssssssss');
      
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
   
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
  
  },
  deleteUserFailure: (state, action) => {
    state.error = action.payload;
    state.loading = false;
  },
  signoutUserStart: (state) => {
    state.loading = true;
  },
 
  singnoutUserSuccess: (state) => {
    state.currentUser = null;
    state.loading = false;
    state.error = null;

},
signoutUserFailure: (state, action) => {
  state.error = action.payload;
  state.loading = false;
}
},
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  singnoutUserSuccess,
  signoutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
