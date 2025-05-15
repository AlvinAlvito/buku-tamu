import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { BellIcon } from "lucide-react";
export default function BuatJanji() {
    const { isOpen, openModal, closeModal } = useModal();
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;


        if (isOpen) {
            setCountdown(60); // Reset to 60 every time modal opens
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        closeModal(); // Tutup modal saat countdown mencapai 0
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        // Clear interval ketika modal ditutup atau komponen unmount
        return () => clearInterval(timer);
    }, [isOpen, closeModal]);

    return (
        <>
            <button
                onClick={openModal}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
                <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                        fill=""
                    />
                </svg>
                Panggilan
            </button>



            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-xl m-4">
                <div className="relative w-full p-6 lg:p-10 overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-900 transition-all duration-300">
                    <div className="flex flex-col items-center text-center">
                        <BellIcon className="w-12 h-12 text-yellow-500 mb-4 animate-bounce" />
                        <h4 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                            Antrian Anda Sudah Selesai!
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                            Antrian Sudah Selesai. Dosen sedang menunggu Anda! Silakan segera temui dosen Anda dalam waktu...
                        </p>

                        <div className="flex items-center justify-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-6 py-4 rounded-xl mb-6 shadow-inner">
                            <span className="text-5xl font-bold text-yellow-700 dark:text-yellow-300">
                                {countdown}
                            </span>
                            <span className="text-lg font-medium text-yellow-700 dark:text-yellow-300">detik</span>
                        </div>
                    </div>
                </div>
            </Modal>

        </>
    );
}
