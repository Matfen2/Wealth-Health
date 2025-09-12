/*eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addEmployee, selEmployees } from "../../features/newEmploye/newEmployeeSlice"; 
import DatePicker from "react-datepicker";
import { Modal } from "hrnet-wealth-modal"; // <-- utilisation du package npm publié
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { listesStates } from "../../Moks/states";
import { listesDepartement } from "../../Moks/departements";
import "./form.css";

const Form = () => {
  const dispatch = useDispatch();
  const employees = useSelector(selEmployees); // Récupère la liste globale des employés depuis Redux

  // State local du formulaire
  const initialValues = {
    firstname: "",
    id: "",
    lastname: "",
    datebirth: "",
    startdate: "",
    street: "",
    city: "",
    countrystate: "",
    zipcode: "",
    departament: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  // Gestion du modal de succès
  const [showModal, setShowModal] = useState(false);

  // Etats pour react-select & datepicker
  const [selectedOptionsState, setSelectedOptionsState] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateStart, setSelectedDateStart] = useState(null);

  // Gestion des dates avec moment
  const ageDate = (date) => {
    setSelectedDate(date);
    const v = moment(date).format("YYYY/MM/DD");
    setFormValues((s) => ({ ...s, datebirth: v }));
  };

  const startDate = (date) => {
    setSelectedDateStart(date);
    const v = moment(date).format("YYYY/MM/DD");
    setFormValues((s) => ({ ...s, startdate: v }));
  };

  // Gestion des selects
  const handleSelectState = (option) => {
    setSelectedOptionsState(option);
    setFormValues((s) => ({ ...s, countrystate: option?.value || "" }));
  };

  const handleSelectDepart = (option) => {
    setSelectedOptions(option);
    setFormValues((s) => ({ ...s, departament: option?.value || "" }));
  };

  // Gestion des inputs text
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((s) => ({ ...s, [name]: value }));
  };

  // Submit du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues)); // lance la validation
    setIsSubmit(true);
  };

  // Effet : si pas d’erreurs et submit → ajout Redux + modal
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const payload = {
        ...formValues,
        id: (employees?.length || 0) + 1, // calcule un id simple
      };
      dispatch(addEmployee(payload));   // Ajout de l’employé dans Redux
      setShowModal(true);               // Ouverture du modal
      setFormValues(initialValues);     // Reset du form
      setSelectedOptionsState(null);
      setSelectedOptions(null);
      setSelectedDate(null);
      setSelectedDateStart(null);
      setIsSubmit(false);
    }
  }, [formErrors]);

  // Validation basique
  const validate = (values) => {
    const errors = {};
    if (!values.firstname) errors.firstname = "First name is required";
    if (!values.lastname) errors.lastname = "Last name is required";
    if (!values.datebirth) errors.datebirth = "Date of birth is required";
    if (!values.startdate) errors.startdate = "Start date is required";
    if (!values.street) errors.street = "Street is required";
    if (!values.city) errors.city = "City is required";
    if (!values.countrystate) errors.countrystate = "State is required";
    if (!values.zipcode) errors.zipcode = "Zipcode is required";
    if (!values.departament) errors.departament = "Departament is required";
    return errors;
  };

  return (
    <>
      {/* Affichage du modal en cas de succès */}
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          backgroundColor="#FFFFFF80"
          colorModal="#dcf5ed"
          iconModal="success"
          borderModal="20px"
          content="Employee created !"
          contentcolor="#461632"
          shadowModal="0 5px 12px rgba(18, 39, 3, .5)"
          fontSizeModal="1.5rem"
        />
      )}

      {/* Formulaire de création */}
      <div className="form-wrapper">
        <form className="form-inputs" onSubmit={handleSubmit}>
          <div className="form-fieldsets">
            <fieldset className="form-fieldset">
              <legend>Employee identity</legend>
              <label htmlFor="firstname">First Name </label>
              <input
                id="firstname"
                name="firstname"
                value={formValues.firstname}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.firstname}</span>

              <label htmlFor="lastname">Last Name</label>
              <input
                id="lastname"
                name="lastname"
                value={formValues.lastname}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.lastname}</span>

              <label htmlFor="datebirth">Date of Birth</label>
              <DatePicker
                id="datebirth"
                selected={selectedDate}
                onChange={ageDate}
                placeholderText="dd/mm/yyyy"
              />
              <span className="errorMessage">{formErrors.datebirth}</span>

              <label htmlFor="startdate">Start Date </label>
              <DatePicker
                id="startdate"
                selected={selectedDateStart}
                onChange={startDate}
                placeholderText="dd/mm/yyyy"
              />
              <span className="errorMessage">{formErrors.startdate}</span>
            </fieldset>

            <fieldset className="form-fieldset title">
              <legend>Employee Address</legend>
              <label htmlFor="street">Street</label>
              <input
                id="street"
                name="street"
                value={formValues.street}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.street}</span>

              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                value={formValues.city}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.city}</span>

              <label htmlFor="countrystate">State</label>
              <Select
                id="countrystate"
                options={listesStates}
                placeholder="Select state"
                value={selectedOptionsState}
                onChange={handleSelectState}
              />
              <span className="errorMessage">{formErrors.countrystate}</span>

              <label htmlFor="zipcode">Zip Code</label>
              <input
                id="zipcode"
                name="zipcode"
                type="number"
                value={formValues.zipcode}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.zipcode}</span>
            </fieldset>

            <fieldset className="form-fieldset title">
              <legend>Departament</legend>
              <Select
                id="departament"
                options={listesDepartement}
                placeholder="Select departament"
                value={selectedOptions}
                onChange={handleSelectDepart}
              />
              <span className="errorMessage">{formErrors.departament}</span>
            </fieldset>
          </div>

          <button className="form-button">Save</button>
        </form>
      </div>
    </>
  );
};

export default Form;
