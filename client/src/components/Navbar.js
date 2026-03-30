import { FiCheckSquare, FiLogOut } from "react-icons/fi";
import logo from "../assets/momentumlogo.png";
import { useNavigate, NavLink } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo">
          <img src={logo} alt="Momentum" />
          <h2>Momentum</h2>
        </div>
        <NavLink to="/dashboard">
          <FiCheckSquare className="nav-icon" />{" "}
          <span className="nav-text">Habits</span>
        </NavLink>
      </div>
      <button onClick={handleLogout}>
        <FiLogOut /> Sign Out
      </button>
    </div>
  );
}
export default Navbar;
