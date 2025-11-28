import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

const successSound = new Audio("/sounds/success.mp3");
const errorSound = new Audio("/sounds/error.mp3");

const baseClasses =
  "flex items-center gap-4 px-5 py-4 rounded-2xl shadow-xl border transition-all duration-300";

const animationClasses = (t: any) =>
  t.visible ? "animate-enter opacity-100 scale-100" : "animate-leave opacity-0 scale-95";

export const toastSuccess = (mensaje: string) => {
  successSound.volume = 0.45;
  successSound.play().catch(() => {});
  
  return toast.custom((t) => (
    <div
      className={`${animationClasses(
        t
      )} ${baseClasses} bg-green-50 border-green-500 text-green-800`}
    >
      <CheckCircle className="w-7 h-7 text-green-600" />
      <p className="font-semibold text-lg">{mensaje}</p>
    </div>
  ));
};

export const toastError = (mensaje: string) => {
  errorSound.volume = 0.45;
  errorSound.play().catch(() => {});
  
  return toast.custom((t) => (
    <div
      className={`${animationClasses(
        t
      )} ${baseClasses} bg-red-50 border-red-500 text-red-800`}
    >
      <XCircle className="w-7 h-7 text-red-600" />
      <p className="font-semibold text-lg">{mensaje}</p>
    </div>
  ));
};



