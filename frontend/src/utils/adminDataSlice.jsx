import { createSlice } from "@reduxjs/toolkit";

const adminDataSlice = createSlice({
    name: "adminData",
    initialState: [],
    reducers: {
        addAdminData: (state, action) => {
            return action.payload;
        },
        updateAdminData: (state, action) => {
            const index = state.findIndex(admin => admin._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        removeAdminData: (state, action) => {
            return null;
        }
    }
})
export const { addAdminData, updateAdminData, removeAdminData } = adminDataSlice.actions;
export default adminDataSlice.reducer;