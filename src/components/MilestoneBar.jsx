import React from 'react';

export function MilestoneBar({ markedCount, next, lastReached }) {
  const prevCount = lastReached ? lastReached.count : 1;
  const target = next ? next.count : prevCount;
  const pct = next
    ? Math.min(100, Math.max(0, ((markedCount - prevCount) / (target - prevCount)) * 100))
    : 100;

  return (
    <div className="w-full bg-slate-900/70 border border-amber-500/30 rounded-xl px-2 py-1 flex-shrink-0">
      <div className="flex items-center justify-between text-[10px] sm:text-xs font-black text-amber-300 leading-tight">
        <span>{lastReached ? lastReached.emoji : '🎯'} {markedCount} marcados</span>
        <span>{next ? `${next.emoji} em ${next.count - markedCount}` : '👑 Tudo!'}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
