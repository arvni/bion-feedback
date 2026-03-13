import React from 'react';

const T = {
    en: {
        heading: 'How would you like to share your feedback?',
        speak:   { label: 'Voice',    desc: 'Record a short voice message' },
        qa:      { label: 'Survey',   desc: 'Answer a few quick questions'  },
    },
    ar: {
        heading: 'كيف تريد مشاركة تقييمك؟',
        speak:   { label: 'صوتي',     desc: 'سجّل رسالة صوتية قصيرة'   },
        qa:      { label: 'استبيان', desc: 'أجب على بعض الأسئلة السريعة' },
    },
};

export default function SecondStep({ setStep, setState, language = 'en' }) {
    const t     = T[language] ?? T.en;
    const isRtl = language === 'ar';

    const choose = (type) => {
        setState(prev => ({ ...prev, type }));
        setStep(type);
    };

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="step-heading">{t.heading}</div>

            <div className="type-grid">
                <button
                    className="type-card"
                    onClick={() => choose('soundRecord')}
                    aria-label={t.speak.label}
                >
                    <span className="ti-wrap"><span className="ti">🎙</span></span>
                    <span className="tl">{t.speak.label}</span>
                    <span className="td">{t.speak.desc}</span>
                </button>

                <button
                    className="type-card"
                    onClick={() => choose('qa')}
                    aria-label={t.qa.label}
                >
                    <span className="ti-wrap"><span className="ti">📋</span></span>
                    <span className="tl">{t.qa.label}</span>
                    <span className="td">{t.qa.desc}</span>
                </button>
            </div>
        </div>
    );
}
