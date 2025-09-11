import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [], 
};

const newEmployeeSlice = createSlice({
  name: "newEmployee",
  initialState,
  reducers: {
    addEmployee(state, action) {
      state.employees.push(action.payload);
    },
    setEmployees(state, action) {
      state.employees = Array.isArray(action.payload) ? action.payload : [];
    },
    resetEmployees(state) {
      state.employees = [];
    },
  },
});

export const { addEmployee, setEmployees, resetEmployees } = newEmployeeSlice.actions;

export const selEmployees = (state) => state.newEmployee.employees;

export default newEmployeeSlice.reducer;
