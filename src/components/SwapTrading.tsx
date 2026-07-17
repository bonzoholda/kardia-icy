import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { ExternalLink, TrendingUp, RefreshCw } from "lucide-react";

const ROUTER_ADDRESS = import.meta.env.VITE_ROUTER_ADDRESS as `0x${string}`;
const USDT_ADDRESS = import.meta.env.VITE_USDT_ADDRESS as `0x${string}`;
const KDIA_ADDRESS = import.meta.env.VITE_KDIA_ADDRESS as `0x${string}`;
const WBTC_ADDRESS = import.meta.env.VITE_WBTC_ADDRESS as `0x${string}`;
const CONTROLLER_ADDRESS = import.meta.env.VITE_CONTROLLER_ADDRESS as `0x${string}`;
const KDIA_BTCB_PAIR = "0xD11c2c4881a69f9943D85d6317432Eb8Ec8aaAa2";

const PAIR_ABI = [
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      { name: "_reserve0", type: "uint112" },
      { name: "_reserve1", type: "uint112" },
      { name: "_blockTimestampLast", type: "uint32" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const CONTROLLER_ABI = [
  {
    inputs: [],
    name: "_getKdiaPriceInUsdt",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  }
] as const;

const ROUTER_ABI = [
  {
    inputs: [{ name: "amountIn", type: "uint256" }, { name: "path", type: "address[]" }],
    name: "getAmountsOut",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function SwapTrading() {
  const { data: controllerPrice, refetch: refetchPrice } = useReadContract({
    address: CONTROLLER_ADDRESS,
    abi: CONTROLLER_ABI,
    functionName: "_getKdiaPriceInUsdt",
  });

  const { data: reserves } = useReadContract({
    address: KDIA_BTCB_PAIR,
    abi: PAIR_ABI,
    functionName: "getReserves",
  });

  const { data: btcToUsdtData } = useReadContract({
    address: ROUTER_ADDRESS,
    abi: ROUTER_ABI,
    functionName: "getAmountsOut",
    args: [BigInt(10 ** 18), [WBTC_ADDRESS, USDT_ADDRESS]],
  });

  const kdiaPriceUSDT = useMemo(() => {
    if (controllerPrice && controllerPrice > 0n) return Number(formatUnits(controllerPrice, 18)).toFixed(4);
    if (!reserves || !btcToUsdtData) return "0.0000";
    try {
      const reserveBTCB = reserves[0];
      const reserveKDIA = reserves[1];
      const btcPriceInUsdt = btcToUsdtData[1];
      if (reserveKDIA === 0n) return "0.0000";
      const priceScaled = (reserveBTCB * btcPriceInUsdt) / reserveKDIA;
      return Number(formatUnits(priceScaled, 18)).toFixed(4);
    } catch (e) { return "0.0000"; }
  }, [reserves, btcToUsdtData, controllerPrice]);

  const pancakeSwapLink = `https://pancakeswap.finance/swap?inputCurrency=${USDT_ADDRESS}&outputCurrency=${KDIA_ADDRESS}&chainId=56`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-[#0c1222]/40 p-5.5 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] space-y-6 animate-in fade-in duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-slate-800/60 pb-4">
        <div>
          <h2 className="text-xs font-black tracking-[0.3em] text-emerald-400 font-orbitron uppercase">ORACLE MARKET FEED</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <p className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest font-mono">FEEDING RAW DATA...</p>
          </div>
        </div>
        <button 
          onClick={() => refetchPrice()} 
          className="p-2.5 rounded-xl bg-[#04060c]/60 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 transition-all duration-300 active:scale-95 cursor-pointer text-xs flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* PRICE DISPLAY */}
      <div className="rounded-xl border border-slate-800 bg-[#04060c]/40 p-6 text-center relative group">
        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 font-orbitron mb-2">
          KDIA / USDT INDEX
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tight filter drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
            ${kdiaPriceUSDT}
          </span>
        </div>
      </div>

      {/* INFO FOOTER */}
      <div className="bg-[#04060c]/60 rounded-xl p-4.5 border border-slate-800/50 text-center">
        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
          Virtual trading pools are routed directly through the official <span className="text-emerald-400 font-bold">PancakeSwap LP</span> smart contracts to maximize liquidity and secure minimal slippage rates on BSC.
        </p>
      </div>

      {/* EXTERNAL TRADE LINK */}
      <div className="pt-2">
        <a 
          href={pancakeSwapLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-300 uppercase cursor-pointer font-orbitron"
        >
          TRADE ON PANCAKESWAP
          <ExternalLink size={14} className="filter drop-shadow-[0_0_3px_rgba(0,0,0,0.5)]" />
        </a>
      </div>
    </div>
  );
}
