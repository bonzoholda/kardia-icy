import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { parseUnits, formatUnits } from "viem";
import { fmt } from "../utils/format";
import { SPHYGMOS_CONTROLLER_ABI } from "../abi/SphygmosController";
import { useController } from "../hooks/useController";
import { TxStatus } from "./TxStatus";
import { Flame, ShieldCheck, HelpCircle, Lock, Coins, TrendingUp } from "lucide-react";

const CONTROLLER_ADDRESS = import.meta.env.VITE_CONTROLLER_ADDRESS as `0x${string}`;

function formatLockTime(unlockTs: bigint) {
  if (!unlockTs || unlockTs === 0n) return { status: "NO ACTIVE STAKE", locked: false, ready: false };
  const now = Math.floor(Date.now() / 1000);
  const diff = Number(unlockTs) - now;
  if (diff <= 0) return { status: "UNLOCKED & READY", locked: false, ready: true };
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return {
    status: `LOCKED ${days}D:${hours}H:${minutes}M`,
    locked: true,
    ready: false,
  };
}

export default function Stats() {
  const { address } = useAccount();
  const { refetchAll } = useController();
  
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [unstakeTx, setUnstakeTx] = useState<`0x${string}`>();
  
  const { writeContractAsync: unstakeSMOS, isPending: isUnstaking, error: writeError } = useWriteContract();
  const safeAddress = address ?? "0x0000000000000000000000000000000000000000";

  const { data, refetch } = useReadContracts({
    contracts: [
      { address: CONTROLLER_ADDRESS, abi: SPHYGMOS_CONTROLLER_ABI, functionName: "userPU", args: [safeAddress] },
      { address: CONTROLLER_ADDRESS, abi: SPHYGMOS_CONTROLLER_ABI, functionName: "stakedKDIA", args: [safeAddress] },
      { address: CONTROLLER_ADDRESS, abi: SPHYGMOS_CONTROLLER_ABI, functionName: "unlockTime", args: [safeAddress] },
      { address: CONTROLLER_ADDRESS, abi: SPHYGMOS_CONTROLLER_ABI, functionName: "accRewardPerPU" },
      { address: CONTROLLER_ADDRESS, abi: SPHYGMOS_CONTROLLER_ABI, functionName: "rewardDebt", args: [safeAddress] },
    ],
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  const [uPU, uStaked, uUnlock, gAcc, uDebt] = useMemo(() => [
    data?.[0]?.result as bigint | undefined,
    data?.[1]?.result as bigint | undefined,
    data?.[2]?.result as bigint | undefined,
    data?.[3]?.result as bigint | undefined,
    data?.[4]?.result as bigint | undefined,
  ], [data]);

  const unstakeWait = useWaitForTransactionReceipt({ hash: unstakeTx });

  useEffect(() => {
    if (unstakeWait.isSuccess) {
      refetchAll(); refetch();
      setUnstakeTx(undefined); setUnstakeAmount(""); 
    }
  }, [unstakeWait.isSuccess, refetchAll, refetch]);

  const lockInfo = useMemo(() => formatLockTime(uUnlock ?? 0n), [uUnlock]);
  const hasStake = uStaked !== undefined && uStaked > 0n;

  const handleMax = () => {
    if (uStaked) setUnstakeAmount(formatUnits(uStaked, 18));
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || !uStaked) return;
    let finalAmountBigInt = parseUnits(unstakeAmount, 18);
    if (finalAmountBigInt > uStaked) {
      finalAmountBigInt = uStaked;
      setUnstakeAmount(formatUnits(uStaked, 18));
    }

    try {
      const hash = await unstakeSMOS({
        address: CONTROLLER_ADDRESS,
        abi: SPHYGMOS_CONTROLLER_ABI,
        functionName: "unstakeKDIA",
        args: [finalAmountBigInt],
      } as any);
      setUnstakeTx(hash);
    } catch (err: any) { console.error(err); }
  };

  return (
    <div className="space-y-5">
      {/* Power & Staked Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="cyber-panel p-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-8 bg-emerald-500/50" />
          <p className="text-[9px] uppercase tracking-[0.2em] font-black text-emerald-400 font-orbitron">Active Power Units</p>
          <p className="text-2xl font-black text-white mt-1.5 font-mono tracking-tight group-hover:text-emerald-400 transition-colors">
            {fmt(uPU)}
          </p>
          <span className="text-[8px] font-bold text-slate-500 block uppercase mt-1 font-mono">[SYS.PU_CORE]</span>
        </div>
        <div className="cyber-panel p-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-8 bg-emerald-500/50" />
          <p className="text-[9px] uppercase tracking-[0.2em] font-black text-emerald-400 font-orbitron">Staked Balance</p>
          <p className="text-2xl font-black text-white mt-1.5 font-mono tracking-tight group-hover:text-emerald-400 transition-colors flex items-baseline gap-1">
            {fmt(uStaked)} <span className="text-[10px] text-slate-500 font-orbitron">KDIA</span>
          </p>
          <span className="text-[8px] font-bold text-slate-500 block uppercase mt-1 font-mono">[STK.ACTIVE]</span>
        </div>
      </div>

      {/* Accumulated Rewards Card */}
      <div className="cyber-panel p-5.5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[9px] uppercase tracking-[0.25em] font-black text-emerald-400 font-orbitron">Accumulated Rewards</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-3.5xl font-black text-white font-mono tracking-tight filter drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                {fmt(((uPU ?? 0n) * (gAcc ?? 0n) / BigInt(1e18)) - (uDebt ?? 0n), 18, 8)}
              </p>
              <span className="text-[10px] text-emerald-400/80 font-black tracking-widest uppercase font-orbitron">KDIA</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse">
            <Coins className="w-5 h-5 filter drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
      </div>

      {/* Unstake Vault Security Logic */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-[#0c1222]/40 p-5.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-5">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800/50">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 font-orbitron">Vault Security Status</p>
            <p className={`text-xs font-black mt-1 font-orbitron tracking-widest ${lockInfo.locked ? "text-amber-500 filter drop-shadow-[0_0_4px_rgba(245,158,11,0.3)]" : "text-emerald-400 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]"}`}>
              {hasStake ? lockInfo.status : "READY FOR STAKING"}
            </p>
          </div>
          {lockInfo.locked ? (
            <span className="text-[9px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-lg font-black tracking-widest uppercase flex items-center gap-1 font-orbitron">
              <Lock className="w-3 h-3" />
              7D COOLDOWN
            </span>
          ) : (
            hasStake && (
              <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg font-black tracking-widest uppercase flex items-center gap-1 font-orbitron">
                <ShieldCheck className="w-3 h-3" />
                UNLOCKED
              </span>
            )
          )}
        </div>

        {hasStake && lockInfo.ready && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-xl border border-slate-800 bg-[#04060c]/60 p-4.5 relative group transition-all focus-within:border-emerald-500/30">
              <p className="text-[9px] uppercase tracking-[0.25em] font-black text-emerald-400/80 font-orbitron mb-1.5">Amount to Withdraw</p>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full bg-transparent text-2xl font-bold font-mono outline-none text-white placeholder:text-slate-800"
                  placeholder="0.00"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                />
                <button
                  onClick={handleMax}
                  className="ml-2 px-3 py-1.5 text-[10px] font-black bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-all cursor-pointer font-orbitron tracking-widest"
                >
                  MAX
                </button>
              </div>
            </div>
            
            <button 
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black tracking-widest text-xs uppercase disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 font-orbitron"
              disabled={isUnstaking || !unstakeAmount || parseFloat(unstakeAmount) <= 0}
              onClick={handleUnstake}
            >
              {isUnstaking ? "INITIATING..." : "CONFIRM UNSTAKE"}
            </button>
          </div>
        )}

        {writeError && (
          <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
            <p className="text-rose-400 text-[10px] font-bold uppercase tracking-tight font-mono">
              ERR: {(writeError as any).shortMessage || "Action Restricted"}
            </p>
          </div>
        )}

        <TxStatus hash={unstakeTx} />
      </div>
    </div>
  );
}
