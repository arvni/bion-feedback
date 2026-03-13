import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Button, Card, Table, Badge, Modal, Form, Row, Col, Alert
} from 'react-bootstrap';
import AdminLayout from '@/Layouts/AdminLayout';

const empty = { text: '', text_ar: '', order: '' };

export default function Questions({ questions }) {
    const [showModal, setShowModal]   = useState(false);
    const [editing, setEditing]       = useState(null); // Question object or null (create)
    const [form, setForm]             = useState(empty);
    const [errors, setErrors]         = useState({});
    const [saving, setSaving]         = useState(false);

    const openCreate = () => {
        setEditing(null);
        setForm(empty);
        setErrors({});
        setShowModal(true);
    };

    const openEdit = (q) => {
        setEditing(q);
        setForm({ text: q.text, text_ar: q.text_ar ?? '', order: q.order });
        setErrors({});
        setShowModal(true);
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        setSaving(true);
        const data = { text: form.text, text_ar: form.text_ar, order: parseInt(form.order) };

        if (editing) {
            router.put(`/admin/questions/${editing.id}`, data, {
                onSuccess: () => { setShowModal(false); setSaving(false); },
                onError: (e) => { setErrors(e); setSaving(false); },
            });
        } else {
            router.post('/admin/questions', data, {
                onSuccess: () => { setShowModal(false); setSaving(false); setForm(empty); },
                onError: (e) => { setErrors(e); setSaving(false); },
            });
        }
    };

    const toggleStatus = (q) => {
        router.put(`/admin/questions/${q.id}`, { status: !q.status }, { preserveScroll: true });
    };

    const handleDelete = (q) => {
        if (!confirm(`Delete question: "${q.text}"?`)) return;
        router.delete(`/admin/questions/${q.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Questions">
            <Head title="Admin – Questions" />

            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={openCreate}>
                    + New Question
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: 60 }}>Order</th>
                                <th>Question (EN)</th>
                                <th>Question (AR)</th>
                                <th style={{ width: 90 }}>Status</th>
                                <th style={{ width: 140 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        No questions yet. Click "New Question" to add one.
                                    </td>
                                </tr>
                            )}
                            {questions.map(q => (
                                <tr key={q.id}>
                                    <td className="text-center fw-semibold">{q.order}</td>
                                    <td>{q.text}</td>
                                    <td dir="rtl">{q.text_ar || <span className="text-muted">—</span>}</td>
                                    <td>
                                        <Badge
                                            bg={q.status ? 'success' : 'secondary'}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => toggleStatus(q)}
                                            title="Click to toggle"
                                        >
                                            {q.status ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="me-1"
                                            onClick={() => openEdit(q)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => handleDelete(q)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Create / Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Edit Question' : 'New Question'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="danger" className="py-2">
                            {Object.values(errors).flat().join(' · ')}
                        </Alert>
                    )}
                    <Form>
                        <Row className="g-3">
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Question (English) <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        name="text"
                                        value={form.text}
                                        onChange={handleChange}
                                        placeholder="How was your experience?"
                                        isInvalid={!!errors.text}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.text}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Question (Arabic)</Form.Label>
                                    <Form.Control
                                        name="text_ar"
                                        value={form.text_ar}
                                        onChange={handleChange}
                                        placeholder="كيف كانت تجربتك؟"
                                        dir="rtl"
                                        isInvalid={!!errors.text_ar}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={4}>
                                <Form.Group>
                                    <Form.Label>Order <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        name="order"
                                        type="number"
                                        min={1}
                                        value={form.order}
                                        onChange={handleChange}
                                        isInvalid={!!errors.order}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.order}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
}
