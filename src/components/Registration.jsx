// components/Registration.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { callBackend } from "../lib/api";
import inspireLogo from "@/assets/inspire man.png"; 

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
        setTimeout(() => navigate("/home", { replace: true }), 100);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      {/* Header with logo and title */}
      <div className="text-center mb-8">
        <img
          src={inspireLogo}
          alt="Inspire Logo"
          className="mx-auto mb-4 w-24 h-24 object-contain"
        />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gold-500">
          Welcome to Inspire Fantasy First Edition
        </h1>
      </div>

      {/* Registration card */}
      <Card className="w-full max-w-md bg-white text-black rounded-xl shadow-2xl dark:bg-gray-900 dark:text-white border border-gold-500">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center text-gold-500">Register</h2>
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
              placeholder="Fantasy Team Name "
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gold-600 text-white font-semibold"
              disabled={loading}
            >
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




// // components/Registration.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { callBackend } from "../lib/api";

// export default function Registration({ setUserId }) {
//   const [username, setUsername] = useState("");
//   const [teamName, setTeamName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;
//     setLoading(true);

//     try {
//       const response = await callBackend("registerUser", {
//         name: username,
//         teamName,
//       });

//       if (response.status === "success") {
//         localStorage.setItem("userId", response.userId);
//         localStorage.setItem("name", username);
//         localStorage.setItem("teamName", teamName);

//         setUserId(response.userId);
//         toast.success("🎉 Registration successful!");

//         setTimeout(() => {
//           navigate("/home", { replace: true });
//         }, 100);
//       } else {
//         toast.error(response.message || "Registration failed.");
//       }
//     } catch (err) {
//       console.error("Error occurred:", err.message);
//       toast.error(`Network error: ${err.message}`);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black transition-colors">
//       <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-900 text-black dark:text-white shadow-xl">
//         <CardContent>
//           <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               className="bg-white dark:bg-gray-800 dark:text-white"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//             />
//             <Input
//               className="bg-white dark:bg-gray-800 dark:text-white"
//               placeholder="Team Name"
//               value={teamName}
//               onChange={(e) => setTeamName(e.target.value)}
//               required
//             />
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
//                   Registering...
//                 </div>
//               ) : (
//                 "Register"
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
