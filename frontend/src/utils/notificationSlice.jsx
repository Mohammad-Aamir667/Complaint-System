import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: [],
    reducers:{
        addNotifications:(state,action)=>{
                return action.payload;
        },
        updateNotification:(state,action)=>{
            console.log("action",action.payload)
            const index = state.findIndex(c=>c._id === action.payload._id);
            state[index] = action.payload;
        },
        RemoveNotifications:(state,action)=>{
            return [];
        }

    }
})
export const { addNotifications, updateNotification, RemoveNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
