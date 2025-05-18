import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Registration from "@/components/Registration";
import Home from "@/components/Home";
import PlayerList from "@/components/PlayerList";
import Leaderboard from "@/components/Leaderboard";
import Login from "@/components/Login";

import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  const [userId, setUserId] = useState(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);
    setCheckedStorage(true);
  }, []);

  if (!checkedStorage) return null;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            userId ? (
              <Navigate to="/home" replace />
            ) : (
              <Registration setUserId={setUserId} />
            )
          }
        />
        <Route path="/login" element={<Login setUserId={setUserId} />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute userId={userId}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/players"
          element={
            <ProtectedRoute userId={userId}>
              <PlayerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute userId={userId}>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
