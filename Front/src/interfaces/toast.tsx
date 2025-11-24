import toast from "react-hot-toast";

export const toastError = (mensaje: string) => {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } bg-red-100 border-2 border-red-600 text-red-800 px-4 py-3 rounded-lg shadow-lg`}
    >
      <p className="font-semibold">{mensaje}</p>
    </div>
  ));
};

export const toastSuccess = (mensaje: string) => {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } bg-green-100 border-2 border-green-600 text-green-800 px-4 py-3 rounded-lg shadow-lg`}
    >
      <p className="font-semibold">{mensaje}</p>
    </div>
  ));
};


