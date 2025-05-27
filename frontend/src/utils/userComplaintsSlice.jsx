import { createSlice } from "@reduxjs/toolkit";

const userCompliants = createSlice({
    name: "userCompliants",
    initialState: [],
    reducers:{
        addUserComplaint:(state, action) => {
            return action.payload;      
          },
          addNewComplaint: (state, action) => {
            state.push(action.payload);
          },
          

    }
})
export const { addUserComplaint, addNewComplaint} = userCompliants.actions;
export default userCompliants.reducer;