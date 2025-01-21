import React, { useEffect, useRef, useState } from "react";

export default function ChainAnimation() {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      const direction = currentScroll > scrollPosition ? -1 : 1;
      setScrollPosition(currentScroll);

      if (containerRef.current) {
        const currentTransform = getComputedStyle(
          containerRef.current
        ).transform;
        const translateX =
          currentTransform !== "none"
            ? parseFloat(currentTransform.split(",")[4])
            : 0;

        containerRef.current.style.transform = `translateX(${
          translateX + direction * 10
        }px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);

  return (
    <>
      <style>
        {`
          .chain-container {
            display: flex;
            gap: 1.5rem; /* Reduced spacing */
            padding: 1rem 0; /* Reduced spacing */
            white-space: nowrap;
            transition: transform 0.1s ease-out;
          }

          .chain-link {
            flex-shrink: 0;
            position: relative;
          }

          .chain-link::before {
            content: '';
            position: absolute;
            left: -1rem;
            top: 50%;
            width: 1rem;
            height: 2px;
            background: linear-gradient(to right, #0891b2, #0ea5e9);
          }

          .chain-link span {
            font-size: 1.5rem;
            font-weight: bold;
            background: linear-gradient(to right, #38bdf8, #0ea5e9);
            -webkit-background-clip: text;
            color: transparent;
          }
        `}
      </style>
      <div ref={containerRef} className="chain-container">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="chain-link">
            <span>Dpins.ai</span>
          </div>
        ))}
      </div>
    </>
  );
}
