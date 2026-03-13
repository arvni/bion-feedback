import {useState, useEffect} from "react";
import {startRecording, saveRecording} from "@/handlers/recorder-controls";

const objectURL = window.URL || window.webkitURL;

const MIME_TYPE = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
].find(t => MediaRecorder.isTypeSupported(t)) ?? '';

const initialState = {
    recordingMinutes: 0,
    recordingSeconds: 0,
    initRecording: false,
    mediaStream: null,
    mediaRecorder: null,
    audio: null,
    length: 0
};


export default function useRecorder() {
    const [recorderState, setRecorderState] = useState(initialState);

    useEffect(() => {
        const MAX_RECORDER_TIME = 1;
        let recordingInterval = null;

        if (recorderState.initRecording)
            recordingInterval = setInterval(() => {
                setRecorderState((prevState) => {
                    if (
                        prevState.recordingMinutes === MAX_RECORDER_TIME &&
                        prevState.recordingSeconds === 0
                    ) {
                        clearInterval(recordingInterval);
                        return prevState;
                    }

                    if (prevState.recordingSeconds >= 0 && prevState.recordingSeconds < 59)
                        return {
                            ...prevState,
                            recordingSeconds: prevState.recordingSeconds + 1,
                        };

                    if (prevState.recordingSeconds === 59)
                        return {
                            ...prevState,
                            recordingMinutes: prevState.recordingMinutes + 1,
                            recordingSeconds: 0,
                        };
                });
            }, 1000);
        else clearInterval(recordingInterval);

        return () => clearInterval(recordingInterval);
    }, [recorderState.initRecording]);

    useEffect(() => {
        if (recorderState.mediaStream)
            setRecorderState((prevState) => ({
                ...prevState,
                mediaRecorder: new MediaRecorder(
                    prevState.mediaStream,
                    MIME_TYPE ? { mimeType: MIME_TYPE } : {}
                ),
            }));
    }, [recorderState.mediaStream]);

    useEffect(() => {
        const recorder = recorderState.mediaRecorder;
        let chunks = [];

        if (recorder && recorder.state === "inactive") {
            recorder.start();

            recorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: MIME_TYPE || 'audio/webm' });
                const url = objectURL.createObjectURL(blob);
                setRecorderState((prevState) => {
                    if (prevState.mediaRecorder)
                        return {
                            ...initialState,
                            audio: {blob, url},
                        };
                    else return initialState;
                });
            };
        }

        return () => {
            if (recorder) recorder.stream.getAudioTracks().forEach((track) => track.stop());
        };
    }, [recorderState.mediaRecorder]);

    return {
        recorderState,
        startRecording: () => startRecording(setRecorderState),
        cancelRecording: () => setRecorderState(initialState),
        saveRecording: () => saveRecording(recorderState.mediaRecorder),
    };
}
