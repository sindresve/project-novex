import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Search, Brain, X, RotateCcw, Pencil, Check,
  StopCircle, ChevronRight, Loader2, Sparkles, ChevronDown,
  MessageSquare, Plus, Paperclip, FileText, Image as ImageIcon,
  Trash2, PanelLeftClose, PanelLeftOpen, ChevronUp,
} from "lucide-react";

/* ─── Types ─── */
type UploadedFile = { id: string; name: string; type: string; dataUrl: string; size: number };
type Message = {
  id: string; role: "user" | "assistant"; content: string;
  timestamp: Date; thinking?: string; searchQuery?: string;
  files?: UploadedFile[];
};
type Chat = { id: string; title: string; messages: Message[]; updatedAt: Date };

const MODELS = ["llama3.2", "mistral", "gemma3", "phi4", "deepseek-r1"];
const SUGGESTIONS = [
  "Explain quantum entanglement",
  "Write a Python web scraper",
  "Summarise AI trends in 2025",
  "Debug my React component",
];
const APP_VERSION = "v1.0.0";

/* ─── CSS ─── */
const CSS = `
@keyframes orbFloat{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:.9;transform:translate(-50%,-52%) scale(1.07)}}
@keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes dropDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
@keyframes dropUp{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes typingBounce{0%,80%,100%{transform:translateY(0);opacity:.35}40%{transform:translateY(-5px);opacity:1}}
@keyframes pulseRing{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
.msg-in{animation:msgIn 0.2s cubic-bezier(0.16,1,0.3,1) both}
.drop-down{animation:dropDown 0.15s cubic-bezier(0.16,1,0.3,1) both}
.drop-up{animation:dropUp 0.15s cubic-bezier(0.16,1,0.3,1) both}
.slide-in{animation:slideIn 0.18s cubic-bezier(0.16,1,0.3,1) both}
.spin{animation:spin 1s linear infinite}
.pulse{animation:pulseRing 1.8s ease-in-out infinite}
.bounce0{animation:typingBounce 1.1s ease-in-out infinite;animation-delay:0ms}
.bounce1{animation:typingBounce 1.1s ease-in-out infinite;animation-delay:180ms}
.bounce2{animation:typingBounce 1.1s ease-in-out infinite;animation-delay:360ms}
textarea::-webkit-scrollbar{display:none}
`;

/* ─── Shooting Stars ─── */
function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let id: number;
    let stars: { x:number;y:number;vx:number;vy:number;tail:number;life:number;max:number;op:number }[] = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const spawn = () => {
      const a = (Math.random()*20+20)*Math.PI/180, sp = Math.random()*2.5+1.5;
      stars.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height*0.55-20,
        vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, tail:Math.random()*60+40,
        life:0, max:Math.random()*70+60, op:Math.random()*0.5+0.4 });
    };
    let f = 0;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height); f++;
      if (f%100===0) spawn();
      stars = stars.filter(s=>s.life<s.max);
      for (const s of stars) {
        s.life++; s.x+=s.vx; s.y+=s.vy;
        const p=s.life/s.max, fade=p<0.2?p/0.2:p>0.7?(1-(p-0.7)/0.3):1, alpha=s.op*fade;
        const ang=Math.atan2(s.vy,s.vx);
        const g=ctx.createLinearGradient(s.x-Math.cos(ang)*s.tail,s.y-Math.sin(ang)*s.tail,s.x,s.y);
        g.addColorStop(0,"rgba(255,255,255,0)"); g.addColorStop(0.6,`rgba(180,210,255,${alpha*0.35})`); g.addColorStop(1,`rgba(255,255,255,${alpha})`);
        ctx.beginPath(); ctx.moveTo(s.x-Math.cos(ang)*s.tail,s.y-Math.sin(ang)*s.tail); ctx.lineTo(s.x,s.y);
        ctx.strokeStyle=g; ctx.lineWidth=1; ctx.lineCap="round"; ctx.stroke();
        const rg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,3);
        rg.addColorStop(0,`rgba(210,230,255,${alpha})`); rg.addColorStop(1,"transparent");
        ctx.beginPath(); ctx.arc(s.x,s.y,3,0,Math.PI*2); ctx.fillStyle=rg; ctx.fill();
      }
      id = requestAnimationFrame(draw);
    };
    spawn(); spawn(); draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

