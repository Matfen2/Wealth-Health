import { createSlice, createSelector } from "@reduxjs/toolkit";

const STORAGE_KEY = "hrnet_employees";

const load = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};
const save = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.employees));
  } catch {}
};

const newEmployeeSlice = createSlice({
  name: "newEmployee",
  initialState: {
    employees: load(), 
  },
  reducers: {
    setEmployees(state, action) {
      state.employees = Array.isArray(action.payload) ? action.payload : [];
      save(state);
    },
    addEmployee(state, action) {
      const next = { ...action.payload, id: String(action.payload?.id ?? state.employees.length + 1) };
      state.employees.push(next);
      save(state);
    },
    clearAll(state) {
      state.employees = [];
      save(state);
    },
  },
});

export const { setEmployees, addEmployee, clearAll } = newEmployeeSlice.actions;
export default newEmployeeSlice.reducer;

/* Sélecteurs mémoïsés — évite des re-rendus inutiles */
const selRoot = (s) => s.newEmployee;
export const selEmployees = createSelector(selRoot, (s) => s.employees);

/* Exemple d’un sélecteur dérivé : utile si tu ajoutes une recherche serveur */
export const selCount = createSelector(selEmployees, (list) => list.length);
