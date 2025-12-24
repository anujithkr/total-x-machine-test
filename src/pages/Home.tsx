import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

const Home = () => {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/"); // ✅ redirect to login
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      
      {/* Logo */}
      <img
        src="https://totalx.io/favicon.svg"
        className="w-12 absolute top-6 right-6"
      />

      {/* Phone number */}
      <p className="text-xl font-semibold mb-6">
        {auth.currentUser?.phoneNumber}
      </p>

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-64 bg-indigo-600 text-white py-2 rounded"
      >
        Log Out
      </button>
    </div>
  );
};

export default Home;
