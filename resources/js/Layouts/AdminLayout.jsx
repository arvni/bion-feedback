import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';

const navItems = [
    { label: 'Dashboard',  href: '/admin',           icon: '📊' },
    { label: 'Questions',  href: '/admin/questions',  icon: '❓' },
    { label: 'Responses',  href: '/admin/responses',  icon: '📋' },
];

export default function AdminLayout({ children, title }) {
    const current = window.location.pathname.replace(/\/$/, '') || '/admin';

    const logout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f6fb' }}>
            {/* Top navbar */}
            <Navbar bg="dark" variant="dark" expand="lg" className="px-3 py-2" style={{ zIndex: 100 }}>
                <Navbar.Brand href="/admin" className="fw-bold fs-5">
                    🎙 Voice Record Admin
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="admin-nav" />
                <Navbar.Collapse id="admin-nav">
                    <Nav className="me-auto">
                        {navItems.map(item => (
                            <Nav.Link
                                key={item.href}
                                as={Link}
                                href={item.href}
                                className={current === item.href ? 'text-white fw-semibold' : 'text-secondary'}
                            >
                                {item.icon} {item.label}
                            </Nav.Link>
                        ))}
                    </Nav>
                    <Nav>
                        <Nav.Link href="#" onClick={logout} className="text-danger">
                            Logout
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            {/* Page content */}
            <main className="flex-grow-1 py-4">
                <Container fluid="lg">
                    {title && (
                        <h4 className="mb-4 fw-bold text-dark">{title}</h4>
                    )}
                    {children}
                </Container>
            </main>
        </div>
    );
}
