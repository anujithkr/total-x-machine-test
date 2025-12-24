import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const Otp = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Protect OTP page
  useEffect(() => {
    if (!(window as any).confirmationResult) {
      navigate("/");
    }
  }, [navigate]);

  const verifyOtp = async () => {
  if (code.length !== 6) {
    alert("Please enter a valid 6-digit OTP");
    return;
  }

  try {
    setLoading(true);

    const confirmationResult = (window as any).confirmationResult;
    const result = await confirmationResult.confirm(code);

    // OTP verified
    const user = result.user;

    try {
      // 🔍 Try Firestore check
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        navigate("/home");
      } else {
        navigate("/signup");
      }
    } catch (firestoreError) {
      console.warn("Firestore offline, skipping check:", firestoreError);

      // IMPORTANT FALLBACK
      // OTP verified, but DB unreachable → allow user forward
      navigate("/signup");
    }
  } catch (error) {
    console.error("OTP verify error:", error);
    alert("Invalid OTP. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">

        {/* LEFT */}
        <div className="p-12">
          <img src="https://totalx.io/favicon.svg" className="w-12 mb-6" />

          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 mb-6"
          >
            ← Back to login
          </button>

          <h1 className="text-3xl font-bold mb-2">Verify code</h1>
          <p className="text-gray-500 mb-6">
            An authentication code has been sent to your phone.
          </p>

          <input
            placeholder="Enter Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border px-4 py-2 rounded mb-4"
          />

          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex justify-center items-center bg-gray-50 rounded-xl">
          <img
            src="https://deepcall.com/inc/images/otp-service-provider/mobileAuth.webp"
            className="max-w-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default Otp;
