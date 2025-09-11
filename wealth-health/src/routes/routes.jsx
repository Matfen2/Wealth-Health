import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import CreateEmployee from "../pages/CreateEmployee/CreateEmployee";
import ListeEmployee from "../pages/ListEmployee/ListEmployee";
import Error from "../pages/Error/Error";
import Home from "../pages/Home/Home"

function App() {
  return (
    <BrowserRouter>
      <Header />
      <section className="elementsToDisplay">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEmployee />} />
          <Route path="/list" element={<ListeEmployee />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </section>
      <Footer />
    </BrowserRouter>
  );
}
export default App;