import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <button
        id="connect-wallet-btn"
        onClick={() => disconnect()}
        className="relative group px-5 py-2.5 rounded-xl text-xs font-black font-mono tracking-widest border border-emerald-400/20 bg-[#0c1324]/80 text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/40 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] active:scale-95 cursor-pointer flex items-center gap-2"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="opacity-80 font-bold group-hover:opacity-100 transition-opacity">
          [{address?.slice(0, 6)}…{address?.slice(-4)}]
        </span>
      </button>
    );
  }

  return (
    <button
      id="connect-wallet-btn"
      onClick={() => connect({ connector: injected() })}
      className="px-6 py-3 rounded-xl text-xs font-black font-orbitron tracking-[0.15em] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] active:scale-95 cursor-pointer disabled:opacity-50 select-none"
      disabled={isPending}
    >
      {isPending ? "CONNECTING..." : "CONNECT WALLET"}
    </button>
  );
}
