import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import "../styles/Signup.css";

const SignUp: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "TaskFlow | Sign Up";
  }, []);

  const handleSubmit = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await api.post("/auth/register", {
        fullName,
        email,
        password,
      });

      login(res.data.token);

      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("Email already exists.");
      } else {
        setError("Failed to create account.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-card">

        <div className="logo">🚀 TaskFlow</div>

        <p className="subtitle">
          Create Your TaskFlow Account
        </p>

        {error && <div className="error">{error}</div>}

        <div className="input-group">
          <label>👤 Full Name</label>

          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="input-group">
          <label>📧 Email</label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label>🔒 Password</label>

          <div className="password-box">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />

            <span
              className="show-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>

          </div>
        </div>

        <div className="input-group">
          <label>🔒 Confirm Password</label>

          <div className="password-box">

            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />

            <span
              className="show-btn"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? "🙈" : "👁"}
            </span>

          </div>
        </div>

        <button
          className="login-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Creating Account..." : "Create Account"}
        </button>

        <div className="signup">

          <p>Already have an account?</p>

          <Link className="signup-btn" to="/login">
            Login
          </Link>

          <div className="footer">
            TaskFlow v1.0
            <br />
            Built by Debangshu Chanda
          </div>

        </div>

      </div>

    </div>
  );
};

export default SignUp;