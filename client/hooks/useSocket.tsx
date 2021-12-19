import { useEffect } from "react";
import { io } from "socket.io-client";
import { backendUrl } from "../constants";
export function useSocket(url?: string) {
    const socket = io(url ? url : backendUrl);
    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, []);
    return socket;
}
