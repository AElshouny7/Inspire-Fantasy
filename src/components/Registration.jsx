// components/Registration.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { callBackend } from "../lib/api";

export default function Registration() {
  const [username, setUsername] = useState("");
  const [teamName, setTeamName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await callBackend("registerUser", {
      name: username,
      teamName,
    });
    console.log(response);

    if (response.status === "success") {
      localStorage.setItem("userId", response.userId);
      localStorage.setItem("teamName", teamName);
      navigate("/home", { state: { userId: response.userId } });
    } else {
      // Handle error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
