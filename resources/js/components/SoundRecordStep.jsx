import React, { useEffect, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import 'react-circular-progressbar/dist/styles.css';
import RecorderControls from '@/components/recorder-controls';
import useRecorder from '@/hooks/useRecorder';
import { formatMinutes, formatSeconds } from '@/utils/format-time';

URL = window.URL || window.webkitURL;

const T = {
    en: {
        instr:  'Tap the microphone and speak freely.',
        hint:   'Up to 60 seconds · Your voice is kept confidential',
        submit: 'Submit',
        rerecord: 'Re-record',
    },
    ar: {
        instr:  'اضغط على المايكروفون وتحدث بحرية.',
        hint:   'حتى ٦٠ ثانية · تبقى ملاحظاتك سرية',
        submit: 'إرسال',
        rerecord: 'إعادة التسجيل',
    },
};

export default function SoundRecordStep({ setState, submit, loading, language = 'en', onError }) {
    const { recorderState, ...handlers } = useRecorder();
    const { recordingMinutes, recordingSeconds, audio } = recorderState;
    const [showTimer, setShowTimer] = useState(false);
    const [show, setShow]           = useState(false);
    const t                         = T[language] ?? T.en;
    const isRtl                     = language === 'ar';

    useEffect(() => {
        if (audio) setState(prev => ({ ...prev, audio }));
    }, [audio]);

    const handleSubmit = () => {
        setShow(true);
        submit();
    };

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="step-heading" style={{ textAlign: 'center' }}>
                {isRtl ? 'سجّل صوتك' : 'Record your voice'}
            </div>

            {/* Instruction */}
            {!showTimer && !audio?.url && (
                <div className="record-instr" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
                    <span>{t.instr}</span>
                    <br />
                    <span style={{ fontSize: '0.78rem', opacity: 0.7 }}>{t.hint}</span>
                </div>
            )}

            {/* Audio playback */}
            {audio?.url && !showTimer && (
                <div className="audio-review">
                    <audio controls src={audio.url}>
                        <source src={audio.url} type="audio/webm;codecs=opus" />
                    </audio>
                </div>
            )}

            {/* Timer display */}
            {showTimer && (
                <div className="record-timer">
                    {`${formatMinutes(recordingMinutes)}:${formatSeconds(recordingSeconds)}`}
                </div>
            )}

            {/* Recorder */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="player-container">
                    <RecorderControls
                        handleSubmit={handleSubmit}
                        loading={loading}
                        handlers={handlers}
                        setShowTimer={setShowTimer}
                        recorderState={recorderState}
                        language={language}
                        onError={onError}
                    />
                </div>
            </div>

            {/* Loading modal */}
            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                backdrop="static"
                centered
                contentClassName="bg-transparent border-0"
            >
                <Modal.Body className="d-flex justify-content-center align-items-center">
                    {loading && <Spinner animation="border" size="lg" variant="light" />}
                </Modal.Body>
            </Modal>
        </div>
    );
}
