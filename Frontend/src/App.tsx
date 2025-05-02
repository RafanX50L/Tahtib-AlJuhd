import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import UserRotues from "./routes/UserRoutes";

function App() {
  console.log("enterer");
  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRotues />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
