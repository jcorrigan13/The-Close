import type { PortraitConfig } from "../types";

interface PortraitProps {
  config: PortraitConfig;
  name: string;
  size?: "small" | "medium" | "large";
}

export function Portrait({ config, name, size = "medium" }: PortraitProps) {
  const faceRadiusX = config.faceShape === "square" ? 25 : config.faceShape === "heart" ? 22 : 24;
  const faceRadiusY = config.faceShape === "round" ? 25 : 29;
  const mouthPath =
    config.expression === "worried"
      ? "M42 70 Q50 66 58 70"
      : config.expression === "serious"
        ? "M42 69 L58 69"
        : "M40 67 Q50 75 60 67";

  return (
    <div className={`portrait portrait-${size}`} role="img" aria-label={`${name} portrait`}>
      <svg viewBox="0 0 100 110" aria-hidden="true">
        <rect x="16" y="78" width="68" height="28" rx="16" fill={config.outfitColor} />
        <ellipse cx="50" cy="48" rx={faceRadiusX} ry={faceRadiusY} fill={config.skinTone} />
        {config.hairStyle !== "bald" && <Hair styleName={config.hairStyle} color={config.hairColor} />}
        <circle cx="41" cy="55" r="2.4" fill="#2a2a2a" />
        <circle cx="59" cy="55" r="2.4" fill="#2a2a2a" />
        <path d={mouthPath} fill="none" stroke="#6e4037" strokeWidth="2.5" strokeLinecap="round" />
        {config.expression === "wry" && <path d="M56 68 Q61 70 63 66" fill="none" stroke="#6e4037" strokeWidth="2" />}
        {config.accessory === "glasses" && (
          <g fill="none" stroke="#2f3c44" strokeWidth="2">
            <circle cx="41" cy="55" r="7" />
            <circle cx="59" cy="55" r="7" />
            <path d="M48 55 L52 55" />
          </g>
        )}
        {config.accessory === "scarf" && <path d="M35 82 Q50 90 66 82 L70 96 Q50 102 30 94 Z" fill="#e3d6bd" />}
        {config.accessory === "earrings" && (
          <g fill="#e3b34b">
            <circle cx="25" cy="58" r="3" />
            <circle cx="75" cy="58" r="3" />
          </g>
        )}
        {config.accessory === "cap" && <path d="M28 28 Q50 14 72 28 L75 36 Q50 31 25 36 Z" fill={config.hairColor} />}
        {config.accessory === "beard" && <path d="M34 61 Q50 86 66 61 Q62 83 50 86 Q38 83 34 61" fill={config.hairColor} opacity="0.75" />}
      </svg>
    </div>
  );
}

function Hair({ styleName, color }: { styleName: PortraitConfig["hairStyle"]; color: string }) {
  if (styleName === "bun") {
    return (
      <g fill={color}>
        <circle cx="50" cy="17" r="11" />
        <path d="M26 42 Q31 17 50 20 Q69 17 74 42 Q65 30 50 31 Q35 30 26 42" />
      </g>
    );
  }
  if (styleName === "bob") {
    return <path d="M24 47 Q26 17 50 17 Q74 17 76 47 L70 66 Q60 32 50 31 Q40 32 30 66 Z" fill={color} />;
  }
  if (styleName === "waves") {
    return <path d="M23 48 Q25 20 48 18 Q69 17 77 42 Q70 35 62 39 Q52 26 40 36 Q31 34 23 48" fill={color} />;
  }
  if (styleName === "curls") {
    return (
      <g fill={color}>
        {[
          [30, 35],
          [38, 25],
          [50, 22],
          [62, 25],
          [70, 35],
          [27, 47],
          [73, 47],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="9" />
        ))}
      </g>
    );
  }
  return <path d="M27 39 Q31 18 50 18 Q69 18 73 39 Q58 31 50 31 Q42 31 27 39" fill={color} />;
}
