import React from "react";

export default function StatusChip({ text, bgColor }) {
  return (
    <div className="status-chip" style={{ backgroundColor: bgColor }}>
      {text}
    </div>
  );
}
