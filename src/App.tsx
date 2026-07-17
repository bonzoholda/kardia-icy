import { useState, useEffect, useMemo } from "react";
import { ConnectWallet } from "./components/ConnectWallet";
import { useController } from "./hooks/useController";
import { Actions } from "./components/Actions";
import Stats from "./components/Stats";
import DripStats from "./components/DripStats";
import { fmt } from "./utils/format";
import Tokenomics from "./components/Tokenomics";
import { SwapTrading } from "./components/SwapTrading";

// Web3 & Telegram Imports
import { useAccount, useReadContract } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { TokenApprovalGuard } from "./components/TokenApprovalGuard";
import { SPHYGMOS_CONTROLLER_ABI } from "./abi/SphygmosController";
import { 
  Compass, 
  ExternalLink, 
  Info, 
  Zap, 
  ChevronDown, 
  Award, 
  Cpu, 
  Lock, 
  Coins, 
  Database,
  Volume2
} from "lucide-react";

const CONTROLLER_ADDRESS = import.meta.env.VITE_CONTROLLER_ADDRESS as `0x${string}` | undefined;
const MOCK_USDT_ADDRESS = import.meta.env.VITE_USDT_ADDRESS as `0x${string}` | undefined;
const KDIA_ADDRESS = import.meta.env.VITE_KDIA_ADDRESS as `0x${string}` | undefined;

