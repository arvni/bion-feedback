export async function startRecording(setRecorderState) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    setRecorderState((prevState) => ({
        ...prevState,
        initRecording: true,
        mediaStream: stream,
    }));
}

export function saveRecording(recorder) {
    if (recorder.state !== "inactive") recorder.stop();
}
