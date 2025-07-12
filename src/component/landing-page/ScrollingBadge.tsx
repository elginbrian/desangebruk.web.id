"use client";

import React from "react";

const ScrollingBadge = () => {
  const badges = ["🏛️ Transparan", "📋 Informatif", "🤝 Melayani", "🔄 Transparan", "📊 Informatif", "💫 Melayani"];

  return (
    <div className="bg-yellow-400 text-black py-3 overflow-hidden">
      <div className="flex animate-scroll">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center whitespace-nowrap px-8 text-sm font-semibold">
            <span>{badge}</span>
            <span className="ml-8 text-yellow-600">•</span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {badges.map((badge, index) => (
          <div key={`duplicate-${index}`} className="flex items-center whitespace-nowrap px-8 text-sm font-semibold">
            <span>{badge}</span>
            <span className="ml-8 text-yellow-600">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingBadge;
