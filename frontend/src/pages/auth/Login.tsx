import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Hotel,
  Eye,
  EyeOff,
  User,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Alert from "../../components/common/Alert";

import "./Login.css";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuthContext();

  const locationState = location.state as LocationState | null;
  const redirectPath = locationState?.from?.pathname ?? "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!username.trim()) {
      setFormError("Please enter your username.");
      return;
    }

    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    try {
      await login({
        username: username.trim(),
        password,
      });

      navigate(redirectPath, { replace: true });
    } catch {
      setFormError(
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-brand-logo">
            <Hotel size={34} />
          </div>

          <h1>GrandStay</h1>

          <p className="login-brand-subtitle">
            Hotel Management System
          </p>

          <div className="login-brand-divider" />

          <h2>Manage your hotel with confidence.</h2>

          <p className="login-brand-description">
            Manage rooms, reservations, guests, and daily hotel
            operations from one convenient workspace.
          </p>

          <div className="login-feature-list">
            <div className="login-feature">
              <span className="login-feature-dot" />
              Room and reservation management
            </div>

            <div className="login-feature">
              <span className="login-feature-dot" />
              Guest information management
            </div>

            <div className="login-feature">
              <span className="login-feature-dot" />
              Centralized hotel dashboard
            </div>
          </div>
        </div>

        <p className="login-brand-footer">
          Professional hotel operations, simplified.
        </p>
      </section>

      <section className="login-form-panel">
        <div className="login-form-container">
          <div className="login-mobile-brand">
            <div className="login-mobile-logo">
              <Hotel size={25} />
            </div>

            <span>GrandStay</span>
          </div>

          <div className="login-heading">
            <span className="login-eyebrow">WELCOME BACK</span>

            <h2>Sign in to your account</h2>

            <p>
              Enter your credentials to access the management portal.
            </p>
          </div>

          {(formError || error) && (
            <Alert
              type="error"
              title="Unable to sign in"
              message={formError || error || "Please try again."}
            />
          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="login-input-group">
              <label htmlFor="login-username">
                Username
              </label>

              <div className="login-input-wrapper">
                <User
                  size={19}
                  className="login-input-icon"
                  aria-hidden="true"
                />

                <Input
                  id="login-username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                    setFormError("");
                  }}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-input-group">
              <label htmlFor="login-password">
                Password
              </label>

              <div className="login-input-wrapper">
                <LockKeyhole
                  size={19}
                  className="login-input-icon"
                  aria-hidden="true"
                />

                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFormError("");
                  }}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <div className="login-form-options">
              <span className="login-secure-label">
                <LockKeyhole size={14} />
                Secure sign-in
              </span>

              <Link
                to="/forgot-password"
                className="login-forgot-link"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}

              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="login-security-note">
            <LockKeyhole size={16} />

            <p>
              Your session is protected by your account's
              authentication settings.
            </p>
          </div>

          <p className="login-copyright">
            © {new Date().getFullYear()} GrandStay Hotel Management.
            All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;