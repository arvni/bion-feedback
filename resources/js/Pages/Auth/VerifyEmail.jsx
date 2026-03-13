import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';

export default function VerifyEmail({ status }) {
    const [loading, setLoading] = useState(false);

    const resend = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post('/email/verification-notification', {}, { onFinish: () => setLoading(false) });
    };

    return (
        <>
            <Head title="Verify Email" />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Row className="w-100 justify-content-center">
                    <Col xs={12} sm={8} md={6} lg={5}>
                        <Card className="border-0 shadow">
                            <Card.Body className="p-4 text-center">
                                <h5 className="fw-bold mb-3">Verify Your Email</h5>
                                <p className="text-muted small mb-3">
                                    Thanks for signing up! Please verify your email address by clicking the link we sent you.
                                </p>
                                {status === 'verification-link-sent' && (
                                    <Alert variant="success" className="py-2">A new verification link has been sent.</Alert>
                                )}
                                <Button variant="dark" onClick={resend} disabled={loading} className="me-2">
                                    {loading ? 'Sending…' : 'Resend Email'}
                                </Button>
                                <Link href="/logout" method="post" as="button" className="btn btn-link text-muted">
                                    Log out
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
