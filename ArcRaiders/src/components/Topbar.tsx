import { BellRing, Menu, Settings, Users } from "lucide-react";

export default function Topbar({
  isSidebarOpen,
  setIsSidebarOpen,
  onTestAlert,
  raidersCount,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  onTestAlert: () => void;
  raidersCount: number;
}) {
  return (
    <>
      {/* Mobile */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b border-arc-border flex lg:hidden items-center justify-between px-4 bg-arc-dark/90 backdrop-blur z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded text-arc-muted hover:text-white transition-colors"
            aria-label="Alternar barra lateral"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs text-arc-muted font-mono">MONITOR_HORARIO_V1.2.0</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTestAlert}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-arc-orange text-black rounded hover:bg-arc-orange/90 transition-colors"
          >
            <BellRing className="w-4 h-4" />
            PROBAR ALERTA
          </button>
          <button
            className="p-2 hover:bg-white/5 rounded text-arc-muted hover:text-white transition-colors"
            aria-label="Configuración"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop */}
      <div className="h-16 border-b border-arc-border hidden lg:flex items-center justify-between px-6 bg-arc-dark/90 backdrop-blur z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded text-arc-muted hover:text-white transition-colors"
            aria-label="Alternar barra lateral"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="h-4 w-px bg-neutral-800" />
          <span className="text-sm text-arc-muted font-mono">MONITOR_HORARIO_V1.2.0</span>
          <div className="h-4 w-px bg-neutral-800" />

          <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-arc-orange/10 text-white rounded border border-arc-orange/30">
            <Users className="w-4 h-4 text-arc-orange" />
            {raidersCount} RAIDERS
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onTestAlert}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-arc-orange text-black rounded hover:bg-arc-orange/90 transition-colors"
          >
            <BellRing className="w-3 h-3" /> PROBAR ALERTA
          </button>
          <button
            className="p-2 hover:bg-white/5 rounded text-arc-muted hover:text-white transition-colors"
            aria-label="Configuración"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}
