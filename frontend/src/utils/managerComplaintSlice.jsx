import { createSlice } from "@reduxjs/toolkit";

const managerComplaintSlice = createSlice({
    name: "managerComplaintSlice",
    initialState: [],
    reducers: {
        addManagerComplaint: (state, action) => {
            console.log("Adding admin complaint:", action.payload);
            return action.payload;
        },
        updateManagerComplaint: (state, action) => {
            const index = state.findIndex(complaint => complaint._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        removeManagerComplaint: (state, action) => {
            return null;
        }
    }
})
export const { addManagerComplaint, updateManagerComplaint, removeManagerComplaint } = managerComplaintSlice.actions;
export default managerComplaintSlice.reducer;