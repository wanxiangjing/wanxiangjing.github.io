import { useScene } from "@/core/lib/useCommon";
import { setInterruptMsg } from "@/store/slices/room";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { COMMAND, INTERRUPT_PRIORITY } from "../handler";
import { RootState } from "@/store";
import RTCClient from "@/core/lib/RtcClient";

const useSendToRtc = () => {
    const { botName } = useScene();
    const dispatch = useDispatch();
  const RtcClient = useSelector((state: RootState) => state.rtcClient.RtcClient);
    // 提示本轮对话结束
    const sendFinishSpeech = useCallback(() => {
        const data = {
            agentName: botName,
            command: COMMAND.FINISH_SPEECH_RECOGNITION
        }
        RtcClient?.commandAgent(data);
    }, [botName]);

    // 发送到大模型
    const sendToLLM = useCallback((prompt: string) => {
        const data = {
            agentName: botName,
            command: COMMAND.EXTERNAL_TEXT_TO_LLM,
            interruptMode: INTERRUPT_PRIORITY.HIGH,
            message: prompt,
        }
        RtcClient?.commandAgent(data);
    }, [botName]);

    // 发送到语音合成
    const sendToSpeech = useCallback((prompt: string) => {
        const data = {
            agentName: botName,
            command: COMMAND.EXTERNAL_TEXT_TO_SPEECH,
            interruptMode: INTERRUPT_PRIORITY.HIGH,
            message: prompt,
        }
        RtcClient?.commandAgent(data);
    }, [botName]);

    // 处理打断
    const handleInterrupt = useCallback(() => {
        RtcClient?.commandAgent({
            agentName: botName,
            command: COMMAND.INTERRUPT,
        });
        dispatch(setInterruptMsg());
    }, [botName, dispatch]);

    // 等待AI语音播放结束


    return {
        sendFinishSpeech,
        sendToLLM,
        sendToSpeech,
        handleInterrupt,
    }
}

export default useSendToRtc