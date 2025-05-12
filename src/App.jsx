// App.jsx
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
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setInitialRoute(userId ? "/home" : "/register");
  }, []);

  if (initialRoute === null) return null; // wait for localStorage check

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={initialRoute} />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<Home />} />
        <Route path="/players" element={<PlayerList />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
