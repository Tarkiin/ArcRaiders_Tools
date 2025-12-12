import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ScheduleGrid from "./components/ScheduleGrid";
import AlertRulesModal, { type AlertRule } from "./components/AlertRulesModal";
import { buildSchedule } from "./utils/schedule";
import { EVENTS, MAPS, eventLabel, mapLabel, type EventName, type MapName } from "./data/schedule";
import { usePresenceCount } from "./hooks/usePresenceCount";

const LS_EVENTS = "arc_selected_events";
const LS_MAPS = "arc_selected_maps";
const LS_RULES = "arc_alert_rules";
const LS_NOTIF = "arc_notifications_enabled";

const EVENT_SET = new Set<string>(EVENTS);
const LEGACY_EVENT_MAP: Record<string, EventName> = {
  Night: "Night Raid",
  Storm: "Electromagnetic Storm",
  Caches: "Uncovered Caches",
  Blooms: "Lush Blooms",
  Probes: "Prospecting Probes",
  Husks: "Husk Graveyard",
  Tower: "Launch Tower Loot",
  Bunker: "Hidden Bunker",
};

function normalizeEventName(v: unknown): EventName | null {
  if (typeof v !== "string") return null;
  if (EVENT_SET.has(v)) return v as EventName;
  return LEGACY_EVENT_MAP[v] ?? null;
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const raw = localStorage.getItem(LS_NOTIF);
    if (raw !== "true") return false;
    if (!("Notification" in window)) return false;
    return Notification.permission === "granted";
  });

  const [selectedEvents, setSelectedEvents] = useState<Set<EventName>>(() => {
    const raw = localStorage.getItem(LS_EVENTS);
    if (!raw) return new Set();
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      const normalized = parsed.map(normalizeEventName).filter((x): x is EventName => x !== null);
      return new Set(normalized);
    } catch {
      return new Set();
    }
  });
  const [selectedMaps, setSelectedMaps] = useState<Set<MapName>>(() => {
    const raw = localStorage.getItem(LS_MAPS);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  });
  const [alertRules, setAlertRules] = useState<AlertRule[]>(() => {
    const raw = localStorage.getItem(LS_RULES);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((r) => {
          const event = normalizeEventName(r?.event);
          const map = r?.map as MapName | undefined;
          const id = typeof r?.id === "string" ? r.id : crypto.randomUUID();
          if (!event || !map) return null;
          return { id, event, map } as AlertRule;
        })
        .filter((x): x is AlertRule => x !== null);
    } catch {
      return [];
    }
  });

  const timezoneOffsetHours = -new Date().getTimezoneOffset() / 60;

  useEffect(() => localStorage.setItem(LS_EVENTS, JSON.stringify([...selectedEvents])), [selectedEvents]);
  useEffect(() => localStorage.setItem(LS_MAPS, JSON.stringify([...selectedMaps])), [selectedMaps]);
  useEffect(() => localStorage.setItem(LS_RULES, JSON.stringify(alertRules)), [alertRules]);
  useEffect(() => localStorage.setItem(LS_NOTIF, JSON.stringify(notificationsEnabled)), [notificationsEnabled]);

  const raidersCount = usePresenceCount();

  const toggleEvent = (event: EventName) =>
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      next.has(event) ? next.delete(event) : next.add(event);
      return next;
    });
  const toggleMap = (map: MapName) =>
    setSelectedMaps((prev) => {
      const next = new Set(prev);
      next.has(map) ? next.delete(map) : next.add(map);
      return next;
    });

  const scheduleRows = useMemo(() => buildSchedule(timezoneOffsetHours), [timezoneOffsetHours]);
  const scheduleByUtcHour = useMemo(() => new Map(scheduleRows.map((r) => [r.utcHour, r])), [scheduleRows]);

  const lastNotifiedRef = useRef<string>("");
  const sendNotifications = useCallback(
    (forceTest = false) => {
      if (!notificationsEnabled && !forceTest) return;
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") {
        return;
      }

      const now = new Date();
      const utcHour = now.getUTCHours();
      const row = scheduleByUtcHour.get(utcHour);
      if (!row) return;

      const stamp = `${now.getUTCDate()}-${utcHour}`;
      if (!forceTest && lastNotifiedRef.current === stamp) return;

      const hits: { event: EventName; map: MapName }[] = [];
      if (alertRules.length > 0) {
        for (const rule of alertRules) {
          const events = row.events[rule.map] ?? [];
          if (events.includes(rule.event)) hits.push({ event: rule.event, map: rule.map });
        }
      } else {
        for (const map of MAPS) {
          const events = row.events[map] ?? [];
          for (const event of events) {
            if (selectedMaps.has(map) && selectedEvents.has(event)) hits.push({ event, map });
          }
        }
      }

      if (hits.length === 0) {
        if (forceTest) {
          new Notification("Sistemas normales", {
            body: alertRules.length
              ? "No hay eventos activos que coincidan con tus reglas."
              : "No hay eventos activos que coincidan con tus filtros.",
            icon: "/vite.svg",
            tag: "arc-alert",
          });
        }
        return;
      }

      const title =
        hits.length === 1
          ? `${eventLabel(hits[0].event).toUpperCase()} DETECTADO`
          : `${hits.length} ALERTAS TÁCTICAS`;
      const body =
        hits.length === 1
          ? `Sector: ${mapLabel(hits[0].map)}\nEstado: ACTIVO AHORA`
          : MAPS.map((m) => {
              const list = hits.filter((h) => h.map === m).map((h) => h.event);
              return list.length ? `- ${mapLabel(m)}: ${list.map(eventLabel).join(", ")}` : null;
            })
              .filter(Boolean)
              .join("\n");

      new Notification(title, { body, icon: "/vite.svg", tag: "arc-alert" });
      lastNotifiedRef.current = stamp;
    },
    [notificationsEnabled, scheduleByUtcHour, selectedEvents, selectedMaps, alertRules]
  );

  useEffect(() => {
    const id = setInterval(() => sendNotifications(false), 60000);
    return () => clearInterval(id);
  }, [sendNotifications]);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const remainingInHour = useMemo(() => {
    const elapsed = now.getMinutes() * 60 + now.getSeconds();
    let remaining = 3600 - elapsed;
    if (remaining === 3600) remaining = 3599;
    const mm = Math.floor(remaining / 60)
      .toString()
      .padStart(2, "0");
    const ss = (remaining % 60).toString().padStart(2, "0");
    return { seconds: remaining, label: `${mm}:${ss}` };
  }, [now]);

  const activeEventCard = useMemo(() => {
    const hasRules = alertRules.length > 0;
    const hasGlobal = selectedEvents.size > 0 && selectedMaps.size > 0;
    if (!hasRules && !hasGlobal) {
      return { status: "empty" as const, title: "Evento actual", subtitle: "Selecciona filtros o reglas", timer: "" };
    }

    const utcHour = now.getUTCHours();
    const row = scheduleByUtcHour.get(utcHour);
    if (!row) return { status: "empty" as const, title: "Evento actual", subtitle: "Sin datos", timer: "" };

    const hits: { event: EventName; map: MapName }[] = [];
    if (hasRules) {
      for (const rule of alertRules) {
        const events = row.events[rule.map] ?? [];
        if (events.includes(rule.event)) hits.push({ event: rule.event, map: rule.map });
      }
    } else {
      for (const map of MAPS) {
        if (!selectedMaps.has(map)) continue;
        const events = row.events[map] ?? [];
        for (const event of events) {
          if (selectedEvents.has(event)) hits.push({ event, map });
        }
      }
    }

    if (hits.length === 0) {
      return {
        status: "none" as const,
        title: "Evento actual",
        subtitle: "No hay eventos activos con tus filtros",
        timer: "",
      };
    }

    const first = hits[0];
    const suffix = hits.length > 1 ? ` (+${hits.length - 1})` : "";
    return {
      status: "active" as const,
      title: "Evento actual",
      subtitle: `${eventLabel(first.event)} @ ${mapLabel(first.map)}${suffix}`,
      timer: `Acaba en ${remainingInHour.label}`,
    };
  }, [alertRules, now, remainingInHour.label, scheduleByUtcHour, selectedEvents, selectedMaps]);

  const nextEventCard = useMemo(() => {
    const hasRules = alertRules.length > 0;
    const hasGlobal = selectedEvents.size > 0 && selectedMaps.size > 0;
    if (!hasRules && !hasGlobal) {
      return { countdown: "--", label: "Selecciona 1 evento + 1 mapa" };
    }

    const baseUtcHour = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();
    const startDelta = minutes === 0 && seconds === 0 ? 0 : 1;

    const formatCountdown = (totalMinutes: number) => {
      const clamped = Math.max(0, Math.floor(totalMinutes));
      const hoursLeft = Math.floor(clamped / 60);
      const minsLeft = clamped % 60;
      if (hoursLeft <= 0) return `${minsLeft}m`;
      return `${hoursLeft}h ${minsLeft.toString().padStart(2, "0")}m`;
    };

    for (let deltaHours = startDelta; deltaHours < 24; deltaHours++) {
      const hour = (baseUtcHour + deltaHours) % 24;
      const row = scheduleByUtcHour.get(hour);
      if (!row) continue;

      const hits: { event: EventName; map: MapName }[] = [];
      if (hasRules) {
        for (const rule of alertRules) {
          const events = row.events[rule.map] ?? [];
          if (events.includes(rule.event)) hits.push({ event: rule.event, map: rule.map });
        }
      } else {
        for (const map of MAPS) {
          if (!selectedMaps.has(map)) continue;
          const events = row.events[map] ?? [];
          for (const event of events) {
            if (selectedEvents.has(event)) hits.push({ event, map });
          }
        }
      }

      if (hits.length === 0) continue;

      const totalMinutes = deltaHours * 60 - minutes - seconds / 60;
      const countdown = formatCountdown(totalMinutes);
      const first = hits[0];
      return { countdown, label: `${eventLabel(first.event)} @ ${mapLabel(first.map)}` };
    }

    return { countdown: "--", label: "No se encontraron eventos" };
  }, [alertRules, now, scheduleByUtcHour, selectedEvents, selectedMaps]);

  const toggleNotifications = async () => {
    if (!("Notification" in window)) return;
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      return;
    }
    const perm = await Notification.requestPermission();
    setNotificationsEnabled(perm === "granted");
  };

  const onTestAlert = async () => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;
      setNotificationsEnabled(true);
    }
    sendNotifications(true);
  };

  return (
    <div className="flex h-screen w-screen bg-arc-dark text-arc-text font-sans selection:bg-arc-orange selection:text-white overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen((v) => !v)}
        selectedEvents={selectedEvents}
        selectedMaps={selectedMaps}
        onToggleEvent={toggleEvent}
        onToggleMap={toggleMap}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={toggleNotifications}
        alertRules={alertRules}
        onOpenRules={() => setIsRulesOpen(true)}
        nextEvent={nextEventCard}
        activeEvent={activeEventCard}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative pt-16 lg:pt-0">
        <Topbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          onTestAlert={onTestAlert}
          raidersCount={raidersCount}
        />
        <ScheduleGrid
          rows={scheduleRows}
          selectedEvents={selectedEvents}
          selectedMaps={selectedMaps}
          currentLocalHour={now.getHours()}
          now={now}
          alertRules={alertRules}
        />
      </div>

      <AlertRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        rules={alertRules}
        setRules={setAlertRules}
        events={EVENTS}
        maps={MAPS}
      />
    </div>
  );
}
