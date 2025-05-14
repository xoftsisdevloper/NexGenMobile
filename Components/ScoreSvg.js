import React from "react";
import Svg, { Polygon, Circle, Text as SvgText } from "react-native-svg";

const StarBurstSVG = ({ value = "100", size = 120 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Star burst shape */}
      <Polygon
        points="50,5 60,35 90,35 65,55 75,85 50,65 25,85 35,55 10,35 40,35"
        fill="#f1c40f"
        stroke="#e67e22"
        strokeWidth="2"
      />

      {/* Inner circle for contrast */}
      <Circle cx="50" cy="50" r="18" fill="#fff" />

      {/* Score Text */}
      <SvgText
        x="50"
        y="56"
        fontSize="16"
        fontWeight="bold"
        fill="#e67e22"
        textAnchor="middle"
      >
        {value}
      </SvgText>
    </Svg>
  );
};

export default StarBurstSVG;
