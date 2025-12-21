"use client";

import { useQ40 } from "../SurveyContext";
import { VEHICLE_SHAPES, VehicleShape } from "../types";

export function Q40VehicleShape() {
  const { data, update } = useQ40();

  const handleShapeChange = (shape: VehicleShape) => {
    update({ shape });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-purple-600 text-white px-4 py-3">
        <h3 className="font-bold text-lg">問40 車両形状の選択</h3>
        <p className="text-sm text-purple-100 mt-1">
          対象となる単車について、車両形状を選択してください。
        </p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VEHICLE_SHAPES.map((shape) => (
            <label
              key={shape.id}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border transition-colors ${
                data.shape === shape.id
                  ? "bg-purple-50 border-purple-300"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="vehicleShape"
                value={shape.id}
                checked={data.shape === shape.id}
                onChange={() => handleShapeChange(shape.id)}
                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
              />
              <span className="font-medium text-gray-800">{shape.label}</span>
            </label>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          ※ 1台の単車について回答してください
        </p>
      </div>
    </div>
  );
}
