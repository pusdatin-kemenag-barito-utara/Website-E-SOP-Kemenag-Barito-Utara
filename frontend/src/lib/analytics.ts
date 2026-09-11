/**
 * Google Analytics 4 & Google Tag Manager Event Tracking Hub
 * Stream: SOP Digital (https://sop.kemenag-baritoutara.com)
 * Stream ID: 15535920635
 * Measurement ID: G-4BS781XVQP
 * Google Tag ID: GT-NNVBZNJ7
 */

import { getEnv } from "./env";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const getGaMeasurementId = () => getEnv("PUBLIC_GA_MEASUREMENT_ID", "");
export const getGoogleTagId = () => getEnv("PUBLIC_GOOGLE_TAG_ID", "");

function getSendToIds(): string[] {
  const gaId = getGaMeasurementId();
  const tagId = getGoogleTagId();
  return [gaId, tagId].filter(Boolean);
}

/**
 * Send custom event to Google Analytics 4 & Google Tag
 */
export function trackEvent(action: string, params: Record<string, any> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      const sendTo = getSendToIds();
      window.gtag("event", action, {
        ...(sendTo.length > 0 ? { send_to: sendTo } : {}),
        ...params,
      });
    } catch (e) {
      console.debug("[Analytics] Event tracking error:", e);
    }
  }
}

/**
 * Track SPA / Page Navigation
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    try {
      const sendTo = getSendToIds();
      window.gtag("event", "page_view", {
        page_path: pagePath,
        page_title: pageTitle || document.title,
        ...(sendTo.length > 0 ? { send_to: sendTo } : {}),
      });
    } catch (e) {
      console.debug("[Analytics] Page view tracking error:", e);
    }
  }
}

/**
 * Track successful user authentication
 */
export function trackLogin(role: string, email?: string) {
  trackEvent("login", {
    method: "email_password",
    user_role: role,
    domain: email ? email.split("@")[1] : "kemenag.go.id",
  });
}

/**
 * Track SOP Create or Update
 */
export function trackSOPSave(title: string, activityCount: number, roleCount: number, isNew: boolean) {
  trackEvent(isNew ? "sop_create" : "sop_update", {
    sop_title: title,
    activity_count: activityCount,
    role_count: roleCount,
  });
}

/**
 * Track SOP Document Print or Export
 */
export function trackSOPPrint(title: string) {
  trackEvent("sop_print", {
    sop_title: title,
    format: "pdf_official",
  });
}

/**
 * Track SOP Document Deletion
 */
export function trackSOPDelete(title?: string) {
  trackEvent("sop_delete", {
    sop_title: title || "Unknown SOP",
  });
}

/**
 * Track PDF Compressor Tool Usage
 */
export function trackPDFCompress(originalSizeBytes: number, compressedSizeBytes: number) {
  const savingsPercent = originalSizeBytes > 0
    ? Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100)
    : 0;

  trackEvent("pdf_compress", {
    original_size_kb: Math.round(originalSizeBytes / 1024),
    compressed_size_kb: Math.round(compressedSizeBytes / 1024),
    savings_percent: savingsPercent,
  });
}
