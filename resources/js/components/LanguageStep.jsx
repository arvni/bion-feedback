import React from 'react';

export default function LanguageStep({ setState, setStep }) {
    const choose = (lang) => {
        setState(prev => ({ ...prev, language: lang }));
        setStep(2);
    };

    return (
        <div>
            <div className="step-heading" style={{ textAlign: 'center' }}>
                Welcome
            </div>
            <div className="step-sub" style={{ textAlign: 'center' }}>
                Choose your language &nbsp;/&nbsp;
                <span dir="rtl" style={{ fontWeight: 700, color: '#0891b2' }}>اختر لغتك</span>
            </div>

            <div className="lang-grid">
                {/* English */}
                <button className="lang-btn" onClick={() => choose('en')} aria-label="English">
                    <span className="lf">
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 52, height: 52,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #012169 50%, #C8102E 50%)',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            letterSpacing: '0.04em',
                            flexShrink: 0,
                        }}>EN</span>
                    </span>
                    <span className="ln">English</span>
                    <span className="ls">Continue in English</span>
                </button>

                {/* Arabic */}
                <button className="lang-btn" onClick={() => choose('ar')} aria-label="Arabic" dir="rtl">
                    <span className="lf">
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 52, height: 52,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #006C35 50%, #006C35 50%)',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            flexShrink: 0,
                        }}>ع</span>
                    </span>
                    <span className="ln">العربية</span>
                    <span className="ls" dir="rtl">تابع بالعربية</span>
                </button>
            </div>
        </div>
    );
}
