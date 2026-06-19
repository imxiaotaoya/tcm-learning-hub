import { ShieldAlert, AlertTriangle, Info } from "lucide-react";
import type { ReactNode } from "react";
import type { RiskLevel } from "../utils/riskRules";

interface SafetyBannerProps {
  riskLevel: RiskLevel;
  message: string;
  hideOnLow?: boolean;
}

export default function SafetyBanner({
  riskLevel,
  message,
  hideOnLow = true,
}: SafetyBannerProps) {
  if (hideOnLow && riskLevel === "low") return null;
  if (!message) return null;

  const styles: Record<
    RiskLevel,
    { bg: string; border: string; text: string; icon: ReactNode }
  > = {
    high: {
      bg: "bg-red-50 border-red-300",
      border: "border-l-4 border-red-500",
      text: "text-red-800",
      icon: <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />,
    },
    medium: {
      bg: "bg-amber-50 border-amber-300",
      border: "border-l-4 border-amber-500",
      text: "text-amber-800",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />,
    },
    low: {
      bg: "bg-blue-50 border-blue-200",
      border: "border-l-4 border-blue-400",
      text: "text-blue-700",
      icon: <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />,
    },
  };

  const s = styles[riskLevel];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl mb-4 border ${s.bg} ${s.border}`}
      role="alert"
    >
      {s.icon}
      <p className={`text-xs leading-relaxed font-serif font-semibold ${s.text}`}>
        {message}
      </p>
    </div>
  );
}
