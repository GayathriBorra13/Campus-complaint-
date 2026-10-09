
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  ShieldCheck,
  UserRound,
  LogIn,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ArrowRight,
  Menu,
  X,
  MapPin,
  FileText,
  Search,
  RefreshCw,
} from "lucide-react";

import { api } from "./api";

/* =========================================================
   SESSION HELPERS
========================================================= */

function getStoredUser() {
  try {
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error("User storage error:", error);
    return null;
  }
}

function saveSession(data) {
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  if (data?.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
  }
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

function dashboardPath(user) {
  if (!user) {
    return "/";
  }

  return user.role === "admin"
    ? "/admin-dashboard"
    : "/student-dashboard";
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ children, role }) {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return (
      <Navigate
        to={dashboardPath(user)}
        replace
      />
    );
  }

  return children;
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(
    getStoredUser()
  );

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">

        <Link
          to="/"
          className="brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-icon">
            <ShieldCheck size={20} />
          </span>

          <span>
            Campus Complaint Management System
          </span>
        </Link>

        <button
          type="button"
          className="mobile-menu"
          onClick={() =>
            setMenuOpen((value) => !value)
          }
        >
          {menuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

        <div
          className={`nav-links ${
            menuOpen ? "open" : ""
          }`}
        >

          {!user && (
            <>
              <Link
                to="/student-login"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Student
              </Link>

              <Link
                to="/admin-login"
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                Admin
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to={dashboardPath(user)}
                onClick={() =>
                  setMenuOpen(false)
                }
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>

              {user.role === "student" && (
                <Link
                  to="/raise-complaint"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  <PlusCircle size={15} />
                  Raise Complaint
                </Link>
              )}

              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        <strong>
          Campus Complaint Management System
        </strong>

        <span>
          Digital campus issue management platform
        </span>

      </div>
    </footer>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const navigate = useNavigate();
  const user = getStoredUser();

  return (
    <>
      <main>

        <section className="hero">
          <div className="hero-grid container">

            <div>

              <div className="eyebrow">
                <span></span>
                SMART CAMPUS PLATFORM
              </div>

              <h1>
                Make your campus{" "}
                <em>better together.</em>
              </h1>

              <p className="hero-text">
                Report campus issues easily,
                track complaint progress, and
                help your college create a
                better environment for everyone.
              </p>

              <div className="hero-actions">

                {user ? (
                  <>
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() =>
                        navigate(
                          dashboardPath(user)
                        )
                      }
                    >
                      Go to Dashboard
                      <ArrowRight size={17} />
                    </button>

                    {user.role === "student" && (
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() =>
                          navigate(
                            "/raise-complaint"
                          )
                        }
                      >
                        <PlusCircle size={17} />
                        Raise Complaint
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() =>
                        navigate(
                          "/student-login"
                        )
                      }
                    >
                      Student Login
                      <ArrowRight size={17} />
                    </button>

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() =>
                        navigate(
                          "/admin-login"
                        )
                      }
                    >
                      Admin Login
                    </button>
                  </>
                )}

              </div>

              <div className="trust-row">

                <div>
                  <CheckCircle2 size={15} />
                  Easy complaint tracking
                </div>

                <div>
                  <CheckCircle2 size={15} />
                  Centralized management
                </div>

              </div>

            </div>

            <div className="hero-card">

              <div className="hero-card-top">
                <span>
                  Complaint workflow
                </span>

                <span className="live-dot">
                  ● Live system
                </span>
              </div>

              <div className="workflow">

                <div className="workflow-step">

                  <div className="step-number done">
                    01
                  </div>

                  <div>
                    <strong>Submit</strong>
                    <p>
                      Student submits a campus
                      complaint.
                    </p>
                  </div>

                </div>

                <div className="workflow-step">

                  <div className="step-number">
                    02
                  </div>

                  <div>
                    <strong>Review</strong>
                    <p>
                      Admin reviews and manages
                      the issue.
                    </p>
                  </div>

                </div>

                <div className="workflow-step">

                  <div className="step-number">
                    03
                  </div>

                  <div>
                    <strong>Resolve</strong>
                    <p>
                      Complaint status is updated
                      after action.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>

        <section className="section">
          <div className="container">

            <div className="section-head">

              <div>
                <div className="eyebrow">
                  <span></span>
                  PLATFORM FEATURES
                </div>

                <h2>
                  Everything in one place.
                </h2>
              </div>

              <p>
                A centralized system for
                submitting, managing, and
                tracking campus complaints.
              </p>

            </div>

            <div className="feature-grid">

              <FeatureCard
                icon={
                  <ClipboardList size={20} />
                }
                title="Complaint Management"
                text="Students can submit campus issues and monitor their status."
              />

              <FeatureCard
                icon={
                  <LayoutDashboard size={20} />
                }
                title="Admin Dashboard"
                text="Administrators can view and manage complaints from one dashboard."
              />

              <FeatureCard
                icon={
                  <CheckCircle2 size={20} />
                }
                title="Status Tracking"
                text="Complaint progress is visible through clear status updates."
              />

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon,
  title,
  text,
}) {
  return (
    <div className="feature-card">

      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

      <div className="feature-arrow">
        <ArrowRight size={17} />
      </div>

    </div>
  );
}

