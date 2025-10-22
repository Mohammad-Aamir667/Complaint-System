import { createSlice } from "@reduxjs/toolkit";

const adminComplaintSlice = createSlice({
    name: "adminComplaintSlice",
    initialState: [],
    reducers: {
        addAdminComplaint: (state, action) => {
            return action.payload;
        },
        updateAdminComplaint: (state, action) => {
            const index = state.findIndex(complaint => complaint._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        removeAdminComplaint: (state, action) => {
            return null;
        }
    }
})
export const { addAdminComplaint, removeAdminComplaint, updateAdminComplaint } = adminComplaintSlice.actions;
export default adminComplaintSlice.reducer;