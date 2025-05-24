import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { initSocket, disconnectSocket } from "./socket";

type OnlineCounts = { mahasiswa: number; dosen: number };
type OnlineContextType = { online: OnlineCounts };

const OnlineContext = createContext<OnlineContextType | undefined>(undefined);

export function OnlineProvider({ children }: { children: React.ReactNode }) {
    const [online, setOnline] = useState<OnlineCounts>({
        mahasiswa: 0,
        dosen: 0,
    });

    const joinedRef = useRef(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const newToken = localStorage.getItem("token");
            setToken(newToken);
            joinedRef.current = false;
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);
    useEffect(() => {
        const handleTokenChange = () => {
            const newToken = localStorage.getItem("token");
            setToken(newToken);
            joinedRef.current = false;
        };

        window.addEventListener("storage", handleTokenChange);
        window.addEventListener("token-change", handleTokenChange);
        return () => {
            window.removeEventListener("storage", handleTokenChange);
            window.removeEventListener("token-change", handleTokenChange);
        };
    }, []);

    useEffect(() => {
        if (!token) {
            disconnectSocket();
            return;
        }

        const socket = initSocket(token);
        joinedRef.current = false;

        const handleConnect = () => {
            console.log("✅ Connected to socket");
            if (!joinedRef.current) {
                socket.emit("user-join");
                joinedRef.current = true;
            }
        };

        const handleError = (err: Error) => {
            console.error("❌ Socket error:", err.message);
        };

        const handleOnlineCounts = (data: OnlineCounts) => {
            console.log("📡 Online counts received", data);
            setOnline(data);
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleError);
        socket.on("online-counts", handleOnlineCounts);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleError);
            socket.off("online-counts", handleOnlineCounts);
            joinedRef.current = false;
        };
    }, [token]);


    return (
        <OnlineContext.Provider value={{ online }}>
            {children}
        </OnlineContext.Provider>
    );
}
export function useOnline() {
    const context = useContext(OnlineContext);
    if (!context)
        throw new Error("useOnline must be used within an OnlineProvider");
    return context;
}
