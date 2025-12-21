"use client";

import { Truck } from "lucide-react";
import { useQ2 } from "../SurveyContext";

interface Q2VehicleCountProps {
  className?: string;
}

export function Q2VehicleCount({ className = "" }: Q2VehicleCountProps) {
  const { data, update } = useQ2();

  const handleChange = (value: string) => {
    update({ totalVehicles: value });
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Truck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">設問2</h2>
          <p className="text-slate-600 text-sm">
            【全ての営業所】で保有する車両台数についてご記入ください。
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-slate-700 font-medium">保有車両台数</label>
        <input
          type="number"
          min="0"
          value={data.totalVehicles}
          onChange={(e) => handleChange(e.target.value)}
          className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
          placeholder="0"
        />
        <span className="text-slate-700">両</span>
      </div>
    </div>
  );
}