export default function App() {
  const { minersPool, rewardPool, totalPU } = useController();
  const [activeTab, setActiveTab] = useState<"mining" | "tokenomics">("mining");
  
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  // Additional Read for Total Staked KDIA from controller
  const { data: totalStaked } = useReadContract({
    address: CONTROLLER_ADDRESS,
    abi: SPHYGMOS_CONTROLLER_ABI,
    functionName: "totalStakedKDIA",
    query: { enabled: !!CONTROLLER_ADDRESS, refetchInterval: 10000 },
  });

  const tg = useMemo(() => {
    const telegramApp = (window as any).Telegram?.WebApp;
    return telegramApp?.platform !== 'unknown' ? telegramApp : null;
  }, []);

  useEffect(() => {
    if (!tg) return;
    tg.ready();
    tg.expand();

    if (!isConnected) {
      tg.MainButton.setText("CONNECT WALLET");
      tg.MainButton.show();
      
      const handleMainButtonClick = () => {
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred("medium");
        open();
      };

      tg.MainButton.onClick(handleMainButtonClick);
      return () => {
        tg.MainButton.offClick(handleMainButtonClick);
        tg.MainButton.hide();
      };
    } else {
      tg.MainButton.hide();
    }
  }, [tg, isConnected, open]);

  const toggleTab = (tab: "mining" | "tokenomics") => {
    setActiveTab(tab);
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred("medium");
    }
  };

  // Official Gold Logo
  const kdiaLogo = (
    <div className="relative flex items-center justify-center w-11 h-11 select-none">
      <div className="absolute inset-0 bg-amber-500/15 rounded-xl blur-md pulse-glow-effect"></div>
      <img 
        src="/kdiagold.png" 
        alt="KDIA Gold Logo" 
        className="w-10 h-10 object-contain relative z-10 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.45)] transition-all duration-300 hover:scale-110"
        referrerPolicy="no-referrer"
      />
    </div>
  );

  return (   
    <div className="min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-400 relative overflow-x-hidden">
      
      {/* Immersive Scanline and Ambient Glowing Sources */}
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-cyber-radial pointer-events-none" />
      
      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none pulse-glow-effect" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none pulse-glow-effect" style={{ animationDelay: '-4s' }} />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[130px] pointer-events-none pulse-glow-effect" style={{ animationDelay: '-2s' }} />

      {/* ───── NAVIGATION HEADER ───── */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-500/10 bg-[#070a13]/75 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3.5">
            {kdiaLogo}
            <div className="flex flex-col">
              <span className="text-base font-black tracking-widest text-white font-orbitron">
                KDIA <span className="text-emerald-400 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]">MiningHub</span>
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase font-mono">
                  MAINNET SECURE
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-widest text-slate-400 uppercase font-orbitron">
            <a 
              href="https://kdiaweb.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-all duration-200 flex items-center gap-1.5 hover:translate-y-[-1px]"
            >
              Landing Page <ExternalLink size={11} className="text-emerald-500/80" />
            </a>
            <a 
              href="https://icykardia.netlify.app/ventric" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-all duration-200 flex items-center gap-1.5 hover:translate-y-[-1px]"
            >
              Ventric dApp <ExternalLink size={11} className="text-emerald-500/80" />
            </a>
          </nav>

          {/* Connect Button */}
          <div className="flex items-center gap-3">
            <ConnectWallet />
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-10 relative z-10">

        {/* ───── ECOSYSTEM BANNER ───── */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-5 backdrop-blur-md shadow-[0_4px_30px_rgba(16,185,129,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-xl rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-500" />
          
          <div className="flex gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl h-fit border border-emerald-500/20 flex-shrink-0 animate-pulse text-emerald-400">
              <Award className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] font-orbitron">
                Ecosystem Transmission
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Looking to amplify your yields? Navigate to the{" "}
                <a 
                  href="https://icykardia.netlify.app/ventric" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-400 hover:text-amber-300 font-bold underline decoration-dotted transition-colors filter drop-shadow-[0_0_6px_rgba(245,158,11,0.3)]"
                >
                  KDIA Ventric dApp
                </a>{" "}
                to lock in Matrix Tickets and activate multi-tier USDT affiliate rewards instantly!
              </p>
            </div>
          </div>
        </div>

        {/* ───── "BITCOIN VACUUM" LIVE STATS DISPLAY ───── */}
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
            <h3 className="text-xs font-black tracking-[0.3em] text-slate-300 uppercase font-orbitron flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.5)] animate-pulse" />
              Bitcoin Vacuum Diagnostics
            </h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                BSC LINK STABLE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* minersPool Balance */}
            <div className="cyber-panel p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
              <p className="text-[9px] uppercase tracking-[0.25em] font-black text-emerald-400/70 font-orbitron">Miners Pool</p>
              <p className="text-2xl font-black text-white mt-2 font-mono tracking-tight group-hover:text-emerald-400 transition-all">
                {minersPool.data !== undefined ? fmt(minersPool.data, 18, 2) : "—"}
              </p>
              <span className="text-[9px] font-bold text-slate-500 mt-2 block font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse"></span>
                Accumulating Live
              </span>
            </div>

            {/* rewardPool Balance */}
            <div className="cyber-panel p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
              <p className="text-[9px] uppercase tracking-[0.25em] font-black text-emerald-400/70 font-orbitron">Reward Pool</p>
              <p className="text-2xl font-black text-white mt-2 font-mono tracking-tight group-hover:text-emerald-400 transition-all">
                {rewardPool.data !== undefined ? fmt(rewardPool.data, 18, 2) : "—"}
              </p>
              <span className="text-[9px] font-bold text-slate-500 mt-2 block font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse"></span>
                Emitting Linear
              </span>
            </div>

            {/* totalPU Balance */}
            <div className="cyber-panel p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-300" />
              <p className="text-[9px] uppercase tracking-[0.25em] font-black text-emerald-400/70 font-orbitron">Total Power</p>
              <p className="text-2xl font-black text-white mt-2 font-mono tracking-tight group-hover:text-emerald-400 transition-all">
                {totalPU.data !== undefined ? fmt(totalPU.data, 18, 2) : "—"}
              </p>
              <span className="text-[9px] font-bold text-slate-500 mt-2 block font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse"></span>
                Units Allocated
              </span>
            </div>

            {/* totalStaked Balance */}
            <div className="cyber-panel-amber p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-bl-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-300" />
              <p className="text-[9px] uppercase tracking-[0.25em] font-black text-amber-500 font-orbitron">Total Staked</p>
              <p className="text-2xl font-black text-white mt-2 font-mono tracking-tight group-hover:text-amber-400 transition-all">
                {totalStaked !== undefined ? fmt(totalStaked, 18, 2) : "—"}
              </p>
              <span className="text-[9px] font-bold text-amber-500/70 mt-2 block font-mono flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Security Vaulted
              </span>
            </div>

          </div>
        </section>

        {/* ───── CENTERPIECE TERMINAL (Live Minting Engine) ───── */}
        <section className="space-y-6">
          
          {/* TAB NAVIGATION */}
          <div className="flex bg-[#04060c]/80 p-2 rounded-2xl border border-emerald-500/10 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-xl max-w-md mx-auto relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
            <button
              onClick={() => toggleTab("mining")}
              className={`flex-1 py-3.5 rounded-xl text-xs font-black font-orbitron tracking-widest transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "mining" 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-black" 
                  : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              MINING CORE
            </button>
            <button
              onClick={() => toggleTab("tokenomics")}
              className={`flex-1 py-3.5 rounded-xl text-xs font-black font-orbitron tracking-widest transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === "tokenomics" 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-black" 
                  : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              TOKENOMICS
            </button>
          </div>

          {/* CONTENT RENDERING */}
          {activeTab === "mining" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="rounded-3xl border border-emerald-500/10 bg-[#0c1222]/40 p-6 md:p-10 space-y-8 relative overflow-hidden backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                {/* Visual Glow Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none pulse-glow-effect" />
                
                {/* Cyber Brackets decoration */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500/30" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500/30" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500/30" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500/30" />

                <div className="text-center relative space-y-4">
                  {/* Rotating visual core */}
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center select-none">
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
                    <div className="absolute inset-0 border-2 border-dashed border-emerald-500/20 rounded-full animate-[spin_40s_linear_infinite]" />
                    <div className="absolute inset-2 border border-dotted border-teal-400/30 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                    <div className="absolute inset-6 bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                      <Cpu className="w-8 h-8 text-emerald-400 animate-pulse filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 font-orbitron filter drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]">
                      KDIA VIRTUAL-MINING CORE
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Power up your digital units to harness continuous KDIA emissions.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <Stats />
                  <div className="space-y-6">
                    <DripStats />
                    {CONTROLLER_ADDRESS && (
                      <TokenApprovalGuard 
                        tokenAddress={MOCK_USDT_ADDRESS || "0x..." as `0x${string}`}
                        spenderAddress={CONTROLLER_ADDRESS}
                        amountRequired="0.1" 
                      >
                        <TokenApprovalGuard
                          tokenAddress={KDIA_ADDRESS || "0x..." as `0x${string}`}
                          spenderAddress={CONTROLLER_ADDRESS}
                          amountRequired="0.1"
                        >
                          <Actions />
                        </TokenApprovalGuard>
                      </TokenApprovalGuard> 
                    )}
                  </div>
                </div>

              </div>

              <SwapTrading />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Tokenomics />
            </div>
          )}
        </section>

      </main>

      {/* Footer copyright */}
      <footer className="py-10 border-t border-emerald-500/10 text-center text-[10px] tracking-[0.25em] text-slate-500 uppercase font-black mt-16 bg-[#04060c] relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-20" />
        <p className="font-mono">© 2026 KDIA ECOSYSTEM. ALL POWER CHIPS STABLE & ONLINE.</p>
      </footer>
    </div>
  );
}

function Stat({ label, value, decimals }: { label: string; value?: bigint; decimals: number; }) {
  return (
    <div className="cyber-panel p-5 text-center">
      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-2 font-orbitron">
        {label}
      </p>
      <p className="text-xl font-black text-white font-mono">
        {value !== undefined ? fmt(value, decimals, 2) : "—"}
      </p>
    </div>
  );
}
