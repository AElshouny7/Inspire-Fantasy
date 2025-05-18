// components/Registration.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { callBackend } from "../lib/api";

export default function Registration({ setUserId }) {
  const [username, setUsername] = useState("");
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await callBackend("registerUser", {
        name: username,
        teamName,
      });

      if (response.status === "success") {
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("name", username);
        localStorage.setItem("teamName", teamName);

        setUserId(response.userId);
        toast.success("🎉 Registration successful!");

        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 100);
      } else {
        toast.error(response.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Error occurred:", err.message);
      toast.error(`Network error: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black transition-colors">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-900 text-black dark:text-white shadow-xl">
        <CardContent>
          <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              className="bg-white dark:bg-gray-800 dark:text-white"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              className="bg-white dark:bg-gray-800 dark:text-white"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Registering...
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
