import React, { useEffect } from 'react';

const CONFIG = {
    success: {
        icon:    '✅',
        color:   '#059669',
        bg:      '#ecfdf5',
        border:  '#6ee7b7',
        titles:  { en: 'Thank you!',      ar: 'شكراً لك!' },
    },
    error: {
        icon:    '❌',
        color:   '#dc2626',
        bg:      '#fef2f2',
        border:  '#fca5a5',
        titles:  { en: 'Oops!',           ar: 'عذراً!' },
    },
};

export default function AppNotification({ type, message, language = 'en', onClose, autoDismiss = false }) {
    const cfg   = CONFIG[type] ?? CONFIG.error;
    const isRtl = language === 'ar';
    const title = cfg.titles[language] ?? cfg.titles.en;
    const btnLabel = isRtl ? 'إغلاق' : (type === 'success' ? 'Done' : 'Close');

    useEffect(() => {
        if (autoDismiss) {
            const t = setTimeout(onClose, 2800);
            return () => clearTimeout(t);
        }
    }, [autoDismiss, onClose]);

    return (
        <div style={{
            position:   'fixed',
            inset:       0,
            zIndex:      9999,
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding:    '1.5rem',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            animation:  'fadeIn 0.2s ease both',
        }}>
            <div
                dir={isRtl ? 'rtl' : 'ltr'}
                style={{
                    background:   cfg.bg,
                    border:       `2px solid ${cfg.border}`,
                    borderRadius: 24,
                    padding:      '2.5rem 2rem',
                    maxWidth:     380,
                    width:        '100%',
                    textAlign:    'center',
                    boxShadow:    '0 32px 80px rgba(0,0,0,0.3)',
                    animation:    'popIn 0.3s cubic-bezier(.34,1.56,.64,1) both',
                }}
            >
                {/* Icon */}
                <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.75rem' }}>
                    {cfg.icon}
                </div>

                {/* Title */}
                <div style={{
                    fontSize:   '1.4rem',
                    fontWeight: 800,
                    color:      cfg.color,
                    marginBottom: '0.5rem',
                }}>
                    {title}
                </div>

                {/* Message */}
                <div style={{
                    fontSize:     '1rem',
                    color:        '#374151',
                    lineHeight:   1.6,
                    marginBottom: '1.75rem',
                    fontWeight:   600,
                }}>
                    {message}
                </div>

                {/* Auto-dismiss progress bar for success */}
                {autoDismiss && (
                    <div style={{
                        height:       3,
                        background:   '#d1fae5',
                        borderRadius: 2,
                        overflow:     'hidden',
                        marginBottom: '1.25rem',
                    }}>
                        <div style={{
                            height:     '100%',
                            background: cfg.color,
                            borderRadius: 2,
                            animation:  'drainBar 2.8s linear both',
                        }} />
                    </div>
                )}

                {/* Button */}
                <button
                    onClick={onClose}
                    style={{
                        background:   cfg.color,
                        color:        '#fff',
                        border:       'none',
                        borderRadius: 50,
                        padding:      '0.75rem 2.25rem',
                        fontSize:     '1rem',
                        fontWeight:   700,
                        cursor:       'pointer',
                        transition:   'opacity 0.15s',
                        minWidth:     120,
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    {btnLabel}
                </button>
            </div>
        </div>
    );
}
