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

function App() {
  const [userId, setUserId] = useState(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);
    setCheckedStorage(true);
  }, []);

  if (!checkedStorage) return null; // wait for localStorage check

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={initialRoute} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;