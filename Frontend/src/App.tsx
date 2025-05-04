import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import UserRotues from "./routes/UserRoutes";
import AuthRotues from "./routes/AuthRoutes";
import TrainerRotues from "./routes/TrainerRoutes";
import AdminRotues from "./routes/AdminRoutes";

function App() {
  console.log("enterer");
  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/auth/*" element={<AuthRotues />} />
          <Route path="/*" element={<UserRotues />} />
          <Route path="/trainer/*" element={<TrainerRotues />} />
          <Route path="/admin/*" element={<AdminRotues />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
