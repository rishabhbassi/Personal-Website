import React, { useState } from "react";

export default function TestTooltip() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: 200,
        height: 200,
        backgroundColor: "#333",
        margin: "40px auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <div
        onMouseEnter={() => {
          console.log("hover start");
          setHovered(true);
        }}
        onMouseLeave={() => {
          console.log("hover end");
          setHovered(false);
        }}
        style={{
          width: 60,
          height: 60,
          backgroundColor: "teal",
          borderRadius: "50%",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {hovered && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginBottom: 12,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              border: "2px solid yellow",
              color: "white",
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: "500",
              whiteSpace: "nowrap",
              userSelect: "none",
              pointerEvents: "none",
              zIndex: 9999,
              boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
            }}
          >
            Haryana, India
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                marginLeft: -8,
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid rgba(0, 0, 0, 0.9)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
