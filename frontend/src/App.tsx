import { useState } from "react";
import {
  MessageSquare, Search, Image, Mic, Video,
  Database, BookMarked, Bot, Settings,
  ChevronLeft, ChevronRight, Zap, Circle,
  Home, Cpu, MemoryStick, Activity, CheckCircle2,
  XCircle, Clock, ArrowRight,
} from "lucide-react";
import ChatTab from "./tabs/ChatTab";

const NAV_ITEMS = [
  { id: "home",     icon: Home,           label: "Home" },
  { id: "chat",     icon: MessageSquare,  label: "Chat" },
  { id: "research", icon: Search,         label: "Research" },
  { id: "image",    icon: Image,          label: "Image Studio" },
  { id: "voice",    icon: Mic,            label: "Voice Studio" },
  { id: "video",    icon: Video,          label: "Video Studio" },
  { id: "storage",  icon: Database,       label: "Storage" },
  { id: "prompts",  icon: BookMarked,     label: "Prompt Library" },
  { id: "models",   icon: Bot,            label: "Model Manager" },
];

const CONTENT: Record<string, { title: string; description: string }> = {
  chat:     { title: "AI Chat",         description: "Chat with local LLMs. Reason, search the web, read any file." },
  research: { title: "Research Mode",   description: "Give Novex a topic — it searches, reads, and writes a full report." },
  image:    { title: "Image Studio",    description: "Generate, edit, upscale, remove backgrounds and swap faces." },
  voice:    { title: "Voice Studio",    description: "Clone voices, generate speech and export audio." },
  video:    { title: "Video Studio",    description: "Text & image to video, AI captions." },
  storage:  { title: "Storage",         description: "Curated content collections the AI can reference." },
  prompts:  { title: "Prompt Library",  description: "Save and reuse prompts across all tools." },
  models:   { title: "Model Manager",   description: "Install, remove and manage all your local AI models." },
};

const QUICK_ACTIONS = [
  { id: "chat",     icon: MessageSquare, label: "AI Chat",        desc: "Start a conversation" },
  { id: "research", icon: Search,        label: "Research",       desc: "Deep dive a topic" },
  { id: "image",    icon: Image,         label: "Image Studio",   desc: "Generate images" },
  { id: "voice",    icon: Mic,           label: "Voice Studio",   desc: "Clone & generate voice" },
  { id: "video",    icon: Video,         label: "Video Studio",   desc: "Text to video" },
  { id: "models",   icon: Bot,           label: "Model Manager",  desc: "Manage your models" },
];

const RECENT_ACTIVITY = [
  { type: "chat",     label: "Chat with llama3.1",          time: "2 min ago" },
  { type: "image",    label: "Generated landscape image",   time: "1 hr ago" },
  { type: "research", label: "Research: Quantum computing", time: "3 hrs ago" },
  { type: "chat",     label: "Chat with deepseek-r1",       time: "Yesterday" },
  { type: "voice",    label: "Cloned voice sample",         time: "Yesterday" },
];

const ACTIVITY_ICONS: Record<string, typeof MessageSquare> = {
  chat:     MessageSquare,
  image:    Image,
  research: Search,
  voice:    Mic,
  video:    Video,
};

const SETUP_ITEMS = [
  { label: "Ollama installed",       done: true },
  { label: "First model downloaded", done: true },
  { label: "SearXNG configured",     done: false },
  { label: "ComfyUI connected",      done: false },
];

