import { useMemo, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { eventLabel, mapLabel, type EventName, type MapName } from "../data/schedule";

export type AlertRule = { id: string; event: EventName; map: MapName };

export default function AlertRulesModal({
  isOpen,
  onClose,
  rules,
  setRules,
  events,
  maps,
}: {
  isOpen: boolean;
  onClose: () => void;
  rules: AlertRule[];
  setRules: (r: AlertRule[]) => void;
  events: readonly EventName[];
  maps: readonly MapName[];
}) {
  const [selectedMap, setSelectedMap] = useState<MapName>(maps[0]);
  const [selectedEvent, setSelectedEvent] = useState<EventName>(events[0]);

  const addRule = () => {
    setRules([...rules, { id: crypto.randomUUID(), map: selectedMap, event: selectedEvent }]);
  };
  const removeRule = (id: string) => setRules(rules.filter((r) => r.id !== id));

  const activeCount = rules.length;
  const isEmpty = activeCount === 0;

  const modalClasses = useMemo(
    () =>
      [
        "fixed inset-0 z-50 transition-opacity",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" "),
    [isOpen]
  );

  return (
    <div className={modalClasses} aria-hidden={!isOpen}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-950 border border-arc-border rounded-lg shadow-2xl flex flex-col max-h-[85vh]">
          <div className="p-4 border-b border-arc-border flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Reglas de alerta</div>
              <div className="text-[10px] uppercase tracking-wider text-arc-muted">
                Las reglas anulan los filtros globales
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded hover:bg-white/5" aria-label="Cerrar">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-arc-muted font-bold">Añadir regla</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-arc-muted">Mapa</label>
                  <select
                    value={selectedMap}
                    onChange={(e) => setSelectedMap(e.target.value as MapName)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-sm rounded px-2 py-2 focus:border-arc-orange focus:outline-none"
                  >
                    {maps.map((m) => (
                      <option key={m} value={m}>
                        {mapLabel(m)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-arc-muted">Evento</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value as EventName)}
                    className="w-full bg-neutral-900 border border-neutral-700 text-sm rounded px-2 py-2 focus:border-arc-orange focus:outline-none"
                  >
                    {events.map((ev) => (
                      <option key={ev} value={ev}>
                        {eventLabel(ev)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={addRule}
                className="w-full bg-arc-orange text-black font-bold text-xs py-2 rounded hover:bg-arc-orange/90 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> AÑADIR REGLA
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] uppercase tracking-wider text-arc-muted font-bold">
                Reglas activas ({activeCount})
              </h3>
              {isEmpty ? (
                <div className="text-center py-8 border border-dashed border-neutral-800 rounded text-neutral-600 text-xs">
                  No hay reglas configuradas.
                  <br />
                  Las notificaciones usarán los filtros globales.
                </div>
              ) : (
                <div className="space-y-2">
                  {rules.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between bg-neutral-900 p-3 rounded border border-neutral-800 group hover:border-neutral-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-arc-orange rounded-full animate-pulse" />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{eventLabel(r.event)}</span>
                          <span className="text-[10px] text-arc-muted">{mapLabel(r.map)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeRule(r.id)}
                        className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-900/20 rounded transition-colors"
                        aria-label="Eliminar regla"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-arc-border bg-neutral-900/50">
            <button
              onClick={onClose}
              className="w-full bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded transition-colors"
            >
              CERRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
