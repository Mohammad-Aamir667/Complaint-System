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
          removeUserComplaint:(state,action)=>{
            return null;
        }

    }
})
export const { addUserComplaint, addNewComplaint,removeUserComplaint} = userCompliants.actions;
export default userCompliants.reducer;