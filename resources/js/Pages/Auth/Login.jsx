import React, { useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import Turnstile from '@/components/Turnstile';

export default function Login({ status, canResetPassword }) {
    const [form, setForm]       = useState({ email: '', password: '', remember: false });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const turnstileRef = useRef(null);
    const pendingRef   = useRef(false);

    const handle = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const submit = (e) => {
        e.preventDefault();
        if (pendingRef.current) return;
        pendingRef.current = true;
        setLoading(true);
        turnstileRef.current?.execute();
    };

    const onToken = (token) => {
        pendingRef.current = false;
        router.post('/login', { ...form, cf_turnstile_response: token }, {
            onError:  (e) => {
                setErrors(e);
                setLoading(false);
                turnstileRef.current?.reset();
            },
            onFinish: () => setLoading(false),
        });
    };

    const onExpire = () => {
        pendingRef.current = false;
        setLoading(false);
        setErrors({ email: 'CAPTCHA expired. Please try again.' });
    };

    return (
        <>
            <Head title="Log in" />
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                padding: '16px',
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <Card className="border-0 shadow-lg">
                        <Card.Body className="p-4 p-sm-5">
                            <div className="text-center mb-4">
                                <div style={{ fontSize: 40 }}>🎙</div>
                                <h4 className="fw-bold mt-2 mb-0">Admin Login</h4>
                                <p className="text-muted small mt-1">Voice Record Panel</p>
                            </div>

                            {status && <Alert variant="success" className="py-2">{status}</Alert>}

                            <Form onSubmit={submit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handle}
                                        autoFocus
                                        size="lg"
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handle}
                                        size="lg"
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        name="remember"
                                        label="Remember me"
                                        checked={form.remember}
                                        onChange={handle}
                                    />
                                </Form.Group>

                                <Turnstile ref={turnstileRef} onToken={onToken} onExpire={onExpire} />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Verifying…' : 'Log in'}
                                </Button>

                                {canResetPassword && (
                                    <div className="text-center">
                                        <Link href="/forgot-password" className="small text-muted">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
}
