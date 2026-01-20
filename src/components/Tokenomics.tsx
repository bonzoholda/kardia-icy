import { FileText, Flame, Coins, ShieldCheck, Zap } from "lucide-react";
import HeartPaper from "../assets/Kardia.pdf?url";

export default function Tokenomics() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. KEY METRICS GRID */}
      <div className="grid grid-cols-2 gap-4">
        <div className="panel p-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-800/70 mb-1 font-['Orbitron']">
            Max Supply
          </p>
          <p className="text-2xl font-bold text-slate-900 font-['Inter']">11 M</p>
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

      {/* 2. EMISSION FRAMEWORK */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-sky-900/10 pb-4">
          <Flame className="text-[#f7931a] w-6 h-6" />
          <h3 className="text-sm font-bold tracking-[0.2em] text-sky-900 font-['Orbitron'] uppercase">
            Emission Framework
          </h3>
        </div>

        <div className="space-y-5">
          {/* PASSIVE EMISSION */}
          <div className="flex gap-4">
            <div className="bg-blue-100 p-3 rounded-xl h-fit">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-sky-950 uppercase tracking-wider mb-1">Passive Emission (LP Sync)</p>
              <p className="text-[11px] text-sky-900/70 leading-relaxed font-medium">
                Every deposit triggers a corresponding mint for the <span className="font-bold text-sky-900">Liquidity Pool</span>. 
                Additionally, an <span className="text-orange-600 font-bold">extra 10%</span> is minted directly to the Reward Pool to sustain the ecosystem.
              </p>
            </div>
          </div>

          {/* ACTIVE BURN */}
          <div className="flex gap-4">
            <div className="bg-orange-100 p-3 rounded-xl h-fit">
              <Zap className="text-[#f7931a] w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-950 uppercase tracking-wider mb-1">Active Burn</p>
              <p className="text-[11px] text-sky-900/70 leading-relaxed font-medium">
                Whenever active minting is triggered by a user, a portion of the protocol supply is bought from market and permanently 
                incinerated, increasing scarcity as the ecosystem grows.
              </p>
            </div>
          </div>

          {/* TRIGGER BOUNTY */}
          <div className="flex gap-4">
            <div className="bg-sky-100 p-3 rounded-xl h-fit">
              <Coins className="text-sky-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-sky-950 uppercase tracking-wider mb-1">Trigger Bounty</p>
              <p className="text-[11px] text-sky-900/70 leading-relaxed font-medium">
                Protocol guardians are rewarded for their service. Anyone who successfully triggers the 
                active minting phase receives a bounty of <span className="text-[#f7931a] font-bold">1 KDIA</span>.
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
              Kardia is a fair-launch protocol. 100K initial minting for project development and community reward (to be released when total minted token hits first 1M), no venture capital. The 11M supply 
              is distributed linearly through the Mining Hub to all PU holders.
            </p>
          </div>
        </div>
      </div>

      {/* 4. DOCUMENTATION LINK */}
      <div className="flex justify-center pt-4">
        <a 
          href={HeartPaper} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-sky-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-sky-950 transition-all shadow-lg active:scale-95"
        >
          <FileText size={14} />
          Download Kardia HeartPaper
        </a>
      </div>

    </div>
  );
}
