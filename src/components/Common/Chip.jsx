import React from "react";
import "./Chip.scss";

const Chip = ({ label, selected, onClick }) => {
  return (
    <div
      className={`chip ${selected ? "chip--selected" : ""}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default Chip;
