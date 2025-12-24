import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";


const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false); // ✅ NEW
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
      toast.error("Please fill all fields");

      return;
    }

    if (!acceptTerms) {
      toast.error("Please accept the Terms & Conditions");

      return;
    }

    const user = auth.currentUser;
    if (!user) {
     toast.error("Session expired. Please login again.");

      navigate("/");
      return;
    }

    try {
      setLoading(true);

      await setDoc(doc(db, "users", user.uid), {
        phone: user.phoneNumber,
        firstName,
        lastName,
        email,
        createdAt: new Date(),
      });
      toast.success("Account created successfully");
      navigate("/home");
    } catch (error) {
      console.warn("Firestore write failed, redirecting anyway:", error);
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">

        {/* LEFT */}
        <div className="hidden md:flex justify-center items-center">
          <img
            src="https://origent.in/img/p4.png"
            className="max-w-sm bg-gray-100 rounded-2xl"
          />
        </div>

        {/* RIGHT */}
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
            className="border px-4 py-2 rounded mb-4 w-full"
          />

          {/* ✅ TERMS & CONDITIONS */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mr-2"
            />
            <p className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-indigo-600 cursor-pointer">
                Terms & Conditions
              </span>
            </p>
          </div>

          <button
            onClick={saveUser}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {/* ✅ Already have account */}
          <p className="text-sm text-center mt-6">
            Already have an account?
            <span
              onClick={() => navigate("/")}
              className="text-indigo-600 cursor-pointer ml-1 font-medium"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
