import { createSlice } from "@reduxjs/toolkit";

const employeeDataSlice = createSlice({
    name: "employeeData",
    initialState: [],
    reducers: {
        addEmployeeData: (state, action) => {
            return action.payload;
        },
        updateEmployeeData: (state, action) => {
            const index = state.findIndex(manager => manager._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        removeEmployeeData: (state, action) => {
            return null;
        }
    }
})
export const { addEmployeeData, updateEmployeeData, removeEmployeeData } = employeeDataSlice.actions;
export default employeeDataSlice.reducer;