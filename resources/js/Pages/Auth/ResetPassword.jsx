import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

export default function ResetPassword({ token, email: initialEmail }) {
    const [form, setForm]       = useState({ token, email: initialEmail, password: '', password_confirmation: '' });
    const [errors, setErrors]   = useState({});
    const [loading, setLoading] = useState(false);

    const handle = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post('/reset-password', form, {
            onError: (e) => { setErrors(e); setLoading(false); },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <Head title="Reset Password" />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Row className="w-100 justify-content-center">
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="border-0 shadow">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">Reset Password</h5>
                                <Form onSubmit={submit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" value={form.email} onChange={handle} isInvalid={!!errors.email} />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>New Password</Form.Label>
                                        <Form.Control type="password" name="password" value={form.password} onChange={handle} autoFocus isInvalid={!!errors.password} />
                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control type="password" name="password_confirmation" value={form.password_confirmation} onChange={handle} isInvalid={!!errors.password_confirmation} />
                                    </Form.Group>
                                    <Button type="submit" variant="dark" className="w-100" disabled={loading}>
                                        {loading ? 'Resetting…' : 'Reset Password'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
