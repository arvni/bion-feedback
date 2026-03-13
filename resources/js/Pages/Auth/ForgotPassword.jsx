import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

export default function ForgotPassword({ status }) {
    const [email, setEmail]     = useState('');
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post('/forgot-password', { email }, {
            onError: (e) => { setErrors(e); setLoading(false); },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <Head title="Forgot Password" />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Row className="w-100 justify-content-center">
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="border-0 shadow">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">Forgot Password</h5>
                                <p className="text-muted small mb-3">
                                    Enter your email and we'll send a password reset link.
                                </p>
                                {status && <Alert variant="success" className="py-2">{status}</Alert>}
                                <Form onSubmit={submit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            autoFocus
                                            isInvalid={!!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link href="/login" className="small text-muted">Back to login</Link>
                                        <Button type="submit" variant="dark" disabled={loading}>
                                            {loading ? 'Sending…' : 'Send Reset Link'}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
