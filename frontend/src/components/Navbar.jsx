import React from 'react';
import { Sprout, ChevronLeft } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Sprout size={28} />
        <div>
          FarmDirect <span>Yield Prediction</span>
        </div>
      </div>
      <a href="#" className="back-btn">
        <ChevronLeft size={18} />
        Back to FarmDirect
      </a>
    </nav>
  );
};

export default Navbar;
