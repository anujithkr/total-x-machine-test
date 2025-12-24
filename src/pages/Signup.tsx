import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Protect signup page
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/");
    }
  }, [navigate]);

  const saveUser = async () => {
    if (!firstName || !lastName || !email) {
      alert("Please fill all fields");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Session expired. Please login again.");
      navigate("/");
      return;
    }

    try {
      setLoading(true);

      // 🔐 Save user profile
      await setDoc(doc(db, "users", user.uid), {
        phone: user.phoneNumber,
        firstName,
        lastName,
        email,
        createdAt: new Date(),
      });

      // ✅ Redirect after successful signup
      navigate("/home");
    } catch (error) {
      console.warn("Firestore write failed, redirecting anyway:", error);

      // ✅ Do NOT block user if Firestore fails
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">

        {/* LEFT (image) */}
        <div className="hidden md:flex justify-center items-center">
          <img
            src="https://deepcall.com/inc/images/otp-service-provider/mobileAuth.webp"
            className="max-w-sm"
          />
        </div>

        {/* RIGHT (form) */}
        <div className="p-12">
          <h1 className="text-3xl font-bold mb-2">Sign up</h1>
          <p className="text-gray-500 mb-8">
            Let’s get you all set up so you can access your personal account.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border px-4 py-2 rounded"
            />
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border px-4 py-2 rounded"
            />
          </div>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded mb-6 w-full"
          />

          <button
            onClick={saveUser}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
