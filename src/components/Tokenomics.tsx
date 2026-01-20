import { useState } from "react";
import { FileText, Flame, Coins, ShieldCheck, Zap, Copy, Check } from "lucide-react";

export default function Tokenomics() {
  const [copied, setCopied] = useState(false);
  const CONTRACT_ADDRESS = "0xf8D4E7A6c6Db5aB8013c1FcB190cCBC140F44Ac5"; // Replace with actual address

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. KEY METRICS GRID */}
      <div className="grid grid-cols-2 gap-4">
        <div className="panel p-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-800/70 mb-1 font-['Orbitron']">
            Max Supply
          </p>
          <p className="text-2xl font-bold text-slate-900 font-['Inter']">11,000,000</p>
          <p className="text-[9px] font-black text-slate-800/40 uppercase tracking-widest mt-1">KDIA</p>
        </div>
        
        <div className="panel p-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-800/70 mb-1 font-['Orbitron']">
            Protocol Type
          </p>
          <p className="text-lg font-bold text-slate-900 font-['Inter'] mt-1">Deflationary</p>
          <p className="text-[9px] font-black text-slate-800/40 uppercase tracking-widest mt-1">Community Driven</p>
        </div>
      </div>

      {/* 2. CONTRACT ADDRESS BOX */}
      <div className="panel p-4 bg-white/40 border-white/60 backdrop-blur-sm">
        <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-800/60 mb-3 font-['Orbitron'] text-center">
          KDIA Contract Address
        </p>
        <div className="flex items-center justify-between bg-white/50 rounded-lg p-3 border border-sky-900/10">
          <code className="text-[11px] font-mono text-slate-900 break-all">
            {`${CONTRACT_ADDRESS.slice(0, 10)}...${CONTRACT_ADDRESS.slice(-8)}`}
          </code>
          <button 
            onClick={copyToClipboard}
            className="ml-3 p-2 rounded-md hover:bg-sky-100 transition-colors active:scale-90"
            title="Copy to clipboard"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-sky-900" />}
          </button>
        </div>
        {copied && (
          <p className="text-[9px] text-green-600 font-bold mt-2 text-center animate-pulse uppercase tracking-widest">
            Copied to Clipboard
          </p>
        )}
      </div>

      {/* 3. EMISSION FRAMEWORK */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-sky-900/10 pb-4">
          <Flame className="text-[#f7931a] w-6 h-6" />
          <h3 className="text-sm font-bold tracking-[0.2em] text-sky-900 font-['Orbitron'] uppercase">
            Emission Framework
          </h3>
        </div>

        <div className="space-y-5">
          <div className="flex gap-4">
            <div className="bg-blue-100 p-3 rounded-xl h-fit">
               <ShieldCheck className="text-sky-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-950 uppercase tracking-wider mb-1">Passive Emission (LP Sync)</p>
              <p className="text-[11px] text-sky-900/70 leading-relaxed font-medium">
                Every deposit triggers a corresponding mint for the <span className="font-bold text-sky-900">Liquidity Pool</span>. 
                An <span className="text-orange-600 font-bold">extra 10%</span> is minted to the Reward Pool.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-orange-100 p-3 rounded-xl h-fit">
              <Zap className="text-[#f7931a] w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-950 uppercase tracking-wider mb-1">Active Burn</p>
              <p className="text-[11px] text-sky-900/70 leading-relaxed font-medium">
                When active minting is triggered, protocol supply is bought and <span className="font-bold">incinerated</span>, increasing scarcity.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-sky-100 p-3 rounded-xl h-fit">
              <Coins className="text-sky-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-950 uppercase tracking-wider mb-1">Trigger Bounty</p>
              <p className="text-[11px] text-sky-900/70 leading-relaxed font-medium">
                Anyone who successfully triggers the active minting phase receives a bounty of <span className="text-[#f7931a] font-bold">1 KDIA</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECURITY & TRUST */}
      <div className="panel p-6 border-white/20">
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-slate-900 w-8 h-8" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-800/70 mb-1 font-['Orbitron']">
              Governance
            </p>
            <p className="text-xs text-slate-900 font-medium leading-relaxed">
              Kardia is a fair-launch protocol. 100K initial minting for project development and community (to be released after total minted supply reaches 1M). No venture capital. The 99.09% supply 
              is distributed linearly through the Mining Hub to all community holders.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
