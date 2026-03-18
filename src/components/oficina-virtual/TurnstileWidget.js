import { useEffect, useRef } from 'react';

export default function TurnstileWidget({ siteKey, onSuccess, onError, onExpire, resetSignal = 0 }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const callbackRef = useRef(onSuccess);
  const errorRef = useRef(onError);
  const expireRef = useRef(onExpire);

  useEffect(() => { callbackRef.current = onSuccess; }, [onSuccess]);
  useEffect(() => { errorRef.current = onError; }, [onError]);
  useEffect(() => { expireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (!siteKey) return;
    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted) return;
      if (containerRef.current && window.turnstile && widgetIdRef.current === null) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => { if (callbackRef.current) callbackRef.current(token); },
          'error-callback': () => { if (errorRef.current) errorRef.current(); },
          'expired-callback': () => { if (expireRef.current) expireRef.current(); },
        });
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.querySelector('script[data-turnstile]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        script.dataset.turnstile = 'true';
        document.head.appendChild(script);
      }
      script.addEventListener('load', renderWidget, { once: true });
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetSignal]);

  return <div ref={containerRef} />;
}
