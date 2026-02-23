import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../firebase";

function Login() {
  const navigate = useNavigate();

  // 🔥 If already logged in → redirect to "/"
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <button
        onClick={handleLogin}
        className="flex items-center gap-3 bg-white text-gray-800 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
      >
        {/* Google Logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5"
        >
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.23 3.61l6.9-6.9C35.63 2.36 30.2 0 24 0 14.82 0 6.84 5.16 2.88 12.69l8.05 6.26C13.3 13.05 18.2 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24c0-1.63-.15-3.19-.43-4.69H24v9.01h12.67c-.55 2.96-2.21 5.47-4.7 7.16l7.28 5.66C43.96 36.63 46.5 30.81 46.5 24z"/>
          <path fill="#FBBC05" d="M10.93 28.95A14.5 14.5 0 019.5 24c0-1.71.3-3.36.84-4.9l-8.05-6.26A23.94 23.94 0 000 24c0 3.87.93 7.52 2.29 10.84l8.64-5.89z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-7.28-5.66c-2.02 1.35-4.6 2.15-8.62 2.15-5.8 0-10.7-3.55-13.07-8.45l-8.64 5.89C6.84 42.84 14.82 48 24 48z"/>
        </svg>

        <span>Sign in with Google</span>
      </button>
    </div>
  );
}

export default Login;