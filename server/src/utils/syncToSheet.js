/**
 * Google Sheets Live Sync Utility
 * 
 * Sends application data to a Google Apps Script Webhook.
 * The webhook appends the row to the RAW_DATA sheet, and
 * per-company tabs auto-update via QUERY formulas.
 * 
 * This is a "fire and forget" — it never blocks the main request.
 * If Google is down, the application still saves to MySQL.
 */

import process from 'process';

/**
 * Syncs a new application to the Google Sheet webhook.
 * @param {object} data - The enriched application data (joined with role/company)
 */
export async function syncApplicationToSheet(data) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  // Silently skip if the webhook URL is not configured
  if (!webhookUrl || webhookUrl === 'YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE') {
    return;
  }

  const payload = {
    timestamp:   new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    company:     data.company     || 'Unknown',
    location:    data.jobLocation || 'Unknown',
    role:        data.roleTitle   || 'Unknown',
    name:        data.name        || '',
    phone:       data.phone       || '',
    city:        data.city        || 'Not specified',
    experience:  data.experience  || 'Not specified',
    status:      data.status      || 'New',
  };

  // Fire and forget — we do NOT await this in the calling code
  fetch(webhookUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  .then(res => {
    if (!res.ok) console.warn('[Google Sheets Sync] Webhook responded with status:', res.status);
    else console.log('[Google Sheets Sync] ✅ Row synced for:', data.name, '→', data.company);
  })
  .catch(err => {
    // Non-fatal: just log, never crash the main app
    console.warn('[Google Sheets Sync] ⚠️ Failed to sync (Google may be unreachable):', err.message);
  });
}
