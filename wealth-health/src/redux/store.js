import { configureStore } from "@reduxjs/toolkit";
import newEmployeeReducer from "../features/newEmploye/newEmployeeSlice";

export const store = configureStore({
  reducer: {
    newEmployee: newEmployeeReducer,
  },
});