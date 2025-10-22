import { createSlice } from "@reduxjs/toolkit";

const superAdminComplaintsSlice = createSlice({
    name: "superAdminComplaintSlice",
    initialState: [],
    reducers: {
        addSuperAdminComplaint: (state, action) => {
            return action.payload;
        },
        updateSuperAdminComplaint: (state, action) => {
            const index = state.findIndex(complaint => complaint._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        removeSuperAdminComplaint: (state, action) => {
            return null;
        }
    }
})
export const { addSuperAdminComplaint, updateSuperAdminComplaint, removeSuperAdminComplaint } = superAdminComplaintsSlice.actions;
export default superAdminComplaintsSlice.reducer;