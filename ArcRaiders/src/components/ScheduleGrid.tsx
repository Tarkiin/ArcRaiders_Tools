import { useEffect, useRef } from "react";
import { eventLabel, mapLabel, type EventName, type MapName } from "../data/schedule";
import { isSelectedEvent, MAPS, type ScheduleRow } from "../utils/schedule";

export default function ScheduleGrid({
  rows,
  selectedEvents,
  selectedMaps,
  currentLocalHour,
  now,
  alertRules,
}: {
  rows: ScheduleRow[];
  selectedEvents: Set<EventName>;
  selectedMaps: Set<MapName>;
  currentLocalHour: number;
  now: Date;
  alertRules: { id: string; event: EventName; map: MapName }[];
}) {
  const elapsed = now.getMinutes() * 60 + now.getSeconds();
  let remaining = 3600 - elapsed;
  if (remaining === 3600) remaining = 3599;
  const remainingLabel = `${Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`;

  const currentRowRef = useRef<HTMLTableRowElement | null>(null);
  useEffect(() => {
    currentRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentLocalHour]);

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-xs border-collapse">
        <thead className="sticky top-0 bg-arc-dark/90 backdrop-blur z-10">
          <tr>
            <th className="text-left px-4 py-3 border-b border-arc-border border-r border-arc-border/50 w-24 text-[10px] uppercase tracking-wider text-arc-muted font-bold">
              HORA
            </th>
            {MAPS.map((m) => (
              <th
                key={m}
                className="px-3 py-3 border-b border-arc-border border-r border-arc-border/50 last:border-r-0 text-center text-[10px] uppercase tracking-wider text-arc-muted font-bold"
              >
                {mapLabel(m)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isCurrent = row.localHour === currentLocalHour;
            const timeLabel = `${row.localHour.toString().padStart(2, "0")}:00`;
            return (
              <tr
                key={row.utcHour}
                ref={isCurrent ? currentRowRef : undefined}
                className={[
                  "border-b border-neutral-900 hover:bg-white/[0.02] transition-colors",
                  isCurrent ? "bg-arc-orange/5 border-y border-arc-orange/20 border-l-4 border-l-arc-orange" : "",
                ].join(" ")}
              >
                <td
                  className={[
                    "px-4 py-3 font-mono font-medium border-r border-arc-border/50 whitespace-nowrap",
                    isCurrent ? "text-arc-orange" : "text-arc-muted",
                  ].join(" ")}
                >
                  {timeLabel}
                </td>
                {MAPS.map((map) => {
                  const events = row.events[map] ?? [];
                  return (
                    <td key={map} className="px-3 py-2 text-center border-r border-arc-border/50 last:border-r-0">
                      {events.length === 0 ? (
                        <span className="text-neutral-600">-</span>
                      ) : (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {events.map((event) => {
                            const selected = isSelectedEvent(event, map, selectedEvents, selectedMaps, alertRules);
                            const showTimer = isCurrent;
                            return (
                              <span
                                key={event}
                                className={[
                                  "px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider",
                                  selected
                                    ? "border-arc-orange text-arc-orange bg-arc-orange/10 shadow-[0_0_0_1px_rgba(255,107,0,0.2)]"
                                    : "border-neutral-800 text-neutral-400 bg-neutral-900",
                                  showTimer ? "flex flex-col items-center leading-none" : "",
                                ].join(" ")}
                              >
                                <span>{eventLabel(event)}</span>
                                {showTimer ? (
                                  <span className="mt-1 text-[9px] font-mono text-arc-orange/80 normal-case">
                                    {remainingLabel}
                                  </span>
                                ) : null}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
