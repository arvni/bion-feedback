import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { usePage } from '@inertiajs/react';

const SCRIPT_ID = 'cf-turnstile-script';

const Turnstile = forwardRef(function Turnstile({ onToken, onExpire }, ref) {
    const containerRef = useRef(null);
    const widgetIdRef  = useRef(null);
    const onTokenRef   = useRef(onToken);
    const onExpireRef  = useRef(onExpire);
    const siteKey      = usePage().props.turnstileSiteKey;

    const isDev = import.meta.env.DEV;

    // Keep refs up-to-date so the widget always calls the latest callbacks
    useEffect(() => { onTokenRef.current  = onToken;  }, [onToken]);
    useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

    useImperativeHandle(ref, () => ({
        execute: () => {
            if (isDev) { onTokenRef.current('dev-bypass'); return; }
            window.turnstile?.execute(widgetIdRef.current);
        },
        reset: () => {
            if (!isDev) window.turnstile?.reset(widgetIdRef.current);
        },
    }));

    useEffect(() => {
        if (isDev) return;

        if (!siteKey) {
            console.error('[Turnstile] turnstileSiteKey is not set. Add TURNSTILE_SITE_KEY to .env.');
            return;
        }

        const render = () => {
            if (!containerRef.current || !window.turnstile) return;
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey:            siteKey,
                appearance:         'interaction-only',
                execution:          'execute',
                callback:           (token) => onTokenRef.current(token),
                'expired-callback': ()      => onExpireRef.current(),
                'error-callback':   ()      => onExpireRef.current(),
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
