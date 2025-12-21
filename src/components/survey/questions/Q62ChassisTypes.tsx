"use client";

import { useQ62 } from "../SurveyContext";
import { CHASSIS_TYPES, ChassisType } from "../types";

export function Q62ChassisTypes() {
  const { data, update } = useQ62();

  const handleChassisToggle = (chassisType: ChassisType) => {
    const newChassisTypes = data.chassisTypes.includes(chassisType)
      ? data.chassisTypes.filter((t) => t !== chassisType)
      : [...data.chassisTypes, chassisType];
    update({ chassisTypes: newChassisTypes });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-orange-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問62 牽引シャーシ</h3>
        <p className="text-sm text-orange-100 mt-1">
          この車両が牽引する主なシャーシを選択してください。なお、バン型（常温）以外の特殊車両は別様式（WEB又はエクセル様式）から回答ください。（複数選択可）
        </p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CHASSIS_TYPES.map((chassis) => (
            <label
              key={chassis.id}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border transition-colors ${
                data.chassisTypes.includes(chassis.id)
                  ? "bg-orange-50 border-orange-300"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={data.chassisTypes.includes(chassis.id)}
                onChange={() => handleChassisToggle(chassis.id)}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="font-medium text-gray-800">{chassis.label}</span>
            </label>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          ※ 1台のトラクターについて回答してください（複数選択可）
        </p>
      </div>
    </div>
  );
}
