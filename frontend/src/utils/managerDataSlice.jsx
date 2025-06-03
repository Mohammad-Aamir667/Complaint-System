import { createSlice } from "@reduxjs/toolkit";

const managerDataSlice = createSlice({
    name: "managerData",
    initialState: [],
    reducers: {
        addManagerData: (state, action) => {
            return action.payload;
        },
        updateManagerData: (state, action) => {
            const index = state.findIndex(manager => manager._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        removeManagerData: (state, action) => {
            return null;
        }
    }
})
export const { addManagerData, updateManagerData, removeManagerData } = managerDataSlice.actions;
export default managerDataSlice.reducer;