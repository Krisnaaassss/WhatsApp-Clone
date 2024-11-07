import { useState, useEffect, useRef } from "react";

type ComponentVisibleHook = {
  ref: React.RefObject<HTMLDivElement>;
  isComponentVisible: boolean;
  setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useComponentVisible(initialIsVisible: boolean): ComponentVisibleHook {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef<HTMLDivElement>(null);

  // Buat fungsi handleClickOutside untuk menangani klik di luar komponen
  const handleClickOutside = (event: MouseEvent) => {
    // Jika ref.current ada dan event.target tidak berada dalam komponen, maka ubah nilai isComponentVisible menjadi false
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false);
    }
  };

  // Buat effect untuk menambahkan event listener klik pada document
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []); 
  // Kembalikan nilai berupa ComponentVisibleHook
  return { ref, isComponentVisible, setIsComponentVisible };
}
