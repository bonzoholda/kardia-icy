import { useState, useEffect, useMemo } from "react";
import { ConnectWallet } from "./components/ConnectWallet";
import { useController } from "./hooks/useController";
import { Actions } from "./components/Actions";
import Stats from "./components/Stats";
import DripStats from "./components/DripStats";
import { fmt } from "./utils/format";
import Logo from "./assets/kdialogo.png";
import Tokenomics from "./components/Tokenomics";
import { SwapTrading } from "./components/SwapTrading"; // Added Import

// Web3 & Telegram Imports
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { TokenApprovalGuard } from "./components/TokenApprovalGuard";

/**
 * CONFIGURATION
 */
const CONTROLLER_ADDRESS = import.meta.env.VITE_CONTROLLER_ADDRESS as `0x${string}` | undefined;
const MOCK_USDT_ADDRESS = import.meta.env.VITE_USDT_ADDRESS as `0x${string}` | undefined;
const KDIA_ADDRESS = import.meta.env.VITE_KDIA_ADDRESS as `0x${string}` | undefined;

export default function App() {
  const { minersPool, rewardPool, totalPU } = useController();
  const [activeTab, setActiveTab] = useState<"mining" | "tokenomics">("mining");
  
  // Web3 Hooks
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  // Optimized Telegram Detection
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

  return (   
    <div className="min-h-screen bg-transparent p-4 pb-24 md:p-6 relative">
      
      {/* ───── HOME LOGO NAVIGATION ───── */}
      <div className="fixed top-4 left-4 z-[100] md:top-6 md:left-6">
        <a 
          href="https://kardiatoken.wordpress.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/40 border border-white/60 backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>
      </div>

      <div className="flex justify-center mb-8">
        <div className="pulse-glow">
          <img
            src={Logo}
            alt="Kardia-Token"
            className="relative z-10 mx-auto w-full max-w-[180px] h-auto"
          />
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* ───── TAB NAVIGATION ───── */}
        <div className="flex bg-white/20 p-1 rounded-xl border border-white/40 shadow-inner backdrop-blur-md">
          <button
            onClick={() => toggleTab("mining")}
            className={`flex-1 py-3 rounded-lg text-xs font-bold font-['Orbitron'] tracking-widest transition-all duration-300 ${
              activeTab === "mining" 
                ? "bg-gradient-to-r from-[#f7931a] to-[#e88300] text-white shadow-[0_0_15px_rgba(247,147,26,0.4)]" 
                : "text-sky-900/40 hover:text-sky-900 hover:bg-white/10"
            }`}
          >
            MINING HUB
          </button>
          <button
            onClick={() => toggleTab("tokenomics")}
            className={`flex-1 py-3 rounded-lg text-xs font-bold font-['Orbitron'] tracking-widest transition-all duration-300 ${
              activeTab === "tokenomics" 
                ? "bg-gradient-to-r from-[#f7931a] to-[#e88300] text-white shadow-[0_0_15px_rgba(247,147,26,0.4)]" 
                : "text-sky-900/40 hover:text-sky-900 hover:bg-white/10"
            }`}
          >
            TOKENOMICS
          </button>
        </div>

        {/* ───── CONTENT RENDERING ───── */}
        {activeTab === "mining" ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* MINING STATS CARD */}
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-sky-800/40 font-['Orbitron']">
                Perpetual Emission Protocol
              </h3>

              <div className="flex justify-center">
                <ConnectWallet />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Stat label="Miners Pool" value={minersPool.data} decimals={18} />
                <Stat label="Reward Pool" value={rewardPool.data} decimals={18} />
                <div className="col-span-2">
                  <Stat label="Total Power Units (Network Share)" value={totalPU.data} decimals={18} />
                </div>
              </div>

              <Stats />
              <DripStats />

              <hr className="border-sky-500/10" />

              {CONTROLLER_ADDRESS && (
                <TokenApprovalGuard 
                  tokenAddress={MOCK_USDT_ADDRESS}
                  spenderAddress={CONTROLLER_ADDRESS}
                  amountRequired="0.1" 
                >
                  <TokenApprovalGuard
                    tokenAddress={KDIA_ADDRESS}
                    spenderAddress={CONTROLLER_ADDRESS}
                    amountRequired="0.1"
                  >
                    <Actions />
                  </TokenApprovalGuard>
                </TokenApprovalGuard> 
              )}
            </div>

            {/* SWAP HUB COMPONENT (Placed outside the glass-card for better visual separation or inside if preferred) */}
            <SwapTrading />
          </div>
        ) : (
          <Tokenomics />
        )}
      </div>
    </div>
  );
}

/**
 * ───── FIXED STAT COMPONENT ─────
 */
function Stat({ label, value, decimals }: { label: string; value?: bigint; decimals: number; }) {
  return (
    <div className="panel p-3 text-center border-white/20">
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-800/70 mb-1 font-['Orbitron']">
        {label}
      </p>
      <p className="text-xl font-bold text-slate-900 font-['Inter']">
        {value !== undefined ? fmt(value, decimals, 2) : "—"}
      </p>
    </div>
  );
}
