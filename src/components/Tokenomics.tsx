import { useState } from "react";
import { Flame, Coins, ShieldCheck, Zap, Copy, Check, CheckCircle2 } from "lucide-react";

export default function Tokenomics() {
  const [copied, setCopied] = useState(false);
  const CONTRACT_ADDRESS = "0xf8D4E7A6c6Db5aB8013c1FcB190cCBC140F44Ac5";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. KEY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="cyber-panel p-5.5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-3xl pointer-events-none" />
          <p className="text-[10px] uppercase tracking-[0.25em] font-black text-emerald-400/80 font-orbitron mb-1.5">
            Max Supply
          </p>
          <p className="text-3xl font-black text-white font-mono tracking-tight">11,000,000</p>
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mt-1.5 font-mono">KDIA</p>
        </div>
        
        <div className="cyber-panel p-5.5 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 rounded-bl-3xl pointer-events-none" />
          <p className="text-[10px] uppercase tracking-[0.25em] font-black text-emerald-400/80 font-orbitron mb-1.5">
            Protocol Type
          </p>
          <p className="text-xl font-black text-white font-orbitron tracking-wide">DEFLATIONARY</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5 font-mono font-bold">COMMUNITY DRIVEN</p>
        </div>
      </div>

      {/* 2. ON-CHAIN TRANSPARENCY & SECURITY CARD (The "Code is Law" Badge) */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-[#0c1222]/40 p-5.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none" />
        
        <p className="text-[10px] uppercase tracking-[0.25em] font-black text-emerald-400 mb-3.5 font-orbitron text-center">
          Verified Smart Contract
        </p>
        <div className="flex items-center justify-between bg-[#04060c]/80 rounded-xl p-4 border border-slate-800">
          <code className="text-xs font-mono text-slate-300 break-all select-all pr-2">
            {CONTRACT_ADDRESS}
          </code>
          <button 
            id="copy-contract-btn"
            onClick={copyToClipboard}
            className="p-2.5 rounded-xl bg-[#0c1222] hover:bg-[#141b30] border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 transition-all active:scale-90 cursor-pointer"
            title="Copy Contract Address"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
        {copied && (
          <p className="text-[9px] text-emerald-400 font-bold mt-2.5 text-center animate-pulse uppercase tracking-widest font-mono">
            Copied to Clipboard
          </p>
        )}

        <div className="mt-5.5 pt-4.5 border-t border-slate-850 space-y-3.5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]" />
            <span className="text-xs text-slate-300 font-semibold">Ownership Renounced</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]" />
            <span className="text-xs text-slate-300 font-semibold">No Developer Fees / Flat 0%</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]" />
            <span className="text-xs text-slate-300 font-semibold">100% Locked Liquidity Pool</span>
          </div>
        </div>
      </div>

      {/* 3. EMISSION FRAMEWORK */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-[#0c1222]/40 p-6.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
          <Flame className="text-amber-500 w-5 h-5 animate-pulse filter drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" />
          <h3 className="text-xs font-black tracking-[0.25em] text-emerald-400 font-orbitron uppercase">
            EMISSION FRAMEWORK
          </h3>
        </div>

        <div className="space-y-5.5">
          <div className="flex gap-4">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 h-fit text-emerald-400">
               <ShieldCheck className="w-4.5 h-4.5 filter drop-shadow-[0_0_3px_rgba(16,185,129,0.3)]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-200 uppercase tracking-wider mb-1 font-orbitron">Passive Emission (LP Sync)</p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium font-medium">
                Every deposit triggers a corresponding mint for the <span className="font-bold text-slate-300">Liquidity Pool</span>. 
                An <span className="text-emerald-400 font-bold">extra 10%</span> is minted directly to the Reward Pool.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 h-fit text-amber-500">
              <Zap className="w-4.5 h-4.5 filter drop-shadow-[0_0_3px_rgba(245,158,11,0.3)]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-200 uppercase tracking-wider mb-1 font-orbitron">Active Burn</p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                When active minting is triggered, protocol supply is bought and <span className="font-bold text-slate-300">incinerated</span>, increasing scarcity.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 h-fit text-emerald-400">
              <Coins className="w-4.5 h-4.5 filter drop-shadow-[0_0_3px_rgba(16,185,129,0.3)]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-200 uppercase tracking-wider mb-1 font-orbitron">Trigger Bounty</p>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Anyone who successfully triggers the active minting phase receives a bounty of <span className="text-amber-500 font-bold">1 KDIA</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SECURITY & TRUST */}
      <div className="cyber-panel p-6.5">
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-emerald-400 w-8 h-8 flex-shrink-0 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]" />
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400 font-orbitron">
              Governance Structure
            </p>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              KardiaToken $KDIA is a fair-launch protocol. 100K initial minting for project development (KD-max project) and treasury (K-Treasury). No venture capital. The 99.09% supply 
              is distributed linearly through the Mining Hub to all community based on their respective Power Units.
            </p>
          </div>
        </div>
      </div>

      {/* 5. K-TREASURY INTRO */}
      <div className="rounded-2xl border border-emerald-500/10 bg-[#0c1222]/40 p-6.5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500/15 border-b border-l border-emerald-500/20 text-emerald-400 text-[8px] font-black px-3.5 py-1.5 rounded-bl-xl shadow-lg z-10 uppercase tracking-[0.2em] font-mono">
          Coming Soon
        </div>
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-amber-500 w-8 h-8 flex-shrink-0 animate-pulse filter drop-shadow-[0_0_4px_rgba(245,158,11,0.3)]" />
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400 font-orbitron">
              Autonomous K-Treasury Reserves
            </p>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              The KardiaToken Treasury is an autonomous, self-sustaining protocol designed to transition the token from a standard asset to a BTCB-backed reserve store. It transforms transaction volume into tangible value through a three-tier automated system:
            </p>
      
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5 filter drop-shadow-[0_0_3px_rgba(16,185,129,0.3)]" />
                <p>
                  <strong className="font-bold text-slate-300">Automated BTCB Accumulation:</strong> Every transaction triggers our smart contract engine to acquire BTCB. 90% of this BTCB is paired with KDIA to deepen liquidity, while 10% is permanently locked in the Treasury vault. This constant inflow of "hard" assets ensures that the underlying backing of every KDIA token grows with every trade.
                </p>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5 filter drop-shadow-[0_0_3px_rgba(16,185,129,0.3)]" />
                <p>
                  <strong className="font-bold text-slate-300">Dynamic Floor Price:</strong> The Treasury continuously monitors a real-time floorPrice—the ratio of our total BTCB reserves to the circulating supply. This provides a transparent, mathematical guarantee of value, creating a "Bitcoin-Vacuum" effect that prevents long-term devaluation.
                </p>
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0 mt-0.5 filter drop-shadow-[0_0_3px_rgba(16,185,129,0.3)]" />
                <p>
                  <strong className="font-bold text-slate-300">Deflationary Redemption:</strong> Our initiateBurn mechanism protects holders by allowing them to redeem KDIA directly for BTCB if the market price deviates significantly from the floor. By burning the redeemed KDIA, we permanently reduce the circulating supply, mathematically increasing the intrinsic value of every remaining token.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
            
    </div>
  );
}
