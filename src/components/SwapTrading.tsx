import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { ExternalLink, TrendingUp } from "lucide-react";

// Constants from environment
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
  // 1. PRICE FETCHING LOGIC
  const { data: controllerPrice } = useReadContract({
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
    <div className="glass-card p-6 space-y-6 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-sky-900/10 pb-4">
        <div>
          {/* FONT COLOR: Dark Blue */}
          <h2 className="text-xl font-bold tracking-tighter text-sky-900 font-['Orbitron'] uppercase">Market Data</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f7931a]"></span>
            </span>
            {/* FONT COLOR: Bitcoin Orange */}
            <p className="text-[10px] font-bold text-[#f7931a] uppercase tracking-widest">Live Oracle Price</p>
          </div>
        </div>
        <TrendingUp className="text-sky-900/20 w-8 h-8" />
      </div>

      {/* PRICE DISPLAY */}
      <div className="panel py-8 bg-gradient-to-br from-white/[0.4] to-transparent border-white/60">
        <p className="text-center text-[10px] uppercase tracking-[0.3em] font-bold text-sky-900/60 mb-2">
          KDIA / USDT
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl md:text-5xl font-black text-sky-950 font-['Inter'] tracking-tighter">
            ${kdiaPriceUSDT}
          </span>
        </div>
      </div>

      {/* INFO FOOTER */}
      <div className="bg-sky-900/5 rounded-xl p-4 border border-sky-900/10">
        {/* FONT COLOR: Dark Blue */}
        <p className="text-[11px] text-sky-900/80 leading-relaxed text-center font-medium">
          Swap functionality is handled via the official PancakeSwap Liquidity Pool to ensure 
          the best price execution and lowest slippage.
        </p>
      </div>

      {/* EXTERNAL TRADE LINK */}
      <div className="pt-2">
        <a 
          href={pancakeSwapLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-white text-black hover:bg-gray-100 transition-all font-bold text-[12px] tracking-[0.1em] shadow-lg active:scale-[0.98] border border-white/60"
        >
          TRADE ON PANCAKESWAP
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
