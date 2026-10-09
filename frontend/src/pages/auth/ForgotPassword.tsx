import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Hotel,
  Mail,
  ArrowLeft,
  LockKeyhole,
  CheckCircle,
} from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Frontend validation only.
    // A real password reset requires a backend API endpoint.
    setSubmitted(true);
  };

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-card">
        <Link
          to="/login"
          className="forgot-password-brand"
          aria-label="GrandStay home"
        >
          <span className="forgot-password-brand-icon">
            <Hotel size={26} />
          </span>

          <span>GrandStay</span>
        </Link>

        {!submitted ? (
          <>
            <div className="forgot-password-icon">
              <LockKeyhole size={28} />
            </div>

            <div className="forgot-password-heading">
              <h1>Forgot your password?</h1>

              <p>
                Enter the email address associated with your account.
                We will connect this form to your password-reset
                service once the backend endpoint is confirmed.
              </p>
            </div>

            {error && (
              <div className="forgot-password-error" role="alert">
                {error}
              </div>
            )}

            <form
              className="forgot-password-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <label htmlFor="forgot-password-email">
                Email address
              </label>

              <div className="forgot-password-input-wrapper">
                <Mail
                  size={19}
                  aria-hidden="true"
                  className="forgot-password-input-icon"
                />

                <Input
                  id="forgot-password-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
              >
                Continue
              </Button>
            </form>
          </>
        ) : (
          <div className="forgot-password-success">
            <div className="forgot-password-success-icon">
              <CheckCircle size={34} />
            </div>

            <h1>Email address validated</h1>

            <p>
              Your email address passed the format check. No reset
              email has been sent yet because the password-reset
              API has not been connected.
            </p>

            <Button
              type="button"
              variant="primary"
              size="large"
              fullWidth
              onClick={() => {
                setSubmitted(false);
                setError("");
              }}
            >
              Try another email
            </Button>
          </div>
        )}

        <Link to="/login" className="forgot-password-back-link">
          <ArrowLeft size={17} />
          Back to login
        </Link>

        <p className="forgot-password-footer">
          © {new Date().getFullYear()} GrandStay Hotel Management
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;