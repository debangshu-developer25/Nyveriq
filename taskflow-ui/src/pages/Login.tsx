import React, { useState } from "react";
import "./../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token);

      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo">🚀 Nyveriq</div>

        <p className="subtitle">
          Plan. Track. Deliver.
        </p>

        {error && <div className="error">{error}</div>}

        <div className="input-group">
          <label>📧 Email</label>

          <input
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>

        <div className="input-group">

          <label>🔒 Password</label>

          <div className="password-box">

            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter password"
            />

            <span
              className="show-btn"
              onClick={()=>setShow(!show)}
            >
              {show ? "🙈" : "👁"}
            </span>

          </div>

        </div>

        <button
          className="login-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Login"}
        </button>

        <div className="signup">
    <p>Don't have an account?</p>

    <Link className="signup-btn" to="/signup">
        Create Account
    </Link>

    <div className="footer">
        Nyveriq v1.0 <br />
        Built by Debangshu Chanda
    </div>
</div>

      </div>

    </div>
  );
};

export default Login;