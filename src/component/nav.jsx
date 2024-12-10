import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="hover:text-blue-300 transition duration-300 ">
          <h1 className="text-xl font-bold ">MedicineBox</h1>
        </Link>

        {/* Hamburger menu button for small screens */}
        <button
          className="lg:hidden text-white"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation menu */}
        <ul
          className={`flex items-center space-x-4 ${
            isMenuOpen ? 'block' : 'hidden'
          } lg:flex lg:space-x-4`}
        >
          <li>
            <Link
              to="/"
              className="hover:text-blue-300 transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/mqtt"
              className="hover:text-blue-300 transition duration-300"
            >
              MQTT
            </Link>
          </li>
          <li>
            <Link
              to="/medicine-form1"
              className="hover:text-blue-300 transition duration-300"
            >
              Medicine Form
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;