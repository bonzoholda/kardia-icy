import { useWaitForTransactionReceipt } from "wagmi";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type Props = {
  hash?: `0x${string}`;
};

export function TxStatus({ hash }: Props) {
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash });

  if (!hash) return null;

  return (
    <div className="text-xs mt-3 p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 bg-slate-900/40 border-slate-800">
      {isLoading && (
        <div className="flex items-center gap-2 text-amber-400 font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          <span>Transaction pending on BSC Mainnet...</span>
        </div>
      )}

      {isSuccess && (
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Transaction successfully confirmed!</span>
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 text-rose-400 font-semibold">
          <XCircle className="w-4 h-4 text-rose-500" />
          <span>Transaction failed or reverted.</span>
        </div>
      )}
    </div>
  );
}
