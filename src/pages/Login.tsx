import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/config";

const Login = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

 const sendOtp = async () => {
  if (phone.length !== 10) {
    alert("Please enter a valid 10-digit phone number");
    return;
  }

  try {
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier.clear();
    }

    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    await recaptchaVerifier.render(); // ✅ IMPORTANT

    (window as any).recaptchaVerifier = recaptchaVerifier;

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      `+91${phone}`,
      recaptchaVerifier
    );

    console.log("OTP sent successfully");

    (window as any).confirmationResult = confirmationResult;
    navigate("/otp"); // ✅ WILL RUN
  } catch (error) {
    console.error("OTP error:", error);
    alert("OTP failed. Check console.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">
        {/* LEFT */}
        <div className="p-12">
          <img src="https://totalx.io/favicon.svg" className="w-12 mb-10" />

          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="text-gray-500 mb-6">
            Login to access your travelwise account
          </p>

          <input
            type="tel"
            placeholder="Enter mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border px-4 py-2 rounded mb-4"
          />

          <button
            onClick={sendOtp}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Get OTP
          </button>

          <p className="text-sm mt-4">
            Don’t have an account?
            <span
              onClick={() => navigate("/signup")}
              className="text-red-500 cursor-pointer ml-1"
            >
              Sign up
            </span>
          </p>

          {/* REQUIRED */}
          <div id="recaptcha-container"></div>
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

export default Login;