/* ─── Orb background ─── */
function OrbBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div style={{position:"absolute",top:"35%",left:"50%",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,130,246,0.065) 0%,rgba(99,102,241,0.03) 50%,transparent 70%)",filter:"blur(48px)",animation:"orbFloat 7s ease-in-out infinite",transform:"translate(-50%,-50%)"}} />
      <div className="absolute inset-0" style={{backgroundImage:"linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)",backgroundSize:"44px 44px"}} />
    </div>
  );
}

/* ─── Typing dots ─── */
function Dots() {
  return (
    <span className="inline-flex items-center gap-[3px]">
      <span className="w-1 h-1 rounded-full bg-blue-500 bounce0" />
      <span className="w-1 h-1 rounded-full bg-blue-500 bounce1" />
      <span className="w-1 h-1 rounded-full bg-blue-500 bounce2" />
    </span>
  );
}

/* ─── Suggestion chip ─── */
function Chip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative overflow-hidden px-3 py-[7px] rounded-lg cursor-pointer font-[inherit] bg-white/[0.02] border-none outline-none transition-all duration-150 hover:bg-white/[0.04] hover:-translate-y-px group">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="99%" height="99%" rx="7.5" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" strokeDasharray="4 3" />
      </svg>
      <div className="absolute inset-0 rounded-lg pointer-events-none" style={{backgroundImage:"repeating-linear-gradient(-45deg,transparent,transparent 4px,rgba(255,255,255,0.01) 4px,rgba(255,255,255,0.01) 5px)"}} />
      <span className="relative z-10 text-[11px] text-[#3f3f46] group-hover:text-[#71717a] tracking-tight transition-colors duration-150 whitespace-nowrap">{label}</span>
    </button>
  );
}

/* ─── Thinking block ─── */
function ThinkingBlock({ text, searching }: { text?: string; searching?: string }) {
  const [open, setOpen] = useState(false);
  if (!text && !searching) return null;
  return (
    <div className="mb-1.5">
      <button onClick={() => setOpen(v=>!v)} className="flex items-center gap-1.5 text-[10px] bg-transparent border-none cursor-pointer font-[inherit] tracking-wide py-0.5 px-0 transition-colors text-[#52525b] hover:text-[#71717a]">
        <ChevronRight size={10} className="transition-transform duration-150" style={{transform:open?"rotate(90deg)":"none"}} />
        {searching
          ? <><Search size={9} className="text-emerald-400" /><span className="text-emerald-400">Searched: {searching}</span></>
          : <><Brain size={9} className="text-violet-400" /><span className="text-violet-400">Thinking</span></>}
      </button>
      {open && text && (
        <div className="mt-1 px-2.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[11px] text-[#3f3f46] leading-relaxed tracking-tight italic msg-in">{text}</div>
      )}
    </div>
  );
}

/* ─── File preview badge ─── */
function FileBadge({ file, onRemove }: { file: UploadedFile; onRemove?: () => void }) {
  const isImage = file.type.startsWith("image/");
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] group">
      {isImage
        ? <img src={file.dataUrl} className="w-4 h-4 rounded object-cover" />
        : <FileText size={12} className="text-[#52525b] shrink-0" />}
      <span className="text-[10px] text-[#71717a] tracking-tight max-w-[100px] truncate">{file.name}</span>
      <span className="text-[9px] text-[#3f3f46]">{(file.size/1024).toFixed(0)}kb</span>
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 text-[#3f3f46] hover:text-red-400 bg-transparent border-none cursor-pointer transition-colors p-0 flex items-center">
          <X size={9} />
        </button>
      )}
    </div>
  );
}

/* ─── Action button ─── */
function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-[10px] text-[#3f3f46] hover:text-[#a1a1aa] bg-transparent hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] px-1.5 py-0.5 rounded-[5px] cursor-pointer font-[inherit] tracking-wide transition-all duration-100">
      {icon}{label}
    </button>
  );
}

