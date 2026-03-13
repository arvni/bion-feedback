import React, { useState } from 'react';
import { Image } from 'react-bootstrap';

const T = {
    en: {
        label:       'Phone Number',
        placeholder: '+968 XXXX XXXX',
        hint:        'We use this to identify your response.',
        next:        'Continue →',
        error:       'Please enter a valid phone number (min 8 digits).',
    },
    ar: {
        label:       'رقم الهاتف',
        placeholder: '+968 XXXX XXXX',
        hint:        'نستخدم هذا لتحديد إجابتك.',
        next:        '← متابعة',
        error:       'يرجى إدخال رقم هاتف صحيح (٨ أرقام على الأقل).',
    },
};

export default function FirstStep({ setStep, setState, language = 'en' }) {
    const [phone, setPhone]   = useState('');
    const [error, setError]   = useState('');
    const t                   = T[language] ?? T.en;
    const isRtl               = language === 'ar';

    const onChange = (e) => {
        setPhone(e.target.value);
        setState(prev => ({ ...prev, phoneNo: e.target.value }));
        if (error) setError('');
    };

    const onNext = () => {
        if (phone.replace(/\D/g, '').length < 8) {
            setError(t.error);
        } else {
            setStep(3);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') onNext();
    };

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'}>
            <Image src="/images/logo.png" className="app-logo" />

            <div className="step-heading">{isRtl ? 'أدخل رقم هاتفك' : 'Enter your phone number'}</div>
            <div className="step-sub" style={{ marginBottom: '1.5rem' }}>
                {t.hint}
            </div>

            <div className="phone-wrap">
                <label className="phone-label" htmlFor="phone-input">{t.label}</label>
                <input
                    id="phone-input"
                    type="tel"
                    inputMode="tel"
                    className={`form-control phone-field${error ? ' is-invalid' : ''}`}
                    placeholder={t.placeholder}
                    value={phone}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    dir="ltr"
                    autoFocus
                />
                {error && (
                    <div style={{
                        fontSize: '0.82rem',
                        color: '#ef4444',
                        marginTop: '0.45rem',
                        fontWeight: 600,
                    }} dir={isRtl ? 'rtl' : 'ltr'}>
                        {error}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                    className="btn-action"
                    onClick={onNext}
                    style={{ minWidth: 160 }}
                >
                    {t.next}
                </button>
            </div>
        </div>
    );
}
