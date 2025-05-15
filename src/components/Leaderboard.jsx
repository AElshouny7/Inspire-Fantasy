import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { callBackend } from "@/lib/api";

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await callBackend("viewLeaderboard");
      if (res.status === "success") {
        console.log(res.leaderboard);
        setLeaderboard(res.leaderboard);
      }
    }
    fetchLeaderboard();
  }, []);

  const sorted = [...leaderboard].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <Card className="p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">Leaderboard</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="p-2">Rank</th>
              <th className="p-2">Name</th>
              <th className="p-2">Team Name</th>
              <th className="p-2">Total Points</th>
              <th className="p-2">Round 1</th>
              <th className="p-2">Round 2</th>
              <th className="p-2">Round 3</th>
              <th className="p-2">Final</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((user, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.teamName}</td>
                <td className="p-2 font-bold">{user.totalPoints}</td>
                <td className="p-2">{user.round1}</td>
                <td className="p-2">{user.round2}</td>
                <td className="p-2">{user.round3}</td>
                <td className="p-2">{user.final}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Button onClick={() => navigate("/home")}>Back to Home</Button>
    </div>
  );
}
