"use client";

import { LucideIcon } from "lucide-react";

const DEFAULT_OPTIONS = [
  { value: "yes", label: "はい" },
  { value: "no", label: "いいえ" },
  { value: "unknown", label: "把握していない" },
];

interface RadioQuestionProps {
  questionNumber: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  note?: string;
  showNoteWhen?: string;
  className?: string;
}

export function RadioQuestion({
  questionNumber,
  title,
  description,
  icon: Icon,
  iconBgColor,
  iconColor,
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  note,
  showNoteWhen,
  className = "",
}: RadioQuestionProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <p className="text-slate-600 text-sm">{description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-colors border-2 ${
              value === option.value
                ? "bg-blue-50 border-blue-300"
                : "bg-white border-slate-200 hover:bg-slate-50"
            }`}
          >
            <input
              type="radio"
              name={questionNumber}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-700 font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      {note && (!showNoteWhen || value === showNoteWhen) && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
          {note}
        </div>
      )}
    </div>
  );
}
