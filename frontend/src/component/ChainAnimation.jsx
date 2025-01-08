import React, { useEffect, useRef } from 'react';

export default function ChainAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-chain');
          } else {
            entry.target.classList.remove('animate-chain'); // Replay animation if needed
          }
        });
      },
      { threshold: 0.1 }
    );

    const container = containerRef.current;

    if (container) {
      const links = container.querySelectorAll('.chain-link');
      links.forEach((link) => observer.observe(link));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes chainMove {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }

          .chain-container {
            display: flex;
            gap: 2rem;
            padding: 2rem 0;
            white-space: nowrap;
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

          .animate-chain .chain-link {
            animation: chainMove 20s linear infinite;
          }
        `}
      </style>
      <div ref={containerRef} className="py-20 overflow-hidden bg-gray-900">
        <div className="chain-container">
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="chain-link">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                DePINS.io
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
