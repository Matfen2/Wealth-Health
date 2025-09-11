import { lazy, Suspense } from "react";
import { Routes, Route} from "react-router-dom";

import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";

const Home = lazy(() => import("../pages/Home/Home.jsx"));
const CreateEmployee = lazy(() => import("../pages/CreateEmployee/CreateEmployee.jsx"));
const ListeEmployee = lazy(() => import("../pages/ListEmployee/ListEmployee.jsx"));
const Error = lazy(() => import("../pages/Error/Error.jsx"));

const navStyle = { textDecoration: "none" };

export default function AppRoutes() {
  return (
    <>
      <Header />
      <Suspense fallback={<main style={{ padding: 24 }}>Loading…</main>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEmployee />} />
          <Route path="/list" element={<ListeEmployee />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
