import { createSlice } from "@reduxjs/toolkit";

const adminComplaintSlice = createSlice({
    name: "adminComplaintSlice",
    initialState: [],
    reducers: {
        addAdminComplaint: (state, action) => {
            console.log("Adding admin complaint:", action.payload);
            return action.payload;
        },
        updateAdminComplaint: (state, action) => {
            console.log("Updating admin complaint:", action.payload);
            const index = state.findIndex(complaint => complaint._id === action.payload._id);
            console.log("Payload ID:", action.payload._id);
console.log("State IDs:", state.map(c => c._id));
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