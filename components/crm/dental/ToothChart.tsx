'use client';

import { useState } from 'react';

interface ToothRecord {
  id?: number;
  toothNumber: number;
  status: string;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  healthy: '#10B981',
  caries: '#EF4444',
  filling: '#3B82F6',
  crown: '#8B5CF6',
  missing: '#9CA3AF',
  implant: '#06B6D4',
  root: '#F97316',
  bridge: '#EC4899',
  treatment_needed: '#F59E0B',
};

const statusLabels: Record<string, string> = {
  healthy: 'Здоров',
  caries: 'Кариес',
  filling: 'Пломба',
  crown: 'Коронка',
  missing: 'Отсутствует',
  implant: 'Имплант',
  root: 'Корень',
  bridge: 'Мост',
  treatment_needed: 'Требует лечения',
};

// FDI notation: upper right 18-11, upper left 21-28, lower left 38-31, lower right 41-48
const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
const lowerLeft = [38, 37, 36, 35, 34, 33, 32, 31];
const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48];

export default function ToothChart({
  teeth,
  onToothClick,
  readonly = false,
}: {
  teeth: ToothRecord[];
  onToothClick?: (toothNumber: number, currentStatus: string) => void;
  readonly?: boolean;
}) {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const getToothStatus = (num: number): string => {
    const record = teeth.find((t) => t.toothNumber === num);
    return record?.status || 'healthy';
  };

  const getToothNotes = (num: number): string | null => {
    const record = teeth.find((t) => t.toothNumber === num);
    return record?.notes || null;
  };

  const handleClick = (num: number) => {
    setSelectedTooth(num === selectedTooth ? null : num);
    if (onToothClick && !readonly) {
      onToothClick(num, getToothStatus(num));
    }
  };

  const renderTooth = (num: number) => {
    const status = getToothStatus(num);
    const color = statusColors[status] || '#10B981';
    const isSelected = selectedTooth === num;
    const isMissing = status === 'missing';

    return (
      <div key={num} className="flex flex-col items-center gap-1">
        <span className="text-[10px] text-gray-400">{num}</span>
        <button
          onClick={() => handleClick(num)}
          className={`w-8 h-8 rounded-md border-2 flex items-center justify-center text-[10px] font-bold text-white transition-all ${
            isSelected ? 'ring-2 ring-amber-400 scale-110' : ''
          } ${!readonly ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
          style={{
            backgroundColor: isMissing ? 'transparent' : color,
            borderColor: color,
            color: isMissing ? color : 'white',
          }}
          title={`${num}: ${statusLabels[status]}`}
        >
          {isMissing ? 'X' : num % 10}
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Dental chart */}
      <div className="bg-gray-50 rounded-xl p-4">
        {/* Upper jaw */}
        <div className="flex justify-center gap-0.5 mb-1">
          <div className="flex gap-0.5">
            {upperRight.map(renderTooth)}
          </div>
          <div className="w-px bg-gray-300 mx-1" />
          <div className="flex gap-0.5">
            {upperLeft.map(renderTooth)}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-2" />

        {/* Lower jaw */}
        <div className="flex justify-center gap-0.5 mt-1">
          <div className="flex gap-0.5">
            {lowerRight.map(renderTooth)}
          </div>
          <div className="w-px bg-gray-300 mx-1" />
          <div className="flex gap-0.5">
            {lowerLeft.map(renderTooth)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-3">
        {Object.entries(statusLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: statusColors[key] }} />
            <span className="text-[10px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Selected tooth info */}
      {selectedTooth && (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm font-medium text-gray-900">Зуб #{selectedTooth}</p>
          <p className="text-xs text-gray-600">Статус: {statusLabels[getToothStatus(selectedTooth)]}</p>
          {getToothNotes(selectedTooth) && (
            <p className="text-xs text-gray-500 mt-1">{getToothNotes(selectedTooth)}</p>
          )}
        </div>
      )}
    </div>
  );
}
