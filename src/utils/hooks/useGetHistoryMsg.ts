import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Msg } from "@/store/slices/room";

const useGetHistoryMsg = () => {
    const [msgs, setMsgs] = useState<Msg[]>([]);
    const { msgHistory } = useSelector((state: RootState) => state.room);
    const msgHistoryJson = useRef(JSON.stringify(msgHistory));

    useEffect(() => {
        if (JSON.stringify(msgHistory) !== msgHistoryJson.current) {
            setMsgs(msgHistory);
            msgHistoryJson.current = JSON.stringify(msgHistory);
        }
    }, [msgHistory])
    return {
        msgHistory: msgs,
        lastMsg: msgs.at(-1),
    }
}

export default useGetHistoryMsg;