function StatCard({ icon: Icon, label, value, sub, accent }: {
  icon: typeof Cpu; label: string; value: string; sub: string; accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.05] transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#52525b] font-medium tracking-tight uppercase">{label}</span>
        <Icon size={14} className={accent ? "text-blue-400" : "text-[#3f3f46]"} strokeWidth={1.6} />
      </div>
      <div>
        <p className="text-[22px] font-semibold tracking-tight text-[#e4e4e7] leading-none">{value}</p>
        <p className="text-[11px] text-[#52525b] mt-1">{sub}</p>
      </div>
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const allSetup = SETUP_ITEMS.every(i => i.done);

  return (
    <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-[#fafafa]">{greeting}.</h1>
        <p className="text-[13px] text-[#52525b] mt-1 tracking-tight">Here's what's happening with Novex.</p>
      </div>

      {/* System stats */}
      <div>
        <p className="text-[11px] font-medium text-[#3f3f46] uppercase tracking-widest mb-3">System</p>
        <div className="grid grid-cols-4 gap-3">
          <StatCard icon={Circle}      label="Ollama"  value="Running"  sub="v0.3.12"             accent />
          <StatCard icon={Cpu}         label="GPU"     value="RTX 3060" sub="8.2 GB / 12 GB used" />
          <StatCard icon={MemoryStick} label="RAM"     value="18.4 GB"  sub="32 GB total" />
          <StatCard icon={Activity}    label="Models"  value="4"        sub="Active locally" />
        </div>
      </div>

      {/* Quick actions + Recent activity */}
      <div className="grid grid-cols-[1fr_320px] gap-4">

        {/* Quick actions */}
        <div>
          <p className="text-[11px] font-medium text-[#3f3f46] uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  className="group flex flex-col gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all text-left cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all">
                    <Icon size={15} strokeWidth={1.6} className="text-[#52525b] group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#e4e4e7] tracking-tight">{action.label}</p>
                    <p className="text-[11px] text-[#52525b] mt-0.5">{action.desc}</p>
                  </div>
                  <ArrowRight size={12} className="text-[#3f3f46] group-hover:text-[#52525b] transition-colors mt-auto" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Recent activity */}
          <div>
            <p className="text-[11px] font-medium text-[#3f3f46] uppercase tracking-widest mb-3">Recent</p>
            <div className="flex flex-col rounded-xl border border-white/[0.07] overflow-hidden">
              {RECENT_ACTIVITY.map((item, i) => {
                const Icon = ACTIVITY_ICONS[item.type] ?? MessageSquare;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-all cursor-pointer border-b border-white/[0.05] last:border-none"
                  >
                    <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                      <Icon size={12} strokeWidth={1.6} className="text-[#52525b]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#a1a1aa] truncate tracking-tight">{item.label}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock size={10} className="text-[#3f3f46]" />
                      <span className="text-[10px] text-[#3f3f46]">{item.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Setup checklist */}
          {!allSetup && (
            <div>
              <p className="text-[11px] font-medium text-[#3f3f46] uppercase tracking-widest mb-3">Setup</p>
              <div className="flex flex-col rounded-xl border border-white/[0.07] overflow-hidden">
                {SETUP_ITEMS.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b border-white/[0.05] last:border-none">
                    {item.done
                      ? <CheckCircle2 size={14} className="text-emerald-400 shrink-0" strokeWidth={1.8} />
                      : <XCircle      size={14} className="text-[#3f3f46] shrink-0"   strokeWidth={1.8} />
                    }
                    <span className={`text-[12px] tracking-tight ${item.done ? "text-[#52525b] line-through" : "text-[#a1a1aa]"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComingSoonTab({ id }: { id: string }) {
  const item = NAV_ITEMS.find(n => n.id === id)!;
  const Icon = item.icon;
  const info = CONTENT[id];
  return (
    <main className="flex-1 overflow-auto flex items-center justify-center p-10">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <Icon size={20} strokeWidth={1.5} className="text-blue-400" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[15px] font-medium text-[#e4e4e7] tracking-tight">{info.title}</h2>
          <p className="text-[13px] text-[#52525b] leading-relaxed tracking-tight">{info.description}</p>
        </div>
        <button className="mt-1 bg-[#fafafa] text-[#09090b] border-none rounded-lg px-5 py-2 text-[13px] font-medium cursor-pointer tracking-tight hover:opacity-90 transition-opacity font-[inherit]">
          Coming soon
        </button>
      </div>
    </main>
  );
}

function TabContent({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  switch (active) {
    case "home": return <HomePage onNavigate={onNavigate} />;
    case "chat": return <ChatTab />;
    default:     return <ComingSoonTab id={active} />;
  }
}

export default function App() {
  const [active, setActive]       = useState("home");
  const [collapsed, setCollapsed] = useState(false);

  const pageTitle = active === "home" ? "Home" : CONTENT[active]?.title ?? "";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0a] text-[#e4e4e7]">

      {/* Sidebar */}
      <aside className={`flex flex-col overflow-hidden transition-all duration-200 bg-[#0a0a0a] border-r border-white/[0.07] shrink-0 ${collapsed ? "w-[52px]" : "w-[212px]"}`}>

        {/* Logo */}
        <div className={`flex items-center h-[52px] px-3 border-b border-white/[0.07] shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2 h-11">
            <img src="/logo_small_1.png" alt="Novex logo" className="max-w-11 max-h-11" />
            {!collapsed && (
              <span className="text-sm font-semibold tracking-tight text-[#fafafa] whitespace-nowrap">
                Novex
              </span>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="w-6 h-6 flex items-center justify-center rounded-md border border-white/[0.08] text-[#52525b] hover:text-[#e4e4e7] hover:border-white/[0.16] transition-all bg-transparent cursor-pointer"
            >
              <ChevronLeft size={13} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-px p-1.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-2.5 rounded-md border-none text-[13px] cursor-pointer w-full whitespace-nowrap transition-all duration-100 font-[inherit]
                  ${collapsed ? "justify-center px-0 py-2" : "px-2.5 py-[7px]"}
                  ${isActive
                    ? "bg-white/[0.07] text-[#e4e4e7] font-medium"
                    : "bg-transparent text-[#52525b] hover:bg-white/[0.05] hover:text-[#e4e4e7]"
                  }`}
              >
                <Icon size={15} strokeWidth={isActive ? 2 : 1.6} className={`shrink-0 ${isActive ? "text-blue-400" : "text-inherit"}`} />
                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-1.5 border-t border-white/[0.07] flex flex-col gap-px">
          {collapsed ? (
            <button onClick={() => setCollapsed(false)} className="flex items-center justify-center py-2 rounded-md bg-transparent border-none text-[#52525b] hover:text-[#e4e4e7] hover:bg-white/[0.05] cursor-pointer w-full transition-all">
              <ChevronRight size={15} strokeWidth={1.6} />
            </button>
          ) : (
            <button className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-md bg-transparent border-none text-[#52525b] text-[13px] hover:bg-white/[0.05] hover:text-[#e4e4e7] cursor-pointer w-full tracking-tight transition-all whitespace-nowrap font-[inherit]">
              <Settings size={15} strokeWidth={1.6} className="shrink-0" />
              Settings
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="h-[52px] min-h-[52px] border-b border-white/[0.07] flex items-center justify-between px-5 bg-[#0a0a0a] shrink-0 gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] text-[#3f3f46] tracking-tight">Novex</span>
            <span className="text-[13px] text-[#27272a]">/</span>
            <span className="text-[13px] font-medium text-[#e4e4e7] tracking-tight">{pageTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/[0.06] border border-emerald-500/[0.12] rounded-md text-[11px] font-medium text-emerald-400">
              <Circle size={5} fill="currentColor" stroke="none" />
              Ollama
            </div>
            <button className="flex items-center gap-1.5 px-2.5 py-[5px] bg-transparent border border-white/[0.08] rounded-md text-[#52525b] text-[12px] hover:border-white/[0.16] hover:text-[#e4e4e7] cursor-pointer tracking-tight transition-all font-[inherit]">
              <Settings size={12} strokeWidth={1.6} />
              Settings
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <TabContent active={active} onNavigate={setActive} />
        </div>
      </div>
    </div>
  );
}