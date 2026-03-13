import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

export default function ConfirmPassword() {
    const [password, setPassword] = useState('');
    const [errors, setErrors]     = useState({});
    const [loading, setLoading]   = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post('/confirm-password', { password }, {
            onError: (e) => { setErrors(e); setLoading(false); },
            onFinish: () => setLoading(false),
        });
    };

    return (
        <>
            <Head title="Confirm Password" />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Row className="w-100 justify-content-center">
                    <Col xs={12} sm={8} md={6} lg={4}>
                        <Card className="border-0 shadow">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-2">Confirm Password</h5>
                                <p className="text-muted small mb-3">Please confirm your password before continuing.</p>
                                <Form onSubmit={submit}>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} autoFocus isInvalid={!!errors.password} />
                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Button type="submit" variant="dark" className="w-100" disabled={loading}>
                                        {loading ? 'Confirming…' : 'Confirm'}
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
