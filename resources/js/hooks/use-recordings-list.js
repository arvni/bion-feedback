import {useState, useEffect} from "react";
import generateKey from "../utils/generate-key";

export default function useRecordingsList(audio) {
    const [recordings, setRecordings] = useState(null);

    useEffect(() => {
        if (audio)
            setRecordings({key: generateKey(), audio});
    }, [audio]);

    return {
        recordings
    };
}
