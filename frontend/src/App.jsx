import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LiveStatus from "./pages/LiveStatus";
import Analytics from "./pages/Analytics";


function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<LiveStatus />}
      />

      <Route
        path="/dashboard"
        element={<LiveStatus />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>

  );
}


export default App;