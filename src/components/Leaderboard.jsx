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
        <div className="overflow-auto">
        <table className="table-auto text-sm">
          <thead>
            <tr className="text-left border-b border-gray-300">
              <th className="p-2 text-xs md:text-sm">Rank</th>
              <th className="p-2 text-xs md:text-sm">Name</th>
              <th className="p-2 text-xs md:text-sm">Team Name</th>
              <th className="p-2 text-xs md:text-sm">Total Points</th>
              <th className="p-2 text-xs md:text-sm">Round 1</th>
              <th className="p-2 text-xs md:text-sm">Round 2</th>
              <th className="p-2 text-xs md:text-sm">Round 3</th>
              <th className="p-2 text-xs md:text-sm">Final</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((user, i) => (
              <tr key={i} className="border-b border-gray-200">
                <td className="p-2 break-words">{i + 1}</td>
                <td className="p-2 break-words">{user.name}</td>
                <td className="p-2 break-words">{user.teamName}</td>
                <td className="p-2 break-words font-bold">{user.totalPoints}</td>
                <td className="p-2 break-words">{user.round1}</td>
                <td className="p-2 break-words">{user.round2}</td>
                <td className="p-2 break-words">{user.round3}</td>
                <td className="p-2 break-words">{user.final}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
      <Button onClick={() => navigate("/home")}>Back to Home</Button>
    </div>
  );
}
