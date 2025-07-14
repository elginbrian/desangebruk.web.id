"use client";

import React, { useEffect, useState } from "react";

interface WeatherEffectsProps {
  weatherCode: string;
  description: string;
  intensity?: "light" | "medium" | "heavy";
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherCode, description, intensity = "medium" }) => {
  const [mounted, setMounted] = useState(false);
  const [effectsVisible, setEffectsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setEffectsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const getWeatherType = (code: string, desc: string): string => {
    const codeNum = parseInt(code);
    const descLower = desc.toLowerCase();

    if (codeNum >= 200 && codeNum <= 299) return "stormy";
    if (codeNum >= 300 && codeNum <= 399) return "drizzle";
    if (codeNum >= 500 && codeNum <= 531) return "rainy";
    if (codeNum === 502 || codeNum === 503 || codeNum === 504) return "heavy-rain";

    if (descLower.includes("heavy rain") || descLower.includes("torrential")) return "heavy-rain";
    if (descLower.includes("light rain") || descLower.includes("drizzle")) return "drizzle";
    if (descLower.includes("moderate rain") || descLower.includes("rain")) return "rainy";
    if (descLower.includes("thunderstorm") || descLower.includes("lightning")) return "stormy";

    if (codeNum >= 600 && codeNum <= 699) return "snowy";
    if (descLower.includes("snow") || descLower.includes("blizzard")) return "snowy";

    if (codeNum >= 700 && codeNum <= 799) return "foggy";
    if (descLower.includes("fog") || descLower.includes("mist") || descLower.includes("haze")) return "foggy";

    if (codeNum === 800) return "sunny";
    if (descLower.includes("clear") || descLower.includes("sunny")) return "sunny";

    if (codeNum === 801) return "few-clouds";
    if (codeNum === 802) return "scattered-clouds";
    if (codeNum === 803) return "broken-clouds";
    if (codeNum === 804) return "overcast";
    if (descLower.includes("cloud") || descLower.includes("overcast")) return "overcast";

    return "few-clouds";
  };

  const weatherType = getWeatherType(weatherCode, description);

  const generateRainDrops = (isStormy = false, isHeavy = false) => {
    const drops = [];
    let baseDropCount = intensity === "light" ? 25 : intensity === "medium" ? 50 : 80;

    if (isHeavy) baseDropCount = baseDropCount * 2.5;
    else if (isStormy) baseDropCount = baseDropCount * 1.8;

    const dropCount = baseDropCount;

    for (let i = 0; i < dropCount; i++) {
      const delay = Math.random() * (isStormy ? 1.5 : isHeavy ? 1 : 3);
      const baseDuration = isHeavy ? 0.3 : isStormy ? 0.4 : 0.8;
      const duration = baseDuration + Math.random() * (isHeavy ? 0.2 : isStormy ? 0.3 : 0.6);
      const left = Math.random() * 110;

      const minHeight = isHeavy ? 20 : isStormy ? 15 : 8;
      const maxHeight = isHeavy ? 40 : isStormy ? 25 : 15;
      const height = minHeight + Math.random() * (maxHeight - minHeight);

      const baseOpacity = isHeavy ? 0.6 : isStormy ? 0.4 : 0.3;
      const opacity = baseOpacity + Math.random() * (isHeavy ? 0.4 : isStormy ? 0.6 : 0.5);

      const windIntensity = isHeavy ? 100 : isStormy ? 80 : 40;
      const windOffset = Math.random() * windIntensity;

      const isThickDrop = Math.random() < (isHeavy ? 0.3 : isStormy ? 0.2 : 0.1);
      const dropWidth = isThickDrop ? (isHeavy ? 3 : 2.5) : isHeavy ? 2 : isStormy ? 2 : 1.5;

      drops.push(
        <div
          key={i}
          className={`rain-drop ${isStormy ? "stormy" : ""} ${isHeavy ? "heavy" : ""}`}
          style={
            {
              left: `${left}%`,
              height: `${height}px`,
              width: `${dropWidth}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              opacity: effectsVisible ? opacity : 0,
              transition: "opacity 0.5s ease-in-out",
              "--wind-offset": `${windOffset}px`,
            } as React.CSSProperties
          }
        />
      );
    }
    return drops;
  };

  const generateSnowFlakes = () => {
    const flakes = [];
    const flakeCount = intensity === "light" ? 20 : intensity === "medium" ? 40 : 70;

    for (let i = 0; i < flakeCount; i++) {
      const delay = Math.random() * 4;
      const duration = 4 + Math.random() * 3;
      const left = Math.random() * 100;
      const symbols = ["❄", "❅", "❆"];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const opacity = 0.4 + Math.random() * 0.4;

      flakes.push(
        <div
          key={i}
          className="snow-flake"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            fontSize: `${6 + Math.random() * 6}px`,
            opacity: effectsVisible ? opacity : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        >
          {symbol}
        </div>
      );
    }
    return flakes;
  };

  const generateClouds = (cloudType = "normal") => {
    const clouds = [];
    let cloudCount = intensity === "light" ? 2 : intensity === "medium" ? 3 : 4;

    if (cloudType === "few") cloudCount = Math.max(1, Math.floor(cloudCount * 0.5));
    if (cloudType === "scattered") cloudCount = Math.floor(cloudCount * 0.8);
    if (cloudType === "broken") cloudCount = Math.floor(cloudCount * 1.2);
    if (cloudType === "overcast") cloudCount = Math.floor(cloudCount * 1.5);

    for (let i = 0; i < cloudCount; i++) {
      const delay = Math.random() * 20;
      const baseDuration = cloudType === "overcast" ? 40 : 30;
      const duration = baseDuration + Math.random() * 20;
      const top = cloudType === "overcast" ? Math.random() * 60 : 5 + Math.random() * 30;
      const width = 60 + Math.random() * 40;
      const height = 20 + Math.random() * 20;

      let opacity = 0.15 + Math.random() * 0.15;
      if (cloudType === "few") opacity *= 0.6;
      if (cloudType === "overcast") opacity *= 1.8;

      clouds.push(
        <div
          key={i}
          className={`cloud cloud-${cloudType}`}
          style={{
            top: `${top}%`,
            width: `${width}px`,
            height: `${height}px`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            opacity: effectsVisible ? opacity : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      );
    }
    return clouds;
  };

  const generateFogLayers = () => {
    return (
      <>
        <div
          className="fog-layer"
          style={{
            opacity: effectsVisible ? 0.6 : 0,
            transition: "opacity 1.2s ease-in-out",
          }}
        />
        <div
          className="fog-layer"
          style={{
            opacity: effectsVisible ? 0.4 : 0,
            transition: "opacity 1.5s ease-in-out",
            transitionDelay: "0.3s",
          }}
        />
        <div
          className="fog-layer"
          style={{
            opacity: effectsVisible ? 0.5 : 0,
            transition: "opacity 1.8s ease-in-out",
            transitionDelay: "0.6s",
          }}
        />
      </>
    );
  };

  const generateLightningEffects = () => {
    return (
      <>

        <div className="lightning-flash" />


        <div
          className="lightning-bolt"
          style={{
            opacity: effectsVisible ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        />


        <div className="lightning-streaks">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`lightning-streak lightning-streak-${i + 1}`}
              style={{
                opacity: effectsVisible ? 0.8 : 0,
                transition: `opacity 0.6s ease-in-out`,
                transitionDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </>
    );
  };

  const renderWeatherEffect = () => {
    switch (weatherType) {
      case "drizzle":
        return <div className={`rain-container drizzle transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateRainDrops(false, false)}</div>;

      case "rainy":
        return <div className={`rain-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateRainDrops(false, false)}</div>;

      case "heavy-rain":
        return <div className={`rain-container heavy-rain transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateRainDrops(false, true)}</div>;

      case "snowy":
        return <div className={`snow-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateSnowFlakes()}</div>;

      case "few-clouds":
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("few")}</div>;

      case "scattered-clouds":
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("scattered")}</div>;

      case "broken-clouds":
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("broken")}</div>;

      case "overcast":
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("overcast")}</div>;

      case "stormy":
        return (
          <>
            <div className={`rain-container storm-rain transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateRainDrops(true, false)}</div>
            <div className={`lightning-container transition-opacity duration-500 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateLightningEffects()}</div>
          </>
        );

      case "sunny":
        return (
          <div className={`sun-rays-container transition-opacity duration-1500 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="sun-rays" />
          </div>
        );

      case "foggy":
        return <div className={`fog-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateFogLayers()}</div>;

      default:
        return <div className={`clouds-container transition-opacity duration-1000 ${effectsVisible ? "opacity-100" : "opacity-0"}`}>{generateClouds("few")}</div>;
    }
  };

  return <>{renderWeatherEffect()}</>;
};

export default WeatherEffects;

