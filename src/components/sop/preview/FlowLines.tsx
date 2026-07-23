import React from "react";
import { Activity, SymbolCoord } from "@/types/sop";

interface FlowLinesProps {
  activities: Activity[];
  symbolCoords: Record<string, SymbolCoord>;
  pageSplits?: number[];
}

export function FlowLines({
  activities,
  symbolCoords,
  pageSplits = [],
}: FlowLinesProps) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 print:block">
      {activities.map((act, idx) => {
        const nextAct = activities[idx + 1];
        if (!nextAct) return null;

        if (pageSplits.includes(idx + 1)) return null;

        const start = symbolCoords[act.id];
        const end = symbolCoords[nextAct.id];
        if (!start || !end) return null;

        const startGap = 0;
        const endGap = 0; // Touch the symbol directly
        const ySourceBottom = start.y + start.h / 2 + startGap;
        const yTargetTop = end.y - end.h / 2 - endGap;
        const midY = ySourceBottom + (yTargetTop - ySourceBottom) * 0.75;

        const isSourceDecision = act.symbol === "decision";
        const isTargetDecision = nextAct.symbol === "decision";
        const isMovingRight = end.x > start.x;

        let pathD = "";
        let arrowD = "";

        const isVertical = Math.abs(start.x - end.x) < 10;
        const targetX = isVertical ? start.x : end.x;

        if (isVertical) {
          pathD = `M ${start.x} ${ySourceBottom} L ${start.x} ${yTargetTop}`;
          arrowD = `M ${start.x - 3.5} ${yTargetTop - 6} L ${start.x} ${yTargetTop} L ${start.x + 3.5} ${yTargetTop - 6}`;
        } else if (isSourceDecision && isTargetDecision) {
          // Logika khusus: Jika alur Keputusan bertemu dengan simbol Keputusan lagi sebelumnya,
          // alur diteruskan untuk mengarah ke sisi kanan (right port) dari logo keputusan di sebelahnya.
          const portX = end.x + end.w / 2 + endGap;
          const portY = end.y;
          pathD = `M ${start.x} ${ySourceBottom} L ${start.x} ${portY} L ${portX} ${portY}`;
          arrowD = `M ${portX + 6} ${portY - 3.5} L ${portX} ${portY} L ${portX + 6} ${portY + 3.5}`;
        } else if (isTargetDecision && isMovingRight) {
          const portX = targetX - end.w / 2 - endGap;
          const portY = end.y;
          pathD = `M ${start.x} ${ySourceBottom} L ${start.x} ${portY} L ${portX} ${portY}`;
          arrowD = `M ${portX - 6} ${portY - 3.5} L ${portX} ${portY} L ${portX - 6} ${portY + 3.5}`;
        } else {
          pathD = `M ${start.x} ${ySourceBottom} L ${start.x} ${midY} L ${targetX} ${midY} L ${targetX} ${yTargetTop}`;
          arrowD = `M ${targetX - 3.5} ${yTargetTop - 6} L ${targetX} ${yTargetTop} L ${targetX + 3.5} ${yTargetTop - 6}`;
        }

        return (
          <g key={`flow-${idx}`}>
            <path
              d={pathD}
              fill="none"
              stroke="#000"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={arrowD}
              fill="none"
              stroke="#000"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {(act.symbol === "process" || act.symbol === "decision") &&
              nextAct.symbol === "decision" && (
                <g>
                  {/* RETURN LINE (Loop back for 'No' path) */}
                  <path
                    d={`M ${end.x} ${end.y - end.h / 2} 
                       L ${end.x} ${start.y} 
                       L ${start.x + start.w / 2 + 1} ${start.y}`}
                    fill="none"
                    stroke="#000"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  {/* RETURN ARROW */}
                  <path
                    d={`M ${start.x + start.w / 2 + 5} ${start.y - 2.5} 
                       L ${start.x + start.w / 2 + 1} ${start.y} 
                       L ${start.x + start.w / 2 + 5} ${start.y + 2.5}`}
                    fill="none"
                    stroke="#000"
                    strokeWidth="1.2"
                  />
                </g>
              )}
          </g>
        );
      })}
    </svg>
  );
}
