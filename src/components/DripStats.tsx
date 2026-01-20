import { useReadContract } from "wagmi";
import { SPHYGMOS_CONTROLLER_ABI } from "../abi/SphygmosController";
import { fmt } from "../utils/format";

const CONTROLLER_ADDRESS = import.meta.env.VITE_CONTROLLER_ADDRESS as `0x${string}` | undefined;

export default function DripStats() {
  /* ───── Read Drip Rate ───── */
  const { data: dripRatePerSecond } = useReadContract({
    address: CONTROLLER_ADDRESS,
    abi: SPHYGMOS_CONTROLLER_ABI,
    functionName: "dripRatePerSecond",
    query: {
      enabled: !!CONTROLLER_ADDRESS,
      refetchInterval: 10000, // Refresh every 10s for drip accuracy
    },
  });

  if (!CONTROLLER_ADDRESS) return null;

  /* ───── Derived Values ───── */
  const dripPerDay =
    dripRatePerSecond && dripRatePerSecond > 0n
      ? dripRatePerSecond * 86400n
      : 0n;

  return (
    <div className="glass-card p-6 space-y-4 relative overflow-hidden">
      {/* Background Accent: Changed from red to Bitcoin Orange glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#f7931a]/10 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />

      <div className="flex items-center gap-2 mb-2">
        {/* White shadow on indicator for better visibility on light bg */}
        <div className="live-indicator !bg-white !shadow-[0_0_8px_white]"></div>
        <h3 className="text-sm font-bold tracking-[0.2em] text-sky-900 font-['Orbitron'] uppercase">
          Emission Protocol
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Panel: Now uses the orange-glass class from index.css */}
        <div className="panel border-white/20">
          <p className="panel-title text-white/80">KDIA Drip / 24H</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-white font-['Inter']">
              {dripPerDay > 0n ? fmt(dripPerDay, 18, 4) : "SYNCING..."}
            </p>
            <span className="text-xs font-black text-white/50 font-['Orbitron']">KDIA</span>
          </div>
        </div>
      </div>

      {/* ───── Explanation Panel: Frosted glass instead of heavy black ───── */}
      <div className="p-4 rounded-xl bg-white/30 border border-white/40 backdrop-blur-sm">
        <p className="text-[11px] text-sky-950 leading-relaxed font-medium">
          The <span className="text-[#f7931a] font-bold">Reward Pool</span> releases KDIA linearly into the Miners Pool. 
          Rewards are claimable via the <span className="font-bold">Mining System</span> and allocated 
          proportionally based on your current <span className="font-bold">Power Unit (PU)</span> share.
        </p>
      </div>

      {/* Mini Secondary Stat */}
      <div className="flex justify-between items-center px-1">
        <span className="text-[9px] uppercase tracking-widest text-sky-800/60 font-bold">Network Velocity</span>
        <span className="text-[10px] font-mono text-[#f7931a] font-bold italic">
          {dripRatePerSecond ? fmt(dripRatePerSecond, 18, 8) : "0.00"} /sec
        </span>
      </div>
    </div>
  );
}
