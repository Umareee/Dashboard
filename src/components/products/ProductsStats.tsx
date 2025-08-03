import React from "react";
import { useProducts } from "@/context/ProductContext";
import { BoxIcon, DollarLineIcon, CheckCircleIcon, AlertIcon } from "@/icons";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: "blue" | "green" | "orange" | "red";
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-500/15 text-blue-500 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-500/15 text-green-500 dark:text-green-400", 
    orange: "bg-orange-50 dark:bg-orange-500/15 text-orange-500 dark:text-orange-400",
    red: "bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400"
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}{trend.value}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function ProductsStats() {
  const { products } = useProducts();
  
  const totalProducts = products.length;
  const inStock = products.filter(p => p.stock === "In Stock").length;
  const outOfStock = products.filter(p => p.stock === "Out of Stock").length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: <BoxIcon className="h-6 w-6" />,
      trend: { value: "12%", isPositive: true },
      color: "blue" as const
    },
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: <DollarLineIcon className="h-6 w-6" />,
      trend: { value: "8.2%", isPositive: true },
      color: "green" as const
    },
    {
      title: "In Stock",
      value: inStock.toString(),
      icon: <CheckCircleIcon className="h-6 w-6" />,
      trend: { value: "5%", isPositive: true },
      color: "green" as const
    },
    {
      title: "Out of Stock",
      value: outOfStock.toString(),
      icon: <AlertIcon className="h-6 w-6" />,
      trend: { value: "3%", isPositive: false },
      color: "red" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
}
