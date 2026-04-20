'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// --- Types ---
interface NavHistoryEntry {
  url: string;
  time: number;
}

// --- Helper: Send Data ---
const sendTelemetry = async (eventType: string, data: unknown) => {
  const payload = {
    event: eventType,
    data,
    timestamp: new Date().toISOString()
  };

  const response = await fetch("/api/telemetry", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    console.error("Failed to send telemetry");
  }

  // Use sendBeacon if available (best for avoiding cancelled requests during navigation)
  // if (navigator.sendBeacon) {
  //   navigator.sendBeacon('/api/telemetry', payload);
  // } else {
  //   fetch('/api/telemetry', { method: 'POST', body: payload, keepalive: true });
  // }
};

export default function Telemetry() {
  const pathname = usePathname();
  const hasMounted = useRef(false);

  // =========================================================================
  // EFFECT 1: DOM Event Listeners (TTFI, Rage Clicks, Dead Clicks)
  // =========================================================================
  useEffect(() => {
    // Prevent strict mode from double-mounting listeners in development
    if (hasMounted.current) return;
    hasMounted.current = true;

    // --- 1. Time to First Interaction (TTFI) ---
    const interactionEvents: (keyof DocumentEventMap)[] = ['click', 'keydown', 'touchstart'];

    const handleFirstInteraction = async (event: Event) => {
      const ttfi = performance.now();
      await sendTelemetry('first_interaction', {
        type: event.type,
        duration_ms: Math.round(ttfi)
      });

      // Cleanup: Remove listeners so this only fires once
      interactionEvents.forEach(type => {
        document.removeEventListener(type, handleFirstInteraction);
      });
    };

    interactionEvents.forEach(type => {
      document.addEventListener(type, handleFirstInteraction, { once: true });
    });


    // --- 2 & 3. Combined Click Listener (Rage & Dead Clicks) ---
    let clickCount = 0;
    let lastClickTime = 0;
    let lastClickedElement: Element | null = null;
    const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'DETAILS', 'SUMMARY'];

    const handleDocumentClick = async (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target) return;

      const currentTime = Date.now();

      // -> Rage Click Logic
      if (target === lastClickedElement && (currentTime - lastClickTime) < 1000) {
        clickCount++;
        if (clickCount >= 3) {
          await sendTelemetry('rage_click', {
            element: target.tagName,
            className: target.className
          });
          clickCount = 0; // Reset to prevent spam
        }
      } else {
        clickCount = 1;
        lastClickedElement = target;
      }
      lastClickTime = currentTime;

      // -> Dead Click Logic
      const isInteractive = target.closest(interactiveTags.join(','));
      // Optional chaining used safely here for getComputedStyle
      const hasPointerCursor = window.getComputedStyle(target)?.cursor === 'pointer';

      if (!isInteractive && !hasPointerCursor) {
        await sendTelemetry('dead_click', {
          element: target.tagName,
          className: target.className
        });
      }
    };

    document.addEventListener('click', handleDocumentClick);

    // Cleanup global click listener on unmount
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // =========================================================================
  // EFFECT 2: Route Change Listener (Pogo-Sticking)
  // =========================================================================
  useEffect(() => {
    // We only want to track this in the browser
    if (typeof window === 'undefined') return;

    const currentTime = Date.now();
    const rawHistory = sessionStorage.getItem('navHistory');
    const navHistory: NavHistoryEntry[] = rawHistory ? JSON.parse(rawHistory) : [];

    navHistory.push({ url: pathname, time: currentTime });

    // Check for A -> B -> A pattern
    if (navHistory.length >= 3) {
      const current = navHistory[navHistory.length - 1];
      const previous = navHistory[navHistory.length - 2];
      const previousPrevious = navHistory[navHistory.length - 3];

      const isSamePage = current.url === previousPrevious.url;
      const isRapid = (current.time - previousPrevious.time) < 15000; // 15 seconds

      // If they went Hub -> Detail -> Hub rapidly
      if (isSamePage && current.url !== previous.url && isRapid) {
        sendTelemetry('pogo_sticking', {
          bounce_page: previous.url,
          hub_page: current.url,
          duration_ms: current.time - previousPrevious.time
        });
      }
    }

    // Keep history array capped at 5 entries to save memory
    if (navHistory.length > 5) {
      navHistory.shift();
    }
    sessionStorage.setItem('navHistory', JSON.stringify(navHistory));
  }, [pathname]); // This effect triggers every time the URL path changes

  // Component renders nothing to the DOM
  return null;
}
