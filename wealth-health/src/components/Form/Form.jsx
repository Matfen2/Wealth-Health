/*eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addEmployee, selEmployees } from "../../features/newEmploye/newEmployeeSlice"; 
import DatePicker from "react-datepicker";
import { Modal } from "hrnet-wealth-modal";
import moment from "moment";
import "./Form.css";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { listesStates } from "../../Moks/states";
import { listesDepartement } from "../../Moks/departements";

const Form = () => {
  const dispatch = useDispatch();

  const employees = useSelector(selEmployees); 

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

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Select & dates
  const [selectedOptionsState, setSelectedOptionsState] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateStart, setSelectedDateStart] = useState(null);

  const ageDate = (date) => {
    setSelectedDate(date);
    const v = moment(date).format("YYYY/MM/DD");
    setFormValues((s) => ({ ...s, datebirth: v }));
    setFormErrors((e) => ({ ...e, datebirth: "" }));
  };

  const startDate = (date) => {
    setSelectedDateStart(date);
    const v = moment(date).format("YYYY/MM/DD");
    setFormValues((s) => ({ ...s, startdate: v }));
    setFormErrors((e) => ({ ...e, startdate: "" }));
  };

  const handleSelectState = (option) => {
    setSelectedOptionsState(option);
    setFormValues((s) => ({ ...s, countrystate: option?.value || "" }));
    setFormErrors((e) => ({ ...e, countrystate: "" }));
  };

  const handleSelectDepart = (option) => {
    setSelectedOptions(option);
    setFormValues((s) => ({ ...s, departament: option?.value || "" }));
    setFormErrors((e) => ({ ...e, departament: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((s) => ({ ...s, [name]: value }));
    setFormErrors((err) => ({ ...err, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      // calcule un id robuste
      const payload = {
        ...formValues,
        id: (employees?.length || 0) + 1,
      };

      // d'abord on envoie à Redux...
      dispatch(addEmployee(payload));

      // ...puis on ouvre le modal
      setShowModal(true);

      // reset du formulaire
      setFormValues(initialValues);
      setSelectedOptionsState(null);
      setSelectedOptions(null);
      setSelectedDate(null);
      setSelectedDateStart(null);

      // on remet isSubmit à false (on laisse showModal gérer l'affichage du modal)
      setIsSubmit(false);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};

    if (!values.firstname) errors.firstname = "First name is required";
    else if (values.firstname.length < 3) errors.firstname = "First name must be more than 3 characters";
    else if (values.firstname.length > 30) errors.firstname = "First name must be less than 30 characters";

    if (!values.lastname) errors.lastname = "Last name is required";
    else if (values.lastname.length < 3) errors.lastname = "Last name must be more than 3 characters";
    else if (values.lastname.length > 30) errors.lastname = "Last name must be less than 30 characters";

    if (!values.datebirth) errors.datebirth = "Date of birth is required. You must be 18-60 years old.";
    if (!values.startdate) errors.startdate = "Start date is required";

    if (!values.street) errors.street = "Street is required";

    if (!values.city) errors.city = "City is required";

    if (!values.countrystate) errors.countrystate = "State is required";

    if (!values.zipcode) errors.zipcode = "Zipcode is required";
    else if (values.zipcode.length < 5) errors.zipcode = "Zipcode must be more than 4 characters";
    else if (values.zipcode.length > 7) errors.zipcode = "Zipcode must be less than 7 characters";

    if (!values.departament) errors.departament = "Departament is required";

    return errors;
  };

  return (
    <>
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          backgroundColor="#FFFFFF80"
          colorModal="#dcf5ed"
          iconModal="success"
          borderModal="20px"
          content="Employee created !"
          contentcolor=" #461632 "
          shadowModal="0 5px 12px rgba(18, 39, 3, .5)"
          fontSizeModal="1.5rem"
        />
      )}

      <div className="form-wrapper">
        <form className="form-inputs" onSubmit={handleSubmit}>
          <div className="form-fieldsets">
            <fieldset className="form-fieldset">
              <legend>Employee identity</legend>

              <label htmlFor="firstname">First Name </label>
              <input
                id="firstname"
                autoComplete="off"
                name="firstname"
                type="text"
                value={formValues.firstname}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.firstname}</span>

              <label htmlFor="lastname">Last Name</label>
              <input
                id="lastname"
                autoComplete="off"
                name="lastname"
                type="text"
                value={formValues.lastname}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.lastname}</span>

              <label htmlFor="datebirth">Date of Birth</label>
              <DatePicker
                id="datebirth"
                name="datebirth"
                selected={selectedDate}
                onChange={ageDate}
                placeholderText="dd/mm/yyyy"
                yearDropdownItemNumber={60}
                minDate={moment().subtract(60, "years").toDate()}
                maxDate={moment().subtract(18, "years").toDate()}
                scrollableYearDropdown
                dateFormat="dd/MM/yyyy"
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
              <span className="errorMessage">{formErrors.datebirth}</span>

              <label htmlFor="startdate">Start Date </label>
              <DatePicker
                id="startdate"
                name="startdate"
                selected={selectedDateStart}
                onChange={startDate}
                placeholderText="dd/mm/yyyy"
                minDate={new Date()}
                maxDate={moment().add(10, "weeks").toDate()}
                dateFormat="dd/MM/yyyy"
                filterDate={(d) => d.getDay() !== 6 && d.getDay() !== 0}
                peekNextMonth
                showMonthDropdown
                dropdownMode="select"
                todayButton="today"
              />
              <span className="errorMessage">{formErrors.startdate}</span>
            </fieldset>

            <fieldset className="form-fieldset title">
              <legend>Employee Address</legend>

              <label htmlFor="street">Street</label>
              <input
                id="street"
                autoComplete="off"
                name="street"
                type="text"
                value={formValues.street}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.street}</span>

              <label htmlFor="city">City </label>
              <input
                id="city"
                autoComplete="off"
                name="city"
                type="text"
                value={formValues.city}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.city}</span>

              <label htmlFor="countrystate">
                State
                <Select
                  id="countrystate"
                  name="countrystate"
                  options={listesStates}
                  placeholder="Select state"
                  value={selectedOptionsState}
                  onChange={handleSelectState}
                />
              </label>
              <span className="errorMessage">{formErrors.countrystate}</span>

              <label htmlFor="zipcode">Zip Code</label>
              <input
                id="zipcode"
                autoComplete="off"
                name="zipcode"
                type="number"
                value={formValues.zipcode}
                onChange={handleChange}
              />
              <span className="errorMessage">{formErrors.zipcode}</span>
            </fieldset>

            <fieldset className="form-fieldset title">
              <legend>Departament</legend>
              <label htmlFor="departament">
                Departament
                <Select
                  id="departament"
                  name="departament"
                  options={listesDepartement}
                  placeholder="Select departament"
                  value={selectedOptions}
                  onChange={handleSelectDepart}
                />
              </label>
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
