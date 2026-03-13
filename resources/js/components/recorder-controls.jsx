import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateBack, faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const T = {
    en: { submit: 'Submit', rerecord: '' },
    ar: { submit: 'إرسال', rerecord: '' },
};

function ProgressRing({ value }) {
    return (
        <div style={{ position: 'absolute', inset: 0 }}>
            <CircularProgressbar
                value={value}
                styles={buildStyles({
                    pathColor:  '#0891b2',
                    trailColor: '#e2e8f0',
                    strokeLinecap: 'round',
                })}
            />
        </div>
    );
}

export default function RecorderControls({ recorderState, handlers, setShowTimer, loading, handleSubmit, language = 'en', onError }) {
    const timerRef              = useRef(null);
    const { initRecording }     = recorderState;
    const { startRecording, saveRecording, cancelRecording } = handlers;
    const t                     = T[language] ?? T.en;

    const [phase, setPhase]         = useState('idle');   // idle | recording | done
    const [length, setLength]       = useState(60);

    useEffect(() => {
        if (phase === 'recording') {
            setLength(60);
            timerRef.current = setInterval(() => {
                setLength(prev => {
                    if (prev <= 1) { stop(); return 60; }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const start = () => {
        try {
            startRecording();
            setPhase('recording');
            setShowTimer(true);
        } catch (e) {
            if (onError) onError(e.message);
        }
    };

    const stop = () => {
        clearInterval(timerRef.current);
        saveRecording();
        setPhase('done');
        setShowTimer(false);
    };

    const reRecord = () => {
        cancelRecording();
        setPhase('idle');
        setLength(60);
    };

    // ── shared button style ──
    const circleBtn = {
        width: '82%',
        height: '82%',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Progress ring when recording */}
            {phase === 'recording' && initRecording && (
                <ProgressRing value={(length / 60) * 100} />
            )}

            {/* Inner content centered */}
            <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {/* IDLE — mic button */}
                {phase === 'idle' && (
                    <button
                        onClick={start}
                        style={{
                            ...circleBtn,
                            background: 'linear-gradient(135deg, #0891b2, #0e7490)',
                            boxShadow: '0 8px 32px rgba(8,145,178,0.4)',
                            color: '#fff',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.07)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(8,145,178,0.55)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(8,145,178,0.4)'; }}
                        aria-label="Start recording"
                    >
                        <FontAwesomeIcon icon={faMicrophone} style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)' }} />
                    </button>
                )}

                {/* RECORDING — stop button */}
                {phase === 'recording' && initRecording && (
                    <button
                        onClick={stop}
                        className="record-ring-pulse"
                        style={{
                            ...circleBtn,
                            background: '#fff',
                            color: '#ef4444',
                        }}
                        aria-label="Stop recording"
                    >
                        <FontAwesomeIcon icon={faStop} style={{ fontSize: 'clamp(1.5rem, 6vw, 2.75rem)' }} />
                    </button>
                )}

                {/* DONE — re-record + submit */}
                {phase === 'done' && (
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                            onClick={reRecord}
                            style={{
                                width: 56, height: 56,
                                borderRadius: '50%',
                                border: '2px solid #e2e8f0',
                                background: '#f8fafc',
                                cursor: 'pointer',
                                color: '#64748b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.15s',
                            }}
                            aria-label="Re-record"
                        >
                            <FontAwesomeIcon icon={faArrowRotateBack} style={{ fontSize: '1.25rem' }} />
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-action"
                            style={{ minWidth: 110 }}
                        >
                            {loading
                                ? <><Spinner as="span" animation="border" size="sm" />&nbsp;</>
                                : null
                            }
                            {t.submit}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
