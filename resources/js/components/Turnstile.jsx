import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SCRIPT_ID = 'cf-turnstile-script';
const SITE_KEY  = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const Turnstile = forwardRef(function Turnstile({ onToken, onExpire }, ref) {
    const containerRef = useRef(null);
    const widgetIdRef  = useRef(null);

    const isDev = import.meta.env.DEV || !SITE_KEY;

    useImperativeHandle(ref, () => ({
        execute: () => {
            if (isDev) { onToken('dev-bypass'); return; }
            window.turnstile?.execute(widgetIdRef.current);
        },
        reset: () => {
            if (!isDev) window.turnstile?.reset(widgetIdRef.current);
        },
    }));

    useEffect(() => {
        if (isDev) return;

        const render = () => {
            if (!containerRef.current || !window.turnstile) return;
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey:            SITE_KEY,
                appearance:         'interaction-only',
                execution:          'execute',
                callback:           onToken,
                'expired-callback': onExpire,
                'error-callback':   onExpire,
            });
        };

        if (window.turnstile) {
            render();
        } else if (!document.getElementById(SCRIPT_ID)) {
            const script    = document.createElement('script');
            script.id       = SCRIPT_ID;
            script.src      = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async    = true;
            script.onload   = render;
            document.head.appendChild(script);
        } else {
            document.getElementById(SCRIPT_ID).addEventListener('load', render, { once: true });
        }

        return () => {
            if (widgetIdRef.current !== null && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, []);

    return <div ref={containerRef} />;
});

export default Turnstile;
