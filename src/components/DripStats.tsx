import { useReadContract } from "wagmi";
import { SPHYGMOS_CONTROLLER_ABI } from "../abi/SphygmosController";
import { fmt } from "../utils/format";
import { Zap, Activity } from "lucide-react";

const CONTROLLER_ADDRESS = import.meta.env.VITE_CONTROLLER_ADDRESS as `0x${string}` | undefined;

export default function DripStats() {
  const { data: dripRatePerSecond } = useReadContract({
    address: CONTROLLER_ADDRESS,
    abi: SPHYGMOS_CONTROLLER_ABI,
    query: {
      enabled: !!CONTROLLER_ADDRESS,
      refetchInterval: 10000,
    },
    functionName: "dripRatePerSecond",
  });

  if (!CONTROLLER_ADDRESS) return null;

  const dripPerDay =
    dripRatePerSecond && dripRatePerSecond > 0n
      ? dripRatePerSecond * 86400n
      : 0n;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-[#0c1222]/40 p-5.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      {/* Soft Green Glow Source */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />

      <div className="flex items-center justify-between gap-2 mb-4.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <h3 className="text-xs font-black tracking-[0.25em] text-emerald-400 font-orbitron uppercase">
            EMISSION PROTOCOL
          </h3>
        </div>
        <Activity className="w-4 h-4 text-emerald-500/60 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#04060c]/60 p-5 relative group transition-all">
          <p className="text-[9px] uppercase tracking-[0.2em] font-black text-emerald-400 font-orbitron mb-2">KDIA Drip / 24H</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white font-mono tracking-tight filter drop-shadow-[0_0_8px_rgba(52,211,153,0.35)]">
              {dripPerDay > 0n ? fmt(dripPerDay, 18, 4) : "SYNCING..."}
            </p>
            <span className="text-xs font-black text-slate-500 font-orbitron">KDIA</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#04060c]/40 border border-slate-800/50 backdrop-blur-sm mt-4.5">
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          The <span className="text-amber-500 font-bold">Reward Pool</span> releases KDIA linearly. 
          Rewards are claimable via the <span className="text-emerald-400 font-bold">Mining System</span> and allocated 
          proportionally based on your active <span className="text-emerald-400 font-bold">Power Unit (PU)</span> share.
        </p>
      </div>

      <div className="flex justify-between items-center px-1 mt-4.5 border-t border-slate-800/50 pt-3.5">
        <span className="text-[9px] uppercase tracking-widest text-slate-500 font-black font-orbitron">Network Velocity</span>
        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
          <Zap className="w-3 h-3 text-amber-500 animate-pulse" />
          {dripRatePerSecond ? fmt(dripRatePerSecond, 18, 8) : "0.00"} /sec
        </span>
      </div>
    </div>
  );
}
