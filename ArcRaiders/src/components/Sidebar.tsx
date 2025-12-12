import { useEffect, useState } from "react";
import { AlertTriangle, Bell, ChevronRight, Clock3, Map } from "lucide-react";
import { EVENTS, MAPS, eventLabel, mapLabel, type EventName, type MapName } from "../data/schedule";

export default function Sidebar(props: {
  isOpen: boolean;
  onToggleOpen: () => void;
  selectedEvents: Set<EventName>;
  selectedMaps: Set<MapName>;
  onToggleEvent: (e: EventName) => void;
  onToggleMap: (m: MapName) => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  alertRules: { id: string; event: EventName; map: MapName }[];
  onOpenRules: () => void;
  nextEvent: { countdown: string; label: string };
  activeEvent: { status: "empty" | "none" | "active"; title: string; subtitle: string; timer: string };
}) {
  const {
    isOpen,
    selectedEvents,
    selectedMaps,
    onToggleEvent,
    onToggleMap,
    notificationsEnabled,
    onToggleNotifications,
    alertRules,
    onOpenRules,
    nextEvent,
    activeEvent,
  } = props;

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside
      className={[
        "fixed lg:static inset-y-0 left-0 z-40 w-80 bg-neutral-950 border-r border-arc-border transition-transform duration-300 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-none",
      ].join(" ")}
    >
      <div className="p-6 border-b border-arc-border hidden lg:flex items-center gap-3">
        <div>
          <h1 className="font-bold text-xl tracking-widest leading-none">
            ARC <span className="text-arc-orange">RAIDERS</span>
          </h1>
          <p className="text-xs text-arc-muted tracking-[0.2em]">RASTREADOR DE EVENTOS</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="bg-black/40 p-4 rounded border border-arc-border/50 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-arc-muted mb-1 text-xs uppercase tracking-wider">
              <Clock3 className="w-3 h-3" /> Hora local
            </div>
            <div className="text-3xl font-mono font-medium text-white">
              {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-xs text-arc-muted mt-1">
              {now.toLocaleDateString("es-ES", { weekday: "long", month: "short", day: "numeric" })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-arc-muted uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-3 h-3" /> Alertas
            </span>
            <div
              onClick={onToggleNotifications}
              role="switch"
              aria-checked={notificationsEnabled}
              className={[
                "w-8 h-4 rounded-full relative cursor-pointer transition-colors",
                notificationsEnabled ? "bg-arc-orange/30" : "bg-neutral-800",
              ].join(" ")}
            >
              <div
                className={[
                  "absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300",
                  notificationsEnabled
                    ? "left-[18px] bg-arc-orange shadow-[0_0_8px_rgba(255,107,0,0.8)]"
                    : "left-0.5 bg-neutral-600",
                ].join(" ")}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded border border-arc-border/50">
          <div className="flex items-center gap-2 text-arc-orange mb-1 text-xs uppercase tracking-wider font-bold">
            <Bell className="w-3 h-3" /> {activeEvent.title}
          </div>
          <div className="text-sm text-white truncate">{activeEvent.subtitle}</div>
          {activeEvent.timer ? (
            <div className="text-xs text-arc-muted mt-1">{activeEvent.timer}</div>
          ) : (
            <div className="text-xs text-arc-muted mt-1"> </div>
          )}
        </div>

        <div className="bg-arc-orange/5 p-4 rounded border border-arc-orange/20">
          <div className="flex items-center gap-2 text-arc-orange mb-1 text-xs uppercase tracking-wider font-bold">
            <Clock3 className="w-3 h-3" /> Próximo evento
          </div>
          <div className="text-2xl font-mono font-bold text-arc-orange truncate">En {nextEvent.countdown}</div>
          <div className="text-xs text-arc-orange/70 mt-1 truncate">{nextEvent.label}</div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-arc-muted uppercase tracking-widest mb-3 flex items-center gap-2">
            <Map className="w-3 h-3" /> MAPAS
          </h3>
          <div className="space-y-1">
            {MAPS.map((m) => (
              <button
                key={m}
                onClick={() => onToggleMap(m)}
                className={[
                  "w-full text-left px-3 py-2 rounded text-sm transition-all border border-transparent flex items-center justify-between group",
                  selectedMaps.has(m)
                    ? "bg-white/5 text-white border-arc-border/50 hover:border-arc-orange/50"
                    : "text-arc-muted hover:text-arc-text hover:bg-white/5",
                ].join(" ")}
              >
                {mapLabel(m)}
                <span
                  className={[
                    "w-2 h-2 rounded-full transition-colors",
                    selectedMaps.has(m)
                      ? "bg-arc-orange shadow-[0_0_8px_rgba(255,107,0,0.5)]"
                      : "bg-neutral-700",
                  ].join(" ")}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenRules}
          className={[
            "w-full flex items-center justify-between px-3 py-3 rounded border transition-all group",
            alertRules.length > 0
              ? "bg-arc-orange/10 border-arc-orange/50 text-white hover:bg-arc-orange/20"
              : "bg-white/5 border-transparent text-arc-muted hover:bg-white/10 hover:text-white",
          ].join(" ")}
        >
          <span className="flex items-center gap-2">
            <AlertTriangle
              className={["w-4 h-4", alertRules.length > 0 ? "text-arc-orange" : "text-neutral-500"].join(" ")}
            />
            <span className="text-xs font-bold tracking-wider">REGLAS DE ALERTA</span>
          </span>
          {alertRules.length > 0 ? (
            <span className="text-[10px] font-bold bg-arc-orange text-black px-1.5 rounded-sm">{alertRules.length}</span>
          ) : (
            <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400" />
          )}
        </button>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-arc-muted uppercase tracking-widest mb-3 flex items-center gap-2">
            <Bell className="w-3 h-3" /> CONDICIONES DEL MAPA
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {EVENTS.map((e) => (
              <button
                key={e}
                onClick={() => onToggleEvent(e)}
                className={[
                  "px-2 py-1.5 rounded text-xs border text-left transition-all",
                  selectedEvents.has(e)
                    ? "bg-arc-orange/10 border-arc-orange text-arc-orange shadow-[0_0_10px_rgba(255,107,0,0.2)]"
                    : "bg-transparent border-neutral-800 text-neutral-600 hover:border-neutral-700",
                ].join(" ")}
              >
                {eventLabel(e)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-arc-border text-xs text-center text-neutral-600">
        Creado con ❤️ por Tarkiin / tarki_n y la comunidad de Arc Raiders
      </div>
    </aside>
  );
}