/* ─── Message row ─── */
function MessageRow({ msg, onEdit, onRegenerate, isLast, isLoading }: {
  msg: Message; onEdit?: (id:string,content:string)=>void;
  onRegenerate?: ()=>void; isLast: boolean; isLoading: boolean;
}) {
  const isUser = msg.role === "user";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(msg.content);
  const [hovered, setHovered] = useState(false);

  const commitEdit = () => { if (draft.trim()) { onEdit?.(msg.id, draft.trim()); setEditing(false); } };

  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      className={`flex gap-2.5 msg-in ${isUser?"flex-row-reverse":"flex-row"}`}>
      <div className={`w-6 h-6 rounded-[6px] shrink-0 mt-0.5 flex items-center justify-center text-[9px] font-bold tracking-wide ${isUser?"bg-blue-500/[0.15] border border-blue-500/[0.22] text-blue-400":"bg-white/[0.04] border border-white/[0.07] text-[#52525b]"}`}>
        {isUser?"U":"AI"}
      </div>
      <div className={`max-w-[74%] flex flex-col gap-1 ${isUser?"items-end":"items-start"}`}>
        {!isUser && <ThinkingBlock text={msg.thinking} searching={msg.searchQuery} />}

        {/* File attachments */}
        {msg.files && msg.files.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {msg.files.map(f => <FileBadge key={f.id} file={f} />)}
          </div>
        )}

        {editing ? (
          <div className="flex flex-col gap-1.5 w-80">
            <textarea value={draft} onChange={e=>setDraft(e.target.value)} autoFocus
              className="px-3 py-2 rounded-[10px] bg-blue-500/[0.08] border border-blue-500/[0.3] text-[#e4e4e7] text-[13px] font-[inherit] leading-relaxed outline-none resize-y min-h-[56px] tracking-tight" />
            <div className="flex gap-1.5 justify-end">
              <button onClick={()=>setEditing(false)} className="text-[10px] text-[#52525b] bg-transparent border border-white/[0.08] px-2.5 py-[3px] rounded-md cursor-pointer font-[inherit]">Cancel</button>
              <button onClick={commitEdit} className="text-[10px] text-white bg-blue-600 border-none px-2.5 py-[3px] rounded-md cursor-pointer font-[inherit] flex items-center gap-1"><Check size={9}/>Save & send</button>
            </div>
          </div>
        ) : isUser ? (
          <div className="px-3 py-2 rounded-[11px_4px_11px_11px] bg-blue-500/[0.10] border border-blue-500/[0.17] text-[#e4e4e7] text-[13px] leading-relaxed tracking-tight">{msg.content}</div>
        ) : (
          <div className="relative overflow-hidden px-3 py-2.5 rounded-[4px_11px_11px_11px] bg-white/[0.025] border border-white/[0.06] text-[#a1a1aa] text-[13px] leading-[1.7] tracking-tight">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-indigo-500/15 to-transparent" />
            <span className="pl-1">{msg.content}</span>
          </div>
        )}

        {!editing && hovered && !isLoading && (
          <div className="flex gap-1 mt-0.5 msg-in">
            {isUser && onEdit && <ActionBtn icon={<Pencil size={9}/>} label="Edit" onClick={()=>{setDraft(msg.content);setEditing(true);}} />}
            {!isUser && isLast && onRegenerate && <ActionBtn icon={<RotateCcw size={9}/>} label="Regenerate" onClick={onRegenerate} />}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Toolbar toggle ─── */
function ToolbarToggle({ icon: Icon, label, active, activeClass, onClick }: {
  icon: typeof Search; label: string; active: boolean; activeClass: string; onClick: ()=>void;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1 px-2 py-[3px] rounded-md text-[10px] cursor-pointer font-[inherit] tracking-wide border transition-all duration-150 ${active ? activeClass : "border-white/[0.07] bg-transparent text-[#3f3f46] hover:text-[#71717a] hover:border-white/[0.1]"}`}>
      <Icon size={10} strokeWidth={active?2.2:1.6} />
      {label}
      {active && <span className="w-1 h-1 rounded-full bg-current pulse" />}
    </button>
  );
}

/* ─── Model picker — opens upward, full visibility ─── */
function ModelPicker({ selected, onSelect }: { selected: string; onSelect: (m:string)=>void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h); return ()=>document.removeEventListener("mousedown",h);
  }, []);
  return (
    <div ref={ref} className="relative z-20">
      <button onClick={()=>setOpen(v=>!v)}
        className="flex items-center gap-1 px-2 py-[3px] rounded-md bg-white/[0.04] border border-white/[0.08] text-[#71717a] text-[10px] cursor-pointer font-[inherit] tracking-wide hover:border-white/[0.15] hover:text-[#a1a1aa] transition-all">
        <Sparkles size={9} className="text-blue-400" />
        {selected}
        <ChevronUp size={9} className={`transition-transform duration-150 ${open?"rotate-180":""}`} />
      </button>
      {open && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 bg-[#111111] border border-white/[0.1] rounded-xl overflow-hidden z-50 min-w-[150px] shadow-[0_-16px_48px_rgba(0,0,0,0.8)] drop-up">
          <div className="px-3 py-1.5 border-b border-white/[0.06]">
            <span className="text-[9px] text-[#3f3f46] tracking-widest uppercase font-medium">Select model</span>
          </div>
          {MODELS.map(m => (
            <button key={m} onClick={()=>{onSelect(m);setOpen(false);}}
              className={`flex items-center justify-between w-full text-left px-3 py-2 text-[11px] cursor-pointer font-[inherit] border-none transition-all tracking-wide ${m===selected?"bg-blue-500/[0.12] text-blue-400":"bg-transparent text-[#71717a] hover:bg-white/[0.05] hover:text-[#e4e4e7]"}`}>
              {m}
              {m===selected && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Chat history sidebar ─── */
function HistorySidebar({ chats, activeChatId, onSelect, onNew, onDelete, open }: {
  chats: Chat[]; activeChatId: string | null;
  onSelect: (id:string)=>void; onNew: ()=>void; onDelete: (id:string)=>void; open: boolean;
}) {
  if (!open) return null;
  const grouped = chats.reduce<Record<string, Chat[]>>((acc, chat) => {
    const d = new Date(chat.updatedAt);
    const now = new Date();
    const diff = (now.getTime()-d.getTime())/(1000*60*60*24);
    const label = diff < 1 ? "Today" : diff < 2 ? "Yesterday" : diff < 7 ? "This week" : "Older";
    if (!acc[label]) acc[label] = [];
    acc[label].push(chat);
    return acc;
  }, {});
  const order = ["Today","Yesterday","This week","Older"];

  return (
    <div className="w-[200px] shrink-0 border-r border-white/[0.06] flex flex-col bg-[#0a0a0a] slide-in overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06] shrink-0">
        <span className="text-[10px] text-[#3f3f46] tracking-widest uppercase font-medium">History</span>
        <button onClick={onNew} className="flex items-center gap-1 text-[10px] text-[#52525b] hover:text-[#e4e4e7] bg-transparent border-none cursor-pointer font-[inherit] px-1.5 py-0.5 rounded-md hover:bg-white/[0.05] transition-all">
          <Plus size={11} />New
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-1" style={{scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.05) transparent"}}>
        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
            <MessageSquare size={18} className="text-[#2e2e33]" />
            <p className="text-[10px] text-[#2e2e33] tracking-tight">No chats yet</p>
          </div>
        )}
        {order.filter(l=>grouped[l]).map(label => (
          <div key={label}>
            <p className="text-[9px] text-[#2e2e33] tracking-widest uppercase px-3 pt-2.5 pb-1">{label}</p>
            {grouped[label].map(chat => (
              <div key={chat.id}
                onClick={()=>onSelect(chat.id)}
                className={`group flex items-center gap-2 px-3 py-2 cursor-pointer transition-all ${chat.id===activeChatId?"bg-white/[0.06] text-[#e4e4e7]":"text-[#52525b] hover:bg-white/[0.03] hover:text-[#a1a1aa]"}`}>
                <MessageSquare size={11} className="shrink-0 opacity-60" />
                <span className="flex-1 text-[11px] tracking-tight truncate leading-snug">{chat.title}</span>
                <button onClick={e=>{e.stopPropagation();onDelete(chat.id);}}
                  className="opacity-0 group-hover:opacity-100 text-[#3f3f46] hover:text-red-400 bg-transparent border-none cursor-pointer p-0 flex items-center transition-all">
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function ChatTab() {
  const [chats, setChats]           = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string|null>(null);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [input, setInput]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [model, setModel]           = useState(MODELS[0]);
  const [focused, setFocused]       = useState(false);
  const [searchOn, setSearchOn]     = useState(false);
  const [reasonOn, setReasonOn]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([]);
  const bottomRef                   = useRef<HTMLDivElement>(null);
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);
  const abortRef                    = useRef<AbortController|null>(null);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, isLoading]);

  /* Save messages to active chat whenever they change */
  useEffect(() => {
    if (!activeChatId || messages.length === 0) return;
    setChats(prev => prev.map(c => c.id === activeChatId
      ? { ...c, messages, updatedAt: new Date(), title: messages[0].content.slice(0,32) || c.title }
      : c));
  }, [messages, activeChatId]);

  const newChat = useCallback(() => {
    const id = crypto.randomUUID();
    const chat: Chat = { id, title: "New chat", messages: [], updatedAt: new Date() };
    setChats(prev => [chat, ...prev]);
    setActiveChatId(id);
    setMessages([]);
    setPendingFiles([]);
    setInput("");
  }, []);

  const selectChat = useCallback((id: string) => {
    const chat = chats.find(c=>c.id===id);
    if (!chat) return;
    setActiveChatId(id);
    setMessages(chat.messages);
    setPendingFiles([]);
  }, [chats]);

  const deleteChat = useCallback((id: string) => {
    setChats(prev=>prev.filter(c=>c.id!==id));
    if (activeChatId===id) { setActiveChatId(null); setMessages([]); }
  }, [activeChatId]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPendingFiles(prev=>[...prev,{ id:crypto.randomUUID(), name:file.name, type:file.type, dataUrl:reader.result as string, size:file.size }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const buildSystem = useCallback(() => [
    `You are a sharp AI assistant inside Novex ${APP_VERSION}. Model: ${model}.`,
    reasonOn && "Reason step by step. Wrap internal thinking in <think>…</think> tags.",
    searchOn && "Web search enabled. Wrap search queries in <search>…</search> tags.",
  ].filter(Boolean).join(" "), [model, reasonOn, searchOn]);

  const doSend = useCallback(async (history: { role:string; content:string }[]) => {
    setIsLoading(true);
    const ctrl = new AbortController(); abortRef.current = ctrl;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", signal:ctrl.signal,
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:buildSystem(), messages:history }),
      });
      const data = await res.json();
      let raw = data.content?.map((c:{type:string;text?:string})=>c.type==="text"?c.text:"").join("")??"";
      let thinking:string|undefined, searchQuery:string|undefined;
      const tM=raw.match(/<think>([\s\S]*?)<\/think>/i);
      const sM=raw.match(/<search>([\s\S]*?)<\/search>/i);
      if(tM){thinking=tM[1].trim();raw=raw.replace(tM[0],"").trim();}
      if(sM){searchQuery=sM[1].trim();raw=raw.replace(sM[0],"").trim();}
      setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:"assistant",content:raw||"Done.",timestamp:new Date(),thinking,searchQuery}]);
    } catch(e:unknown) {
      if(e instanceof Error && e.name!=="AbortError")
        setMessages(prev=>[...prev,{id:crypto.randomUUID(),role:"assistant",content:"Connection failed. Is Ollama running?",timestamp:new Date()}]);
    } finally { setIsLoading(false); abortRef.current=null; }
  }, [buildSystem]);

  const send = useCallback(async (text?: string) => {
    const content = (text??input).trim();
    if (!content || isLoading) return;

    // Create chat if none active
    let chatId = activeChatId;
    if (!chatId) {
      chatId = crypto.randomUUID();
      const chat: Chat = { id:chatId, title:content.slice(0,32), messages:[], updatedAt:new Date() };
      setChats(prev=>[chat,...prev]);
      setActiveChatId(chatId);
    }

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    const files = pendingFiles.length>0 ? [...pendingFiles] : undefined;
    setPendingFiles([]);

    const userMsg: Message = { id:crypto.randomUUID(), role:"user", content, timestamp:new Date(), files };
    const next = [...messages, userMsg];
    setMessages(next);
    await doSend(next.map(m=>({role:m.role,content:m.content})));
  }, [input, isLoading, messages, activeChatId, pendingFiles, doSend]);

  const cancel = () => { abortRef.current?.abort(); setIsLoading(false); };

  const regenerate = useCallback(async () => {
    if (isLoading) return;
    const trimmed = messages[messages.length-1]?.role==="assistant" ? messages.slice(0,-1) : messages;
    setMessages(trimmed);
    await doSend(trimmed.map(m=>({role:m.role,content:m.content})));
  }, [messages, isLoading, doSend]);

  const editMessage = useCallback(async (id:string, newContent:string) => {
    const idx = messages.findIndex(m=>m.id===id);
    if (idx===-1) return;
    const userMsg: Message = { id:crypto.randomUUID(), role:"user", content:newContent, timestamp:new Date() };
    const next = [...messages.slice(0,idx), userMsg];
    setMessages(next);
    await doSend(next.map(m=>({role:m.role,content:m.content})));
  }, [messages, doSend]);

  const handleKey = (e: React.KeyboardEvent) => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height="auto";
    e.target.style.height=Math.min(e.target.scrollHeight,140)+"px";
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full bg-[#0a0a0a] overflow-hidden" onDrop={handleDrop} onDragOver={handleDragOver}>
      <style>{CSS}</style>
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e=>handleFiles(e.target.files)} />

      {/* ── History sidebar ── */}
      <HistorySidebar
        chats={chats} activeChatId={activeChatId}
        onSelect={selectChat} onNew={newChat}
        onDelete={deleteChat} open={sidebarOpen}
      />

      {/* ── Main column ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* ── Top bar ── */}
        <div className="h-9 border-b border-white/[0.05] flex items-center px-3 gap-2 shrink-0">
          <button onClick={()=>setSidebarOpen(v=>!v)}
            className="text-[#3f3f46] hover:text-[#71717a] bg-transparent border-none cursor-pointer p-0.5 rounded transition-colors flex items-center">
            {sidebarOpen ? <PanelLeftClose size={13} /> : <PanelLeftOpen size={13} />}
          </button>
          <div className="w-px h-3 bg-white/[0.06]" />
          <span className="text-[10px] text-[#2e2e33] tracking-tight">
            {activeChatId ? (chats.find(c=>c.id===activeChatId)?.title || "Chat") : "New chat"}
          </span>
          {!isEmpty && !isLoading && (
            <button onClick={()=>{setMessages([]);setActiveChatId(null);}}
              className="ml-auto flex items-center gap-1 text-[10px] text-[#2e2e33] hover:text-[#52525b] bg-transparent border-none cursor-pointer font-[inherit] tracking-wide transition-colors">
              <X size={10}/> Clear
            </button>
          )}
        </div>

        {/* ── Messages / empty ── */}
        <div className="flex-1 overflow-y-auto relative" style={{scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.05) transparent"}}>
          {isEmpty ? (
            <div className="relative h-full flex flex-col items-center justify-center gap-6 px-8 pb-16">
              <OrbBackground />
              <ShootingStars />
              <div className="text-center z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 bg-blue-500/[0.08] border border-blue-500/[0.14] text-[10px] text-blue-400 tracking-[0.07em] uppercase font-semibold">
                  <span className="w-[5px] h-[5px] rounded-full bg-blue-400 pulse" />
                  Novex {APP_VERSION}
                </div>
                <h2 className="text-[24px] font-semibold text-[#fafafa] tracking-[-0.04em] leading-[1.2] m-0">What can I help with?</h2>
                <p className="text-[12px] text-[#3f3f46] mt-2 tracking-tight">All processing happens on your machine</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 px-5 py-5 max-w-[720px] mx-auto">
              {messages.map((msg,i)=>(
                <MessageRow key={msg.id} msg={msg}
                  onEdit={msg.role==="user"?editMessage:undefined}
                  onRegenerate={msg.role==="assistant"&&i===messages.length-1?regenerate:undefined}
                  isLast={i===messages.length-1} isLoading={isLoading}
                />
              ))}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-[6px] shrink-0 flex items-center justify-center bg-white/[0.04] border border-white/[0.07] text-[9px] font-bold text-[#52525b]">AI</div>
                  <div className="flex flex-col gap-1.5">
                    {(searchOn||reasonOn) && (
                      <div className="flex items-center gap-1.5 text-[10px]">
                        <Loader2 size={10} className="spin" />
                        {reasonOn?<span className="text-violet-400">Thinking…</span>:<span className="text-emerald-400">Searching…</span>}
                      </div>
                    )}
                    <div className="relative overflow-hidden px-3 py-2.5 rounded-[4px_11px_11px_11px] bg-white/[0.025] border border-white/[0.06] inline-flex items-center">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-indigo-500/15 to-transparent" />
                      <span className="pl-1"><Dots /></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── Input area ── */}
        <div className="px-4 pb-4 pt-2 shrink-0">
          <div className="max-w-[720px] mx-auto">

            {/* Suggestions */}
            {isEmpty && (
              <div className="flex gap-1.5 flex-wrap mb-2">
                {SUGGESTIONS.map(s=><Chip key={s} label={s} onClick={()=>send(s)} />)}
              </div>
            )}

            {/* Input card */}
            <div className={`rounded-[13px] bg-white/[0.03] border overflow-visible transition-all duration-200 ${focused?"border-blue-500/[0.38] shadow-[0_0_0_3px_rgba(59,130,246,0.07),0_0_24px_rgba(59,130,246,0.06)]":"border-white/[0.08]"}`}>

              {/* Pending files */}
              {pendingFiles.length>0 && (
                <div className="flex flex-wrap gap-1.5 px-3 pt-2.5">
                  {pendingFiles.map(f=><FileBadge key={f.id} file={f} onRemove={()=>setPendingFiles(prev=>prev.filter(p=>p.id!==f.id))} />)}
                </div>
              )}

              {/* Textarea */}
              <div className="flex items-end gap-2 px-3 pt-2.5 pb-1.5">
                <textarea
                  ref={textareaRef} value={input} onChange={handleChange} onKeyDown={handleKey}
                  onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
                  placeholder="Ask anything…" rows={1}
                  className="flex-1 bg-transparent border-none outline-none resize-none text-[13px] text-[#e4e4e7] font-[inherit] tracking-tight leading-relaxed min-h-[22px] max-h-[140px] placeholder-[#2a2a30]"
                  style={{scrollbarWidth:"none"}}
                />
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1.5 px-2.5 py-2 border-t border-white/[0.04]">
                <ModelPicker selected={model} onSelect={setModel} />
                <div className="w-px h-3 bg-white/[0.07]" />
                <ToolbarToggle icon={Search} label="Search" active={searchOn}
                  activeClass="border-emerald-500/[0.3] bg-emerald-500/[0.08] text-emerald-400 font-semibold"
                  onClick={()=>setSearchOn(v=>!v)} />
                <ToolbarToggle icon={Brain} label="Reasoning" active={reasonOn}
                  activeClass="border-violet-500/[0.3] bg-violet-500/[0.08] text-violet-400 font-semibold"
                  onClick={()=>setReasonOn(v=>!v)} />

                <div className="w-px h-3 bg-white/[0.07]" />

                {/* File upload */}
                <button onClick={()=>fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2 py-[3px] rounded-md text-[10px] text-[#3f3f46] hover:text-[#71717a] bg-transparent border border-white/[0.07] hover:border-white/[0.1] cursor-pointer font-[inherit] tracking-wide transition-all">
                  <Paperclip size={10} />
                  {pendingFiles.length>0 ? <span className="text-blue-400">{pendingFiles.length} file{pendingFiles.length>1?"s":""}</span> : "Attach"}
                </button>

                <div className="ml-auto flex items-center gap-1.5">
                  {isLoading && (
                    <button onClick={cancel} className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/[0.08] border border-red-500/[0.2] px-2 py-[3px] rounded-md cursor-pointer font-[inherit] tracking-wide hover:bg-red-500/[0.14] transition-colors">
                      <StopCircle size={10}/>Stop
                    </button>
                  )}
                  <button onClick={()=>send()} disabled={!input.trim()||isLoading}
                    className={`w-7 h-7 rounded-[8px] border-none flex items-center justify-center transition-all duration-150 ${input.trim()&&!isLoading?"bg-gradient-to-br from-blue-600 to-blue-700 cursor-pointer shadow-[0_2px_12px_rgba(37,99,235,0.4)]":"bg-white/[0.05] cursor-not-allowed"}`}>
                    <Send size={12} className={input.trim()&&!isLoading?"text-white":"text-[#3f3f46]"} />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-center text-[10px] text-[#1a1a1f] mt-1.5 tracking-wide">Enter to send · Shift+Enter for new line · Drag & drop files</p>
          </div>
        </div>
      </div>
    </div>
  );
}