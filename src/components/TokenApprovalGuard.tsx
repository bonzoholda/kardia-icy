import React, { useEffect } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { parseUnits, maxUint256 } from 'viem';
import { ShieldAlert, KeyRound, CheckCircle } from 'lucide-react';

const MOCK_USDT_ABI = [
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
] as const;

interface Props {
  children: React.ReactNode;
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  amountRequired: string;
}

export const TokenApprovalGuard: React.FC<Props> = ({ children, tokenAddress, spenderAddress, amountRequired }) => {
  const { address } = useAccount();
  const requiredWei = parseUnits(amountRequired, 18);

  const { data: allowance, refetch } = useReadContract({
    address: tokenAddress,
    abi: MOCK_USDT_ABI,
    functionName: 'allowance',
    args: address ? [address, spenderAddress] : undefined,
    query: { enabled: !!address }
  } as any);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  const handleApprove = () => {
    writeContract({
      address: tokenAddress,
      abi: MOCK_USDT_ABI,
      functionName: 'approve',
      args: [spenderAddress, maxUint256], 
      gas: 70000n,
    } as any);
  };

  const handleReset = () => {
    writeContract({
      address: tokenAddress,
      abi: MOCK_USDT_ABI,
      functionName: 'approve',
      args: [spenderAddress, 0n],
      gas: 50000n,
    } as any);
  };

  if (!address) return <>{children}</>;

  if (allowance !== undefined && (allowance as bigint) < requiredWei) {
    return (
      <div className="rounded-2xl bg-slate-900/80 border border-amber-500/30 p-6 text-center space-y-4 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.05)] max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
            <ShieldAlert className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        
        <div>
          <h3 className="text-amber-400 font-bold tracking-wider text-sm font-['Orbitron'] uppercase">Security Permission</h3>
          <p className="text-xs text-slate-400 leading-relaxed mt-2">
            MiningHub requires permission to securely approve transactions from your wallet. 
            <br />
            <span className="text-slate-500 text-[10px]">Setting "Unlimited" avoids paying gas for approvals in future sessions.</span>
          </p>
        </div>
        
        <div className="flex flex-col gap-2 pt-2">
           {(allowance as bigint) > 0n && (
             <button 
               onClick={handleReset}
               disabled={isPending || isConfirming}
               className="w-full py-3 px-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold tracking-wider hover:bg-rose-500/20 hover:border-rose-500/30 transition-all cursor-pointer"
             >
               {isPending || isConfirming ? "Processing..." : "Reset Approved Limit"}
             </button>
           )}
           
           <button 
             onClick={handleApprove}
             disabled={isPending || isConfirming}
             className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl hover:from-emerald-400 hover:to-teal-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 text-xs tracking-wider cursor-pointer flex items-center justify-center gap-2"
           >
             <KeyRound className="w-4 h-4" />
             {isPending || isConfirming ? "Check Wallet Popup..." : "Enable Unlimited Spending"}
           </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
