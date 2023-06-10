import { useEffect } from "react";

export const Button = ({ onClick, maxClicks }) => {
  const [clicks, setClicks] = useEffect(0);
  return (
    <div>
      <button
        disabled={maxClicks && clicks > maxClicks}
        onClick={() => {
          if (maxClicks && clicks < maxClicks) {
            onClick();
          }
          setClicks(clicks + 1);
        }}
      >
        {clicks}
      </button>
    </div>
  );
};
