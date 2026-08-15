"use client";

import { PageLoader } from "@/components/page-loader";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function isInternalNav(anchor: HTMLAnchorElement, currentPath: string) {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }
  if (url.origin !== window.location.origin) return false;
  const next = `${url.pathname}${url.search}`;
  const now = `${currentPath}${window.location.search}`;
  return next !== now;
}

export function NavigationLoader() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const startedAt = useRef(0);
  const hideTimer = useRef(0);
  const failSafe = useRef(0);
  pendingRef.current = pending;

  useEffect(() => {
    function begin() {
      window.clearTimeout(hideTimer.current);
      window.clearTimeout(failSafe.current);
      startedAt.current = Date.now();
      setPending(true);
      failSafe.current = window.setTimeout(() => setPending(false), 8000);
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor || !isInternalNav(anchor, pathname)) return;
      begin();
    }

    function onPopState() {
      begin();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [pathname]);

  useEffect(() => {
    if (!pendingRef.current) return;
    const remain = Math.max(0, 320 - (Date.now() - startedAt.current));
    hideTimer.current = window.setTimeout(() => setPending(false), remain);
    return () => window.clearTimeout(hideTimer.current);
  }, [pathname]);

  if (!pending) return null;

  const dark = pathname === "/" || pathname.includes("/room");
  return <PageLoader overlay variant={dark ? "dark" : "app"} />;
}
