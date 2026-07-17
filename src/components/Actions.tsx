import { parseUnits, formatUnits } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useConnectorClient } from "wagmi";
import { useController } from "../hooks/useController";
import { SPHYGMOS_CONTROLLER_ABI } from "../abi/SphygmosController";
import ERC20_ABI from "../abi/ERC20";
import { useState, useEffect, useMemo } from "react";
import { TxStatus } from "./TxStatus";
import { BrowserProvider, Contract } from "ethers";
import { ShieldCheck, HardHat, Sparkles, HelpCircle, Flame, ArrowUpRight } from "lucide-react";

const controller = (import.meta.env.VITE_CONTROLLER_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
const USDT_ADDRESS = (import.meta.env.VITE_USDT_ADDRESS || "0x...") as `0x${string}`;
const KDIA_ADDRESS = (import.meta.env.VITE_KDIA_ADDRESS || "0x...") as `0x${string}`;

const ERC20_ETHERS_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)"
];

export function Actions() {
  const { address } = useAccount();
  const { data: connectorClient } = useConnectorClient() as any;
  const { stakeSMOS, claimMiner, refetchAll } = useController();

  const [puAmount, setPuAmount] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [puTx, setPuTx] = useState<`0x${string}`>();
  const [stakeTx, setStakeTx] = useState<`0x${string}`>();
  const [claimTx, setClaimTx] = useState<`0x${string}`>();
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const { data: usdtBalanceRaw, refetch: refetchUsdt } = useReadContract({
    address: USDT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  } as any);

  const { data: kdiaBalanceRaw, refetch: refetchKdia } = useReadContract({
    address: KDIA_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  } as any);

  const usdtFormatted = useMemo(() => {
    if (usdtBalanceRaw === undefined) return "0.00";
    return Number(formatUnits(usdtBalanceRaw as bigint, 18)).toLocaleString('en-US', { minimumFractionDigits: 2 });
  }, [usdtBalanceRaw]);

  const kdiaFormatted = useMemo(() => {
    if (kdiaBalanceRaw === undefined) return "0.00";
    return Number(formatUnits(kdiaBalanceRaw as bigint, 18)).toLocaleString('en-US', { minimumFractionDigits: 2 });
  }, [kdiaBalanceRaw]);

  const ethersSigner = useMemo(() => {
    if (!connectorClient) return undefined;
    return new BrowserProvider(connectorClient.transport).getSigner();
  }, [connectorClient]);

  const puWait = useWaitForTransactionReceipt({ hash: puTx });
  const stakeWait = useWaitForTransactionReceipt({ hash: stakeTx });
  const claimWait = useWaitForTransactionReceipt({ hash: claimTx });

  useEffect(() => {
    if (puWait.isSuccess || stakeWait.isSuccess || claimWait.isSuccess) {
      refetchAll(); refetchUsdt(); refetchKdia();
      if (puWait.isSuccess) { setPuAmount(""); setPuTx(undefined); setStatusMsg(""); setIsBroadcasting(false); }
      if (stakeWait.isSuccess) { setStakeAmount(""); setStakeTx(undefined); }
      if (claimWait.isSuccess) { setClaimTx(undefined); }
    }
  }, [puWait.isSuccess, stakeWait.isSuccess, claimWait.isSuccess, refetchAll, refetchUsdt, refetchKdia]);

  const handleAcquirePU = async () => {
    if (!ethersSigner || !puAmount) return;
    setIsBroadcasting(true);
    setStatusMsg("AUTHORIZING...");
    try {
      const signer = await ethersSigner;
      const userAddress = await signer.getAddress();
      const amount = parseUnits(puAmount, 18);
      const usdt = new Contract(USDT_ADDRESS, ERC20_ETHERS_ABI, signer);
      const kardia = new Contract(controller, SPHYGMOS_CONTROLLER_ABI, signer);

      const currentAllowance = await usdt.allowance(userAddress, controller);
      if (BigInt(currentAllowance) < BigInt(amount)) {
        const txApprove = await usdt.approve(controller, amount);
        await txApprove.wait();
      }

      setStatusMsg("DEPOSITING...");
      const txDeposit = await kardia.depositPush(amount);
      setPuTx(txDeposit.hash as `0x${string}`);
      setStatusMsg("PROCESSING...");
    } catch (e) {
      setIsBroadcasting(false);
      setStatusMsg("");
    }
  };

  const handleStake = async () => {
    if (!stakeAmount) return;
    try {
      const hash = await stakeSMOS.writeContractAsync({
        address: controller, abi: SPHYGMOS_CONTROLLER_ABI, functionName: "stake",
        args: [parseUnits(stakeAmount, 18)],
      } as any);
      setStakeTx(hash);
    } catch (e) { console.error(e); }
  };

  const handleClaim = async () => {
    try {
      const hash = await claimMiner.writeContractAsync({ 
        address: controller, 
        abi: SPHYGMOS_CONTROLLER_ABI, 
        functionName: "claimMinerRewards" 
       } as any);
      if (hash) setClaimTx(hash);
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  // PREMIUM SOLID GLOW BUTTON CLASS
  const premiumBtn = "relative overflow-hidden w-full h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 font-black text-xs tracking-widest transition-all duration-300 active:scale-95 shadow-[0_4px_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] uppercase disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer flex items-center justify-center gap-2 font-orbitron";

  if (!address) return (
    <div className="rounded-2xl border border-emerald-500/10 bg-[#0c1222]/30 p-10 text-center font-black text-slate-500 uppercase text-xs tracking-[0.2em] font-orbitron backdrop-blur-md">
      Connect Wallet to Initialize Mining Module
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. ACQUIRE POWER */}
      <div className="rounded-2xl border border-emerald-500/10 bg-[#0c1222]/40 p-5.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
            </span>
            <h4 className="text-[11px] font-black tracking-widest uppercase font-orbitron text-emerald-400">Acquire Power</h4>
          </div>
          <div className="text-right">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">USDT Balance</span>
            <span className="text-xs font-mono text-white font-bold">
              {usdtFormatted}
            </span>
          </div>
        </div>
        
        <div className="relative w-full">
          <input 
            id="usdt-input-field"
            className="w-full h-14 bg-[#04060c]/60 border border-slate-800 rounded-xl px-4 text-white placeholder:text-slate-800 outline-none focus:border-emerald-500/30 transition-all font-mono text-lg font-bold" 
            type="number" 
            placeholder="0.00" 
            value={puAmount} 
            onChange={(e) => setPuAmount(e.target.value)} 
          />
          <div className="absolute right-4 top-4 text-xs font-black text-slate-500 font-orbitron uppercase">USDT</div>
        </div>

        <button id="acquire-pu-btn" className={premiumBtn} disabled={!puAmount || isBroadcasting} onClick={handleAcquirePU}>
          {statusMsg || "Acquire Power Units"}
        </button>
        <TxStatus hash={puTx} />
      </div>

      {/* 2. STAKE KDIA */}
      <div className="rounded-2xl border border-emerald-500/10 bg-[#0c1222]/40 p-5.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
              <HardHat className="w-4 h-4 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
            </span>
            <h4 className="text-[11px] font-black tracking-widest uppercase font-orbitron text-emerald-400">Stake $KDIA</h4>
          </div>
          <div className="text-right">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest block">Available KDIA</span>
            <span className="text-xs font-mono text-white font-bold">
              {kdiaFormatted}
            </span>
          </div>
        </div>

        <div className="relative w-full">
          <input 
            id="kdia-input-field"
            className="w-full h-14 bg-[#04060c]/60 border border-slate-800 rounded-xl px-4 text-white placeholder:text-slate-800 outline-none focus:border-emerald-500/30 transition-all font-mono text-lg font-bold" 
            type="number" 
            placeholder="0.00" 
            value={stakeAmount} 
            onChange={(e) => setStakeAmount(e.target.value)} 
          />
          <div className="absolute right-4 top-4 text-xs font-black text-slate-500 font-orbitron uppercase">KDIA</div>
        </div>

        <button id="stake-kdia-btn" className={premiumBtn} disabled={!stakeAmount || stakeSMOS.isPending} onClick={handleStake}>
          {stakeSMOS.isPending ? "STAKING..." : "Stake KDIA"}
        </button>
        <TxStatus hash={stakeTx} />
      </div>

      {/* 3. HARVEST REWARDS */}
      <div className="space-y-3.5">
        <button 
          id="harvest-btn"
          className={premiumBtn}
          disabled={claimMiner.isPending} 
          onClick={handleClaim}
        >
          {claimMiner.isPending ? "SYNCHRONIZING..." : "HARVEST MINING REWARDS"}
        </button>
        <TxStatus hash={claimTx} />
        <p className="text-[8px] text-center text-slate-500 font-black uppercase tracking-[0.25em] mt-1 font-mono">
          * Harvesting does not affect your 7-day stake lock duration.
        </p>
      </div>
      
    </div>
  );
}