/* =========================================================
   LOGIN PAGE
========================================================= */

function AuthPage({ admin = false }) {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter email and password"
      );
      return;
    }

    try {
      setLoading(true);

      const data = await api.login({
        email: email.trim(),
        password,
      });

      if (
        admin &&
        data?.user?.role !== "admin"
      ) {
        setError(
          "This account is not an admin account"
        );
        return;
      }

      if (
        !admin &&
        data?.user?.role !== "student"
      ) {
        setError(
          "This account is not a student account"
        );
        return;
      }

      saveSession(data);

      navigate(
        data.user.role === "admin"
          ? "/admin-dashboard"
          : "/student-dashboard"
      );

    } catch (errorObject) {
      setError(
        errorObject.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-shell">

        <div className="auth-info">

          <div className="auth-logo">
            {admin ? (
              <ShieldCheck size={21} />
            ) : (
              <UserRound size={21} />
            )}
          </div>

          <div className="eyebrow">
            <span></span>
            CAMPUS PLATFORM
          </div>

          <h1>
            {admin
              ? "Manage campus complaints efficiently."
              : "Make your campus better together."}
          </h1>

          <p>
            {admin
              ? "Review complaints, update statuses, and manage campus issues from one centralized dashboard."
              : "Submit your campus issues and track their progress directly from your student dashboard."}
          </p>

          <div className="auth-points">

            <span>
              <CheckCircle2 size={17} />
              Secure role-based access
            </span>

            <span>
              <CheckCircle2 size={17} />
              MongoDB-powered data
            </span>

            <span>
              <CheckCircle2 size={17} />
              Complaint tracking
            </span>

          </div>

        </div>

        <div className="auth-form">

          <div className="form-title">

            <div className="form-icon">
              {admin ? (
                <ShieldCheck size={21} />
              ) : (
                <UserRound size={21} />
              )}
            </div>

            <h2>
              {admin
                ? "Admin Login"
                : "Student Login"}
            </h2>

            <p>
              Sign in to continue
            </p>

          </div>

          {error && (
            <div className="error-box">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <label>
              Email

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              Password

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
              />
            </label>

            <button
              type="submit"
              className="primary-btn full"
              disabled={loading}
            >
              <LogIn size={16} />

              {loading
                ? "Signing in..."
                : "Login"}
            </button>

          </form>

          {!admin && (
            <div className="switch-auth">
              New student?{" "}
              <Link to="/student-register">
                Create an account
              </Link>
            </div>
          )}

          {admin && (
            <div className="switch-auth">
              New admin?{" "}
              <Link to="/admin-register">
                Create admin account
              </Link>
            </div>
          )}

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   STUDENT REGISTER
========================================================= */

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    department: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.studentId.trim() ||
      !form.department
    ) {
      setError(
        "Please fill all required fields"
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await api.register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          studentId:
            form.studentId.trim(),
          department:
            form.department,
        });

      saveSession(data);

      navigate(
        "/student-dashboard"
      );

    } catch (errorObject) {
      setError(
        errorObject.message ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="register-shell">

        <div className="form-title">

          <div className="form-icon">
            <UserRound size={21} />
          </div>

          <h2>
            Student Registration
          </h2>

          <p>
            Create your student account
          </p>

        </div>

        {error && (
          <div className="error-box">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="register-grid">

            <label>
              Full Name

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Student ID

              <input
                type="text"
                name="studentId"
                placeholder="Enter student ID"
                value={
                  form.studentId
                }
                onChange={handleChange}
              />
            </label>

            <label className="span-2">
              Email

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </label>

            <label>
              Password

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={
                  form.password
                }
                onChange={handleChange}
              />
            </label>

            <label>
              Department

              <select
                name="department"
                value={
                  form.department
                }
                onChange={handleChange}
              >
                <option value="">
                  Select department
                </option>

                <option value="CSE">
                  CSE
                </option>

                <option value="ECE">
                  ECE
                </option>

                <option value="EEE">
                  EEE
                </option>

                <option value="Mechanical">
                  Mechanical
                </option>

                <option value="Civil">
                  Civil
                </option>

                <option value="Administration">
                  Administration
                </option>

                <option value="Hostel">
                  Hostel
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </label>

          </div>

          <button
            type="submit"
            className="primary-btn full"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Student Account"}
          </button>

        </form>

        <div className="switch-auth">
          Already have an account?{" "}
          <Link to="/student-login">
            Student Login
          </Link>
        </div>

      </div>

    </main>
  );
}

/* =========================================================
   ADMIN REGISTER
========================================================= */

function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      setError(
        "Please fill all required fields"
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await api.registerAdmin({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });

      saveSession(data);

      navigate(
        "/admin-dashboard"
      );

    } catch (errorObject) {
      setError(
        errorObject.message ||
        "Admin registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="register-shell">

        <div className="form-title">

          <div className="form-icon">
            <ShieldCheck size={21} />
          </div>

          <h2>
            Admin Registration
          </h2>

          <p>
            Create an administrator account
          </p>

        </div>

        {error && (
          <div className="error-box">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>
            Admin Name

            <input
              type="text"
              name="name"
              placeholder="Enter admin name"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Email

            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            className="primary-btn full"
            disabled={loading}
          >
            {loading
              ? "Creating admin..."
              : "Create Admin Account"}
          </button>

        </form>

        <div className="switch-auth">
          Already have an admin account?{" "}
          <Link to="/admin-login">
            Admin Login
          </Link>
        </div>

      </div>

    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const currentStatus =
    status || "Submitted";

  const className =
    String(currentStatus)
      .toLowerCase()
      .replace(/\s+/g, "-");

  return (
    <span
      className={`status-badge ${className}`}
    >
      {currentStatus}
    </span>
  );
}

/* =========================================================
   COMPLAINT ROW
========================================================= */

function ComplaintRow({
  complaint,
}) {
  const navigate = useNavigate();

  const id =
    complaint?._id ||
    complaint?.id;

  return (
    <button
      type="button"
      className="complaint-row"
      onClick={() =>
        navigate(`/complaints/${id}`)
      }
    >

      <div className="complaint-main">

        <div className="complaint-file-icon">
          <FileText size={18} />
        </div>

        <div>

          <h3>
            {complaint?.title ||
              "Untitled Complaint"}
          </h3>

          <p>
            {complaint?.category ||
              "General"}

            {" • "}

            {complaint?.department ||
              "Department not specified"}

            {complaint?.location && (
              <>
                {" • "}
                <MapPin size={12} />
                {" "}
                {complaint.location}
              </>
            )}
          </p>

        </div>

      </div>

      <div className="complaint-side">

        <StatusBadge
          status={
            complaint?.status ||
            "Submitted"
          }
        />

        <ArrowRight size={16} />

      </div>

    </button>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ admin = false }) {
  const navigate = useNavigate();

  const user = getStoredUser();

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = admin
        ? await api.all()
        : await api.mine();

      let list = [];

      if (Array.isArray(response)) {
        list = response;
      } else if (
        Array.isArray(
          response?.complaints
        )
      ) {
        list = response.complaints;
      } else if (
        Array.isArray(response?.data)
      ) {
        list = response.data;
      }

      setComplaints(list);

      const calculated = {
        total: list.length,
        submitted: 0,
        assigned: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
      };

      list.forEach((complaint) => {
        const currentStatus =
          String(
            complaint?.status ||
              "Submitted"
          )
            .toLowerCase()
            .replace(/\s+/g, "-");

        if (
          currentStatus ===
          "submitted"
        ) {
          calculated.submitted++;
        } else if (
          currentStatus ===
          "assigned"
        ) {
          calculated.assigned++;
        } else if (
          currentStatus ===
            "in-progress" ||
          currentStatus ===
            "inprogress"
        ) {
          calculated.inProgress++;
        } else if (
          currentStatus ===
          "resolved"
        ) {
          calculated.resolved++;
        } else if (
          currentStatus ===
          "rejected"
        ) {
          calculated.rejected++;
        }
      });

      setStats(calculated);

    } catch (errorObject) {
      console.error(
        "Dashboard error:",
        errorObject
      );

      setError(
        errorObject.message ||
        "Unable to load dashboard data"
      );

      setComplaints([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [admin]);

  const filteredComplaints =
    complaints.filter((complaint) => {
      if (!search.trim()) {
        return true;
      }

      const text = [
        complaint?.title,
        complaint?.category,
        complaint?.department,
        complaint?.location,
        complaint?.status,
        complaint?.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    });

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="loading">
            Loading dashboard...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">

      <div className="container">

        <div className="dash-head">

          <div>

            <div className="eyebrow">
              <span></span>

              {admin
                ? "ADMIN CONTROL CENTER"
                : "STUDENT DASHBOARD"}
            </div>

            <h1>
              {admin
                ? "Manage Complaints"
                : `Welcome, ${
                    user?.name ||
                    "Student"
                  }`}
            </h1>

            <p>
              {admin
                ? "View and manage complaints submitted by students."
                : "View your complaints and track their current status."}
            </p>

          </div>

          <div className="form-actions">

            {!admin && (
              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  navigate(
                    "/raise-complaint"
                  )
                }
              >
                <PlusCircle size={17} />
                Raise Complaint
              </button>
            )}

            <button
              type="button"
              className="secondary-btn"
              onClick={loadDashboard}
            >
              <RefreshCw size={15} />
              Refresh
            </button>

          </div>

        </div>

        {error && (
          <div className="error-box">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="stats-grid">

          <StatCard
            icon={
              <ClipboardList size={19} />
            }
            title="Total"
            value={stats.total}
          />

          <StatCard
            icon={
              <Clock3 size={19} />
            }
            title="Submitted"
            value={stats.submitted}
          />

          <StatCard
            icon={
              <AlertCircle size={19} />
            }
            title="In Progress"
            value={
              stats.assigned +
              stats.inProgress
            }
          />

          <StatCard
            icon={
              <CheckCircle2 size={19} />
            }
            title="Resolved"
            value={stats.resolved}
          />

        </div>

        <div className="table-card">

          <div className="table-head">

            <div>

              <h2>
                {admin
                  ? "All Complaints"
                  : "My Complaints"}
              </h2>

              <p>
                {filteredComplaints.length}{" "}
                complaint
                {filteredComplaints.length !==
                1
                  ? "s"
                  : ""}{" "}
                found
              </p>

            </div>

            <div className="search-box">

              <Search size={15} />

              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

          {filteredComplaints.length ===
          0 ? (
            <div className="empty">

              <ClipboardList size={38} />

              <h3>
                {search
                  ? "No matching complaints"
                  : "No complaints yet"}
              </h3>

              <p>
                {search
                  ? "Try a different search term."
                  : admin
                    ? "Student complaints will appear here when they are submitted."
                    : "Your submitted complaints will appear here."}
              </p>

              {!admin &&
                !search && (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() =>
                      navigate(
                        "/raise-complaint"
                      )
                    }
                  >
                    <PlusCircle size={16} />
                    Raise Your First
                    Complaint
                  </button>
                )}

            </div>
          ) : (
            <div>
              {filteredComplaints.map(
                (complaint) => (
                  <ComplaintRow
                    key={
                      complaint?._id ||
                      complaint?.id
                    }
                    complaint={complaint}
                  />
                )
              )}
            </div>
          )}

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   RAISE COMPLAINT
========================================================= */

function RaiseComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    department: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !form.title.trim() ||
      !form.category ||
      !form.department ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      setError(
        "Please fill all required fields"
      );
      return;
    }

    try {
      setLoading(true);

      await api.createComplaint({
        title: form.title.trim(),
        category: form.category,
        department: form.department,
        location: form.location.trim(),
        description:
          form.description.trim(),
      });

      alert(
        "Complaint submitted successfully"
      );

      navigate(
        "/student-dashboard"
      );

    } catch (errorObject) {
      console.error(
        "Complaint submission error:",
        errorObject
      );

      setError(
        errorObject.message ||
        "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="form-page">

      <div className="container narrow">

        <button
          type="button"
          className="page-back"
          onClick={() =>
            navigate(
              "/student-dashboard"
            )
          }
        >
          ← Back to Dashboard
        </button>

        <div className="page-title">

          <div className="eyebrow">
            <span></span>
            STUDENT SERVICE
          </div>

          <h1>
            Raise a Complaint
          </h1>

          <p>
            Submit your campus issue
            and track its progress.
          </p>

        </div>

        <div className="table-card">

          {error && (
            <div className="error-box">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form
            className="big-form"
            onSubmit={handleSubmit}
          >

            <div className="two-col">

              <label>
                Complaint Title

                <input
                  type="text"
                  name="title"
                  placeholder="Enter complaint title"
                  value={form.title}
                  onChange={handleChange}
                />
              </label>

              <label>
                Category

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Infrastructure">
                    Infrastructure
                  </option>

                  <option value="Academic">
                    Academic
                  </option>

                  <option value="Hostel">
                    Hostel
                  </option>

                  <option value="Transport">
                    Transport
                  </option>

                  <option value="Cleanliness">
                    Cleanliness
                  </option>

                  <option value="Electrical">
                    Electrical
                  </option>

                  <option value="Internet">
                    Internet
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </label>

              <label>
                Department

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">
                    Select department
                  </option>

                  <option value="CSE">
                    CSE
                  </option>

                  <option value="ECE">
                    ECE
                  </option>

                  <option value="EEE">
                    EEE
                  </option>

                  <option value="Mechanical">
                    Mechanical
                  </option>

                  <option value="Civil">
                    Civil
                  </option>

                  <option value="Administration">
                    Administration
                  </option>

                  <option value="Hostel">
                    Hostel
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </label>

              <label>
                Location

                <input
                  type="text"
                  name="location"
                  placeholder="Example: Block A, Room 204"
                  value={form.location}
                  onChange={handleChange}
                />
              </label>

            </div>

            <label>
              Complaint Description

              <textarea
                name="description"
                rows="7"
                placeholder="Describe your issue clearly..."
                value={form.description}
                onChange={handleChange}
              />
            </label>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  navigate(
                    "/student-dashboard"
                  )
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Complaint"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   COMPLAINT DETAILS
========================================================= */

function ComplaintDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const user = getStoredUser();

  const [complaint, setComplaint] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [status, setStatus] =
    useState("Submitted");

  const [resolution, setResolution] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  const loadComplaint = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.complaint(id);

      const data =
        response?.complaint ||
        response?.data ||
        response;

      setComplaint(data);

      setStatus(
        data?.status ||
        "Submitted"
      );

      setResolution(
        data?.resolution ||
        data?.resolutionDescription ||
        ""
      );

    } catch (errorObject) {
      console.error(
        "Complaint details error:",
        errorObject
      );

      setError(
        errorObject.message ||
        "Unable to load complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const updateComplaint =
    async () => {
      try {
        setUpdating(true);
        setError("");

        const formData =
          new FormData();

        formData.append(
          "status",
          status
        );

        if (resolution.trim()) {
          formData.append(
            "resolution",
            resolution.trim()
          );
        }

        await api.updateStatus(
          id,
          formData
        );

        await loadComplaint();

        alert(
          "Complaint updated successfully"
        );

      } catch (errorObject) {
        console.error(
          "Complaint update error:",
          errorObject
        );

        setError(
          errorObject.message ||
          "Failed to update complaint"
        );
      } finally {
        setUpdating(false);
      }
    };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="loading">
            Loading complaint...
          </div>
        </div>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="dashboard-page">

        <div className="container">

          <div className="empty">

            <FileText size={40} />

            <h3>
              Complaint not found
            </h3>

            <p>
              Unable to find this complaint.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                navigate(
                  dashboardPath(user)
                )
              }
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="details-page">

      <div className="container">

        <button
          type="button"
          className="page-back"
          onClick={() =>
            navigate(
              dashboardPath(user)
            )
          }
        >
          ← Back to Dashboard
        </button>

        <div className="detail-header">

          <div>

            <div className="eyebrow">
              <span></span>
              COMPLAINT DETAILS
            </div>

            <h1>
              {complaint.title ||
                "Complaint"}
            </h1>

            <p>
              Complaint ID:{" "}
              {complaint._id ||
                complaint.id ||
                "N/A"}
            </p>

          </div>

          <StatusBadge
            status={
              complaint.status ||
              "Submitted"
            }
          />

        </div>

        {error && (
          <div className="error-box">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="detail-grid">

          <div className="detail-card">

            <h2>
              Complaint Information
            </h2>

            <div className="description">

              <h3>
                Description
              </h3>

              <p>
                {complaint.description ||
                  "No description provided."}
              </p>

            </div>

            <div className="meta-grid">

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {complaint.category ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>
                  Department
                </span>

                <strong>
                  {complaint.department ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>
                  Location
                </span>

                <strong>
                  {complaint.location ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>
                  Status
                </span>

                <strong>
                  {complaint.status ||
                    "Submitted"}
                </strong>
              </div>

              <div>
                <span>
                  Created
                </span>

                <strong>
                  {complaint.createdAt
                    ? new Date(
                        complaint.createdAt
                      ).toLocaleDateString()
                    : "Not available"}
                </strong>
              </div>

            </div>

          </div>

          {user?.role === "admin" && (
            <div className="admin-update">

              <h2>
                Update Complaint
              </h2>

              <p>
                Update the complaint status
                and add a resolution note.
              </p>

              <label>
                Status

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                >
                  <option value="Submitted">
                    Submitted
                  </option>

                  <option value="Assigned">
                    Assigned
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>
                </select>
              </label>

              <label>
                Resolution / Admin Note

                <textarea
                  rows="5"
                  placeholder="Enter resolution details..."
                  value={resolution}
                  onChange={(event) =>
                    setResolution(
                      event.target.value
                    )
                  }
                />
              </label>

              <button
                type="button"
                className="primary-btn"
                disabled={updating}
                onClick={
                  updateComplaint
                }
              >
                {updating
                  ? "Updating..."
                  : "Update Complaint"}
              </button>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}

/* =========================================================
   APP ROUTES
========================================================= */

function App() {
  return (
    <>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/student-login"
          element={
            <AuthPage admin={false} />
          }
        />

        <Route
          path="/student-register"
          element={<Register />}
        />

        <Route
          path="/admin-login"
          element={
            <AuthPage admin={true} />
          }
        />

        <Route
          path="/admin-register"
          element={
            <AdminRegister />
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute role="student">
              <Dashboard admin={false} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <Dashboard admin={true} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/raise-complaint"
          element={
            <ProtectedRoute role="student">
              <RaiseComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </>
  );
}

export default App;

