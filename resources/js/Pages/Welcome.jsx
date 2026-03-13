import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import LanguageStep      from '@/components/LanguageStep';
import FirstStep         from '@/components/FirstStep';
import SecondStep        from '@/components/SecondStep';
import SoundRecordStep   from '@/components/SoundRecordStep';
import QAStep            from '@/components/QAStep';
import AppNotification   from '@/components/AppNotification';

const TOTAL_DOTS = 4;
const dotIndex   = { 1: 0, 2: 1, 3: 2, soundRecord: 3, qa: 3 };

export default function Welcome() {
    const [step, setStep]       = useState(1);
    const [loading, setLoading] = useState(false);
    const [state, setState]     = useState({
        phoneNo:  '',
        language: 'en',
        type:     null,
        audio:    null,
        qa:       [],
    });
    const [notif, setNotif] = useState(null); // { type, message }

    const showNotif = (type, message) => setNotif({ type, message });
    const closeNotif = () => {
        setNotif(null);
        // reset to start after success
        if (notif?.type === 'success') {
            setStep(1);
            setState({ phoneNo: '', language: 'en', type: null, audio: null, qa: [] });
        }
    };

    const submit = async () => {
        setLoading(true);
        try {
            const fd = new FormData();
            if (state.type === 'soundRecord') {
                fd.append('audio_data', state.audio.blob, 'recording.ogg');
            } else {
                fd.append('qa', JSON.stringify(state.qa));
            }
            fd.append('type',     state.type);
            fd.append('phoneNo',  state.phoneNo);
            fd.append('language', state.language);
            await axios.post('/api/upload', fd);
            showNotif('success', state.language === 'ar'
                ? 'شكراً لك على وقتك، تقييمك يهمنا.'
                : 'Thank you for your time. Your feedback matters!'
            );
        } catch {
            showNotif('error', state.language === 'ar'
                ? 'حدث خطأ ما، يرجى المحاولة مرة أخرى.'
                : 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:             return <LanguageStep    setState={setState} setStep={setStep} />;
            case 2:             return <FirstStep       setState={setState} setStep={setStep} language={state.language} />;
            case 3:             return <SecondStep      setState={setState} setStep={setStep} language={state.language} />;
            case 'soundRecord': return <SoundRecordStep loading={loading} submit={submit} setState={setState} language={state.language} onError={(msg) => showNotif('error', msg)} />;
            case 'qa':          return <QAStep          loading={loading} submit={submit} setState={setState} language={state.language} />;
            default:            return null;
        }
    };

    const current = dotIndex[step] ?? 0;

    return (
        <>
            <Head title="Welcome" />

            <div className="app-screen">
                <div className="step-card">
                    <div className="step-dots">
                        {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
                            <span
                                key={i}
                                className={`dot ${i < current ? 'dot-done' : ''} ${i === current ? 'dot-active' : ''}`}
                            />
                        ))}
                    </div>

                    <div key={step} className="step-content">
                        {renderStep()}
                    </div>
                </div>
            </div>

            {/* Custom notification — replaces browser alert() */}
            {notif && (
                <AppNotification
                    type={notif.type}
                    message={notif.message}
                    language={state.language}
                    onClose={closeNotif}
                    autoDismiss={notif.type === 'success'}
                />
            )}
        </>
    );
}
