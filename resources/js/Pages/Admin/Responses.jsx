import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Badge, Button, Card, Modal, Table } from 'react-bootstrap';
import AdminLayout from '@/Layouts/AdminLayout';

const EMOJI  = { 4: '😄', 3: '🙂', 2: '😐', 1: '🙁', 0: '😠' };
const LABELS = { 4: 'Excellent', 3: 'Good', 2: 'Neutral', 1: 'Poor', 0: 'Angry' };
const COLORS = { 4: 'success',  3: 'info',  2: 'warning', 1: 'warning', 0: 'danger' };

function QADetail({ qa }) {
    if (!Array.isArray(qa) || qa.length === 0)
        return <p className="text-muted">No answers recorded.</p>;
    return (
        <div>
            {qa.map((item, i) => {
                const val = parseInt(item.value ?? -1);
                return (
                    <div key={i} className="mb-3 p-3 rounded" style={{ background: '#f8f9fa' }}>
                        <div className="fw-semibold mb-1">
                            {i + 1}. {item.question?.text ?? '—'}
                        </div>
                        {item.question?.text_ar && (
                            <div className="text-muted small mb-2" dir="rtl">
                                {item.question.text_ar}
                            </div>
                        )}
                        <Badge bg={COLORS[val] ?? 'secondary'}>
                            {EMOJI[val] ?? '?'} {LABELS[val] ?? 'Unknown'} ({val})
                        </Badge>
                    </div>
                );
            })}
        </div>
    );
}

function AudioPlayer({ fileId, filename }) {
    const [error, setError] = useState(false);
    const src = `/admin/audio/${fileId}`;

    if (error) {
        return (
            <div className="text-danger small">
                ⚠ File not found on disk
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{filename}</div>
            </div>
        );
    }

    return (
        <div>
            <audio
                controls
                preload="none"
                onError={() => setError(true)}
                style={{
                    width: '100%',
                    height: 36,
                    borderRadius: 20,
                    outline: 'none',
                }}
            >
                <source src={src} type="audio/ogg" />
                <source src={src} type="audio/webm" />
                <source src={src} type="audio/mpeg" />
                Your browser does not support audio.
            </audio>
            <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                {filename}
            </div>
        </div>
    );
}

function decodePaginationLabel(label) {
    return label
        .replace(/&laquo;\s*/g, '« ')
        .replace(/\s*&raquo;/g, ' »')
        .replace(/&amp;/g, '&');
}

function Pagination({ links }) {
    return (
        <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination mb-0">
                {links.map((link, i) => (
                    <li key={i} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                        <Link
                            href={link.url ?? '#'}
                            className="page-link"
                            preserveScroll
                        >
                            {decodePaginationLabel(link.label)}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default function Responses({ files }) {
    const [selected, setSelected] = useState(null); // for QA detail modal

    return (
        <AdminLayout title="Responses">
            <Head title="Admin – Responses" />

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: 50 }}>#</th>
                                <th>Phone</th>
                                <th style={{ width: 110 }}>Type</th>
                                <th style={{ width: 170 }}>Date</th>
                                <th>Details / Recording</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center text-muted py-4">
                                        No responses yet.
                                    </td>
                                </tr>
                            )}
                            {files.data.map((file, i) => (
                                <tr key={file.id}>
                                    <td className="text-muted">{files.from + i}</td>
                                    <td>{file.phoneNo || <span className="text-muted">—</span>}</td>
                                    <td>
                                        {file.type === 'qa'
                                            ? <Badge bg="info">📝 Q&amp;A</Badge>
                                            : <Badge bg="secondary">🎙 Voice</Badge>
                                        }
                                    </td>
                                    <td className="text-muted small">
                                        {new Date(file.created_at).toLocaleString()}
                                    </td>
                                    <td style={{ minWidth: 240 }}>
                                        {file.type === 'qa' ? (
                                            <Button
                                                size="sm"
                                                variant="outline-primary"
                                                onClick={() => setSelected(file)}
                                            >
                                                View Answers
                                            </Button>
                                        ) : (
                                            file.fileAddress
                                                ? <AudioPlayer
                                                    fileId={file.id}
                                                    filename={file.fileAddress.split('/').pop()}
                                                  />
                                                : <span className="text-muted small">No file</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Pagination links={files.links} />

            {/* Q&A detail modal */}
            <Modal show={!!selected} onHide={() => setSelected(null)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        Q&amp;A — {selected?.phoneNo || 'Unknown'}&nbsp;
                        <span className="text-muted fs-6 fw-normal">
                            {selected && new Date(selected.created_at).toLocaleString()}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selected && <QADetail qa={selected.qa} />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
}
