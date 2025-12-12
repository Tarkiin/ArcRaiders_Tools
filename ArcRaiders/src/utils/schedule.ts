import { EVENT_SCHEDULE, MAPS, type MapName, type EventName } from "../data/schedule";

export type ScheduleRow = {
  utcHour: number;
  localHour: number;
  events: Record<MapName, EventName[]>;
};

export function buildSchedule(timezoneOffsetHours: number): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  for (let utcHour = 0; utcHour < 24; utcHour++) {
    const key = `${utcHour}:00`;
    const events = EVENT_SCHEDULE[key] ?? ({} as Record<MapName, EventName[]>);
    const localHour = ((utcHour + timezoneOffsetHours) % 24 + 24) % 24;
    rows.push({ utcHour, localHour, events });
  }
  rows.sort((a, b) => a.localHour - b.localHour);
  return rows;
}

export function isSelectedEvent(
  event: EventName,
  map: MapName,
  selectedEvents: Set<EventName>,
  selectedMaps: Set<MapName>,
  alertRules: { event: EventName; map: MapName }[]
) {
  if (alertRules.length > 0) {
    return alertRules.some((r) => r.event === event && r.map === map);
  }
  if (selectedEvents.size === 0 || selectedMaps.size === 0) return false;
  return selectedEvents.has(event) && selectedMaps.has(map);
}

export { MAPS };
