import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ← Add Link
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { callBackend } from "../lib/api";

export default function Login({ setUserId }) {
  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputId || loading) return;
    setLoading(true);

    try {
      const response = await callBackend("loginUser", { userId: inputId });

      if (response.status === "success") {
        localStorage.setItem("userId", inputId);
        localStorage.setItem("name", response.name);
        localStorage.setItem("teamName", response.teamName);

        setUserId(inputId);
        toast.success("✅ Login successful");
        navigate("/home", { replace: true });
      } else {
        toast.error(response.message || "Invalid user ID.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  const handleClearStorage = () => {
    localStorage.clear();
    setUserId(null);
    toast("Local storage cleared.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="User ID (e.g. U3)"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleClearStorage}
          >
            Clear Local Storage
          </Button>

          {/* ✅ Registration link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline font-medium">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
