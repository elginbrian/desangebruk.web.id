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
    <div className="bg-white app-card shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col justify-between h-full min-h-[100px] sm:min-h-[120px]">
        {/* Title */}
        <div className="mb-2">
          <p className="text-gray-600 text-xs font-medium leading-tight">{title}</p>
        </div>

        {/* Value */}
        <div className="mb-3 flex-grow flex items-center">
          <h3 className="app-text-xl font-bold text-black leading-tight break-words">{value}</h3>
        </div>

        {/* Change indicator */}
        <div className="flex items-center justify-start gap-1">
          <div className="flex items-center flex-shrink-0">
            <Icon className={`${textColor} mr-1`} size={12} />
            <span className={`${textColor} text-xs font-medium`}>{percentage}</span>
          </div>
          <span className="text-gray-400 text-xs truncate ml-1">{change}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
