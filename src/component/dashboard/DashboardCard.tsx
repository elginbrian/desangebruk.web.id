import { IconType } from "react-icons";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

interface DashboardCardProps {
  title: string;
  value: string;
  percentage: string;
  change: string;
  isPositive: boolean;
}

const DashboardCard = ({ title, value, percentage, change, isPositive }: DashboardCardProps) => {
  const textColor = isPositive ? "text-green-600" : "text-red-500";
  const Icon = isPositive ? FiArrowUp : FiArrowDown;

  return (
    <div className="bg-white app-card shadow-sm border border-gray-100">
      <p className="text-gray-600 text-xs mb-2">{title}</p>
      <h3 className="app-text-xl font-bold text-black mb-3">{value}</h3>

      <div className="flex items-center">
        <Icon className={`${textColor} mr-1`} size={12} />
        <span className={`${textColor} text-xs font-medium mr-1`}>{percentage}</span>
        <span className="text-gray-400 text-xs">{change}</span>
      </div>
    </div>
  );
};

export default DashboardCard;
