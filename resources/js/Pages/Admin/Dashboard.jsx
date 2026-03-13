import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, Col, Row, Table, ProgressBar, Badge } from 'react-bootstrap';
import AdminLayout from '@/Layouts/AdminLayout';

const EMOJI = { 4: '😄', 3: '🙂', 2: '😐', 1: '🙁', 0: '😠' };
const COLORS = { 4: 'success', 3: 'info', 2: 'warning', 1: 'orange', 0: 'danger' };

function RatingBar({ dist, total }) {
    if (!total) return <span className="text-muted small">No data</span>;
    return (
        <div style={{ minWidth: 160 }}>
            {[4, 3, 2, 1, 0].map(v => {
                const count = dist[v] ?? 0;
                const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                    <div key={v} className="d-flex align-items-center gap-1 mb-1" style={{ fontSize: 12 }}>
                        <span style={{ width: 22 }}>{EMOJI[v]}</span>
                        <ProgressBar
                            variant={COLORS[v] === 'orange' ? 'warning' : COLORS[v]}
                            now={pct}
                            style={{ flex: 1, height: 8 }}
                        />
                        <span style={{ width: 28, textAlign: 'right' }} className="text-muted">{count}</span>
                    </div>
                );
            })}
        </div>
    );
}

function avgBadge(avg) {
    if (avg === null) return <span className="text-muted">—</span>;
    let variant = 'danger';
    if (avg >= 3.5) variant = 'success';
    else if (avg >= 2.5) variant = 'info';
    else if (avg >= 1.5) variant = 'warning';
    return <Badge bg={variant}>{avg} / 4 &nbsp;{EMOJI[Math.round(avg)]}</Badge>;
}

export default function Dashboard({ totalResponses, qaCount, soundCount, questionStats, emailSent, emailPending, emailFailed }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin – Dashboard" />

            {/* Response stat cards */}
            <Row className="g-3 mb-4">
                <Col xs={12} sm={4}>
                    <Card className="border-0 shadow-sm h-100 text-center">
                        <Card.Body className="py-4">
                            <div style={{ fontSize: 36 }}>📁</div>
                            <div className="display-6 fw-bold mt-1">{totalResponses}</div>
                            <div className="text-muted">Total Responses</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card className="border-0 shadow-sm h-100 text-center">
                        <Card.Body className="py-4">
                            <div style={{ fontSize: 36 }}>📋</div>
                            <div className="display-6 fw-bold mt-1">{qaCount}</div>
                            <div className="text-muted">Q&amp;A Responses</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card className="border-0 shadow-sm h-100 text-center">
                        <Card.Body className="py-4">
                            <div style={{ fontSize: 36 }}>🎙</div>
                            <div className="display-6 fw-bold mt-1">{soundCount}</div>
                            <div className="text-muted">Voice Recordings</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Email notification stats */}
            <Row className="g-3 mb-4">
                <Col xs={12} sm={4}>
                    <Card className="border-0 shadow-sm h-100 text-center" style={{ borderTop: '3px solid #198754' }}>
                        <Card.Body className="py-3">
                            <div style={{ fontSize: 28 }}>✉️</div>
                            <div className="fs-4 fw-bold text-success mt-1">{emailSent}</div>
                            <div className="text-muted small">Emails Sent</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card className="border-0 shadow-sm h-100 text-center" style={{ borderTop: '3px solid #ffc107' }}>
                        <Card.Body className="py-3">
                            <div style={{ fontSize: 28 }}>⏳</div>
                            <div className="fs-4 fw-bold text-warning mt-1">{emailPending}</div>
                            <div className="text-muted small">Emails Pending</div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card className="border-0 shadow-sm h-100 text-center" style={{ borderTop: '3px solid #dc3545' }}>
                        <Card.Body className="py-3">
                            <div style={{ fontSize: 28 }}>⚠️</div>
                            <div className="fs-4 fw-bold text-danger mt-1">{emailFailed}</div>
                            <div className="text-muted small">Emails Failed</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Per-question stats */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white fw-semibold border-bottom">
                    Question Rating Breakdown
                </Card.Header>
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: 40 }}>#</th>
                                <th>Question (EN)</th>
                                <th>Question (AR)</th>
                                <th style={{ width: 90 }}>Responses</th>
                                <th style={{ width: 130 }}>Average</th>
                                <th style={{ width: 220 }}>Distribution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionStats.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-4">
                                        No questions yet.
                                    </td>
                                </tr>
                            )}
                            {questionStats.map((q, i) => (
                                <tr key={q.id}>
                                    <td className="text-muted">{i + 1}</td>
                                    <td>{q.text}</td>
                                    <td dir="rtl" style={{ fontFamily: 'inherit' }}>{q.text_ar || '—'}</td>
                                    <td className="text-center">{q.count}</td>
                                    <td>{avgBadge(q.average)}</td>
                                    <td>
                                        <RatingBar dist={q.distribution} total={q.count} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </AdminLayout>
    );
}
