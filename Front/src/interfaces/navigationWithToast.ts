import toast from "react-hot-toast";

export function redirectWithToast(navigate: any, message: string, path: string) {
  toast.error(message, { duration: 1500 });

  setTimeout(() => {
    navigate(path);
  }, 1500);
}