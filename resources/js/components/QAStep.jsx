import React, { useEffect, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';

const RATINGS = [
    { value: '4', emoji: '😄', en: 'Great',  ar: 'ممتاز' },
    { value: '3', emoji: '🙂', en: 'Good',   ar: 'جيد'   },
    { value: '2', emoji: '😐', en: 'OK',     ar: 'عادي'  },
    { value: '1', emoji: '😕', en: 'Poor',   ar: 'ضعيف'  },
    { value: '0', emoji: '😠', en: 'Bad',    ar: 'سيء'   },
];

const T = {
    en: { question: 'Question', of: 'of', submit: 'Submit Feedback', loading: 'Submitting…' },
    ar: { question: 'سؤال',    of: 'من', submit: 'إرسال التقييم',    loading: 'جارٍ الإرسال…' },
};

export default function QAStep({ setState, submit, loading, language = 'en' }) {
    const [q, setQ]             = useState(0);
    const [show, setShow]       = useState(false);
    const [ans, setAns]         = useState([]);
    const [waiting, setWaiting] = useState(false);
    const [questions, setQuestions] = useState([]);
    const t                     = T[language] ?? T.en;
    const isRtl                 = language === 'ar';

    useEffect(() => {
        setWaiting(true);
        axios.get('/api/questions')
            .then(({ data }) => setQuestions(data.data))
            .finally(() => setWaiting(false));
    }, []);

    const pick = (value) => {
        const tmp = [...ans];
        tmp[q] = { question: questions[q], value };
        setAns(tmp);
        setState(prev => ({ ...prev, qa: tmp }));
        if (q < questions.length - 1) {
            setTimeout(() => setQ(prev => prev + 1), 220);
        }
    };

    const back = () => {
        if (q > 0) setQ(prev => prev - 1);
    };

    const handleSubmit = () => {
        setShow(true);
        submit();
    };

    const pct       = questions.length > 0 ? Math.round(((q + 1) / questions.length) * 100) : 0;
    const qText     = isRtl
        ? (questions[q]?.text_ar || questions[q]?.text)
        : questions[q]?.text;
    const allDone   = ans.length === questions.length && questions.length > 0;

    return (
        <div dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Back button */}
            {q > 0 && (
                <button
                    className={`back-btn${isRtl ? ' back-btn-rtl' : ''}`}
                    onClick={back}
                    aria-label="Back"
                >
                    {isRtl ? '→' : '←'}
                </button>
            )}

            {waiting ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                    <Spinner animation="border" style={{ color: '#0891b2' }} />
                </div>
            ) : (
                <>
                    {/* Progress */}
                    <div className="q-progress-wrap">
                        <div className="q-progress-track">
                            <div className="q-progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <div className={`q-progress-label${isRtl ? ' rtl' : ''}`}>
                            {t.question} {q + 1} {t.of} {questions.length}
                        </div>
                    </div>

                    {/* Question */}
                    <div className="question-num">{String(q + 1).padStart(2, '0')}</div>
                    <div className="question-text" dir={isRtl ? 'rtl' : 'ltr'}>
                        {qText}
                    </div>

                    {/* Emoji ratings */}
                    <div className="rating-row">
                        {RATINGS.map((r) => (
                            <button
                                key={r.value}
                                className={`rating-btn${ans[q]?.value === r.value ? ' selected' : ''}`}
                                onClick={() => pick(r.value)}
                                aria-label={r.emoji}
                                type="button"
                            >
                                <span>{r.emoji}</span>
                                <span className="rating-label">{isRtl ? r.ar : r.en}</span>
                            </button>
                        ))}
                    </div>

                    {/* Submit */}
                    {allDone && (
                        <div className="submit-row">
                            <button
                                className="btn-action"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading
                                    ? <><Spinner as="span" animation="border" size="sm" />&nbsp;{t.loading}</>
                                    : t.submit
                                }
                            </button>
                        </div>
                    )}
                </>
            )}

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
