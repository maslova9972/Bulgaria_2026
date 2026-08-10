var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/referralPartners.js
var referralPartners = Object.freeze([
  { name: "\u041D\u0430\u0442\u0430\u043B\u044C\u044F \u0412\u0438\u0434\u044E\u043B", slug: "natalia-vidiul", image: "natalia-vidiul.jpg" },
  { name: "\u0412\u0438\u043A\u0442\u043E\u0440\u0438\u044F \u0411\u0430\u0442\u0443\u043B\u0438\u043D\u0430", slug: "viktoria-batulina", image: "viktoria-batulina.jpg" },
  { name: "\u0415\u043B\u0435\u043D\u0430 \u041A\u0438\u0432\u0430", slug: "elena-kiva", image: "elena-kiva.jpg" },
  { name: "\u0422\u0430\u0442\u044C\u044F\u043D\u0430 \u0428\u0430\u043F\u043E\u0432\u0430\u043B\u043E\u0432\u0430", slug: "tatiana-shapovalova", image: "tatiana-shapovalova.jpg" },
  { name: "\u0413\u0430\u043B\u0438\u043D\u0430 \u041B\u0443\u043D\u0438\u043D\u0430", slug: "galina-lunina", image: "galina-lunina.jpg" },
  { name: "\u041D\u0430\u0434\u0435\u0436\u0434\u0430 \u041C\u0438\u043A\u043E\u043B\u044E\u043A", slug: "nadiia-mykoliuk", image: "nadiia-mykoliuk-bright.jpg" },
  { name: "\u041D\u0430\u0442\u0430\u043B\u044C\u044F \u041C\u0430\u0441\u043B\u043E\u0432\u0430", slug: "natalia-maslova", image: "natalia-maslova-crop2.jpg" },
  { name: "\u0422\u0430\u0442\u044C\u044F\u043D\u0430 \u0421\u0442\u0438\u0445\u0430\u0440\u0435\u0432\u0430", slug: "tatiana-stikhareva", image: "tatiana-stikhareva.jpg" },
  { name: "\u0422\u0430\u043C\u0430\u0440\u0430 \u0413\u0443\u0441\u0435\u0432\u0430", slug: "tamara-guseva", image: "tamara-guseva.jpg" }
]);
var referralPartnerSlugs = Object.freeze(referralPartners.map(({ slug }) => slug));
function findReferralPartner(slug) {
  return referralPartners.find((partner) => partner.slug === slug) || null;
}
__name(findReferralPartner, "findReferralPartner");

// worker/src/index.js
var MAX_BODY_BYTES = 16 * 1024;
var ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
var MAX_FUTURE_SKEW_MS = 5 * 60 * 1e3;
var CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/g;
var referralSlugSet = new Set(referralPartnerSlugs);
var participationFormats = Object.freeze({
  forum: "\u0422\u043E\u043B\u044C\u043A\u043E \u0444\u043E\u0440\u0443\u043C \xB7 25 \u20AC",
  "package-1": "\u041F\u043E\u043B\u043D\u044B\u0439 \u043F\u0430\u043A\u0435\u0442 \xB7 1 \u0447\u0435\u043B\u043E\u0432\u0435\u043A \xB7 500 \u20AC",
  "package-2": "\u041F\u043E\u043B\u043D\u044B\u0439 \u043F\u0430\u043A\u0435\u0442 \xB7 2 \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430 \xB7 700 \u20AC",
  "package-3": "\u041F\u043E\u043B\u043D\u044B\u0439 \u043F\u0430\u043A\u0435\u0442 \xB7 3 \u0447\u0435\u043B\u043E\u0432\u0435\u043A\u0430 \xB7 800 \u20AC",
  presentation: "\u0421\u0430\u043C\u043E\u043F\u0440\u0435\u0437\u0435\u043D\u0442\u0430\u0446\u0438\u044F \u043D\u0430 \u0444\u043E\u0440\u0443\u043C\u0435",
  undecided: "\u0415\u0449\u0451 \u0432\u044B\u0431\u0438\u0440\u0430\u044E \u0444\u043E\u0440\u043C\u0430\u0442"
});
var airtableFields = Object.freeze({
  name: "fld1eqRAgP8JINqNU",
  status: "fldGcoLL7MbsxcYqM",
  telegram: "fld2xm3nFNNe9LuYS",
  phone: "fldyyERZ7DWP7V4c9",
  email: "fldm5kb8syFzU6yA3",
  country: "fldBMRn1ayyJ0NM6S",
  participation: "fldBHweTFv66wTX6F",
  paymentStatus: "fldPRC97zQ5YEJszM",
  comment: "fld7INg5mP0v63ny2",
  consent: "fldCpEEc0B6XXYab3",
  refFirst: "fldMuDqK3zJrV3KHI",
  refLast: "flddDTr3yKdfjTbm3",
  creditedRef: "fldGs489tE1WSyoii",
  referrerName: "fldsg7WxZc8RCpE2u",
  utmSourceFirst: "fld05fVqziWhcjuZc",
  utmSourceLast: "fldxxXpWy2v9iydW3",
  utmMediumFirst: "fldebFEpddhOLC6w7",
  utmMediumLast: "fldpvOxrf57xiDDc8",
  utmCampaignFirst: "fldURsEtBWKB12hZf",
  utmCampaignLast: "fldgIuKgk2fGJDcze",
  utmContentFirst: "fldUNyg2arol016I0",
  utmContentLast: "fldUFBjnA7VepRd9J",
  utmTermFirst: "fldmrTq5YpRhk0VcD",
  utmTermLast: "fldmvBgFRofravqMb",
  landingFirst: "fldlpcITY18Z9F1l8",
  landingLast: "fldQUAVLw6hY0RCKm",
  touchAtFirst: "fldY5W7ziCvvNMx4J",
  touchAtLast: "fldgj1lc5KrYhuCTj",
  currentPath: "fldFwjiiH38eIY7ID"
});
function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARACTERS, "").trim().slice(0, maxLength);
}
__name(cleanText, "cleanText");
function normalizedLength(value) {
  if (typeof value !== "string") return 0;
  return value.replace(CONTROL_CHARACTERS, "").trim().length;
}
__name(normalizedLength, "normalizedLength");
function parseList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String).map((item) => item.trim()).filter(Boolean);
    } catch {
      return [];
    }
  }
  return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
}
__name(parseList, "parseList");
function securityHeaders(origin, isAllowedOrigin) {
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff"
  };
  if (isAllowedOrigin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }
  return headers;
}
__name(securityHeaders, "securityHeaders");
function jsonResponse(payload, status, origin, isAllowedOrigin, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...securityHeaders(origin, isAllowedOrigin), ...extraHeaders }
  });
}
__name(jsonResponse, "jsonResponse");
async function readBodyWithLimit(request) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) throw Object.assign(new Error("PAYLOAD_TOO_LARGE"), { status: 413 });
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw Object.assign(new Error("PAYLOAD_TOO_LARGE"), { status: 413 });
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}
__name(readBodyWithLimit, "readBodyWithLimit");
function normalizeReferral(value) {
  const slug = cleanText(value, 64).toLowerCase();
  return referralSlugSet.has(slug) ? slug : "";
}
__name(normalizeReferral, "normalizeReferral");
function normalizeCampaign(value) {
  return normalizedLength(value) <= 128 ? cleanText(value, 128) : "";
}
__name(normalizeCampaign, "normalizeCampaign");
function normalizePath(value) {
  const path = cleanText(value, 240);
  return normalizedLength(value) <= 240 && path.startsWith("/") ? path : "";
}
__name(normalizePath, "normalizePath");
function normalizeTimestamp(value, now) {
  if (typeof value !== "string") return "";
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "";
  if (timestamp > now + MAX_FUTURE_SKEW_MS || now - timestamp > ATTRIBUTION_TTL_MS) return "";
  return new Date(timestamp).toISOString();
}
__name(normalizeTimestamp, "normalizeTimestamp");
function normalizeAttribution(value, now) {
  const attribution = value && typeof value === "object" ? value : {};
  const refFirst = normalizeReferral(attribution.ref_first);
  const refLast = normalizeReferral(attribution.ref_last);
  const creditedRef = refLast || refFirst;
  return {
    ref_first: refFirst,
    ref_last: refLast,
    credited_ref: creditedRef,
    referrer_name: findReferralPartner(creditedRef)?.name || "",
    utm_source_first: normalizeCampaign(attribution.utm_source_first),
    utm_source_last: normalizeCampaign(attribution.utm_source_last),
    utm_medium_first: normalizeCampaign(attribution.utm_medium_first),
    utm_medium_last: normalizeCampaign(attribution.utm_medium_last),
    utm_campaign_first: normalizeCampaign(attribution.utm_campaign_first),
    utm_campaign_last: normalizeCampaign(attribution.utm_campaign_last),
    utm_content_first: normalizeCampaign(attribution.utm_content_first),
    utm_content_last: normalizeCampaign(attribution.utm_content_last),
    utm_term_first: normalizeCampaign(attribution.utm_term_first),
    utm_term_last: normalizeCampaign(attribution.utm_term_last),
    landing_first: normalizePath(attribution.landing_first),
    landing_last: normalizePath(attribution.landing_last),
    touch_at_first: normalizeTimestamp(attribution.touch_at_first, now),
    touch_at_last: normalizeTimestamp(attribution.touch_at_last, now),
    current_path: normalizePath(attribution.current_path)
  };
}
__name(normalizeAttribution, "normalizeAttribution");
function splitAlternateContact(value) {
  const contact = cleanText(value, 254);
  if (!contact) return { email: "", phone: "" };
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  return looksLikeEmail ? { email: contact, phone: "" } : { email: "", phone: contact };
}
__name(splitAlternateContact, "splitAlternateContact");
function validateLeadPayload(payload, now = Date.now()) {
  const values = payload && typeof payload === "object" ? payload : {};
  const fieldErrors = {};
  const name = cleanText(values.name, 80);
  const telegram = cleanText(values.telegram, 80);
  const alternateContact = cleanText(values.alternate_contact, 254);
  const country = cleanText(values.country, 80);
  const comment = cleanText(values.comment, 1e3);
  const participationKey = typeof values.participation === "string" && Object.hasOwn(participationFormats, values.participation) ? values.participation : "";
  const participation = participationKey ? participationFormats[participationKey] : "";
  if (name.length < 2 || normalizedLength(values.name) > 80) fieldErrors.name = "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0438\u043C\u044F.";
  if (!telegram && !alternateContact) fieldErrors.telegram = "\u0423\u043A\u0430\u0436\u0438\u0442\u0435 Telegram \u0438\u043B\u0438 \u0434\u0440\u0443\u0433\u043E\u0439 \u043A\u043E\u043D\u0442\u0430\u043A\u0442.";
  if (normalizedLength(values.telegram) > 80) fieldErrors.telegram = "\u0421\u043E\u043A\u0440\u0430\u0442\u0438\u0442\u0435 Telegram \u0434\u043E 80 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.";
  if (normalizedLength(values.alternate_contact) > 254) fieldErrors.alternateContact = "\u0421\u043E\u043A\u0440\u0430\u0442\u0438\u0442\u0435 \u043A\u043E\u043D\u0442\u0430\u043A\u0442.";
  if (normalizedLength(values.country) > 80) fieldErrors.country = "\u0421\u043E\u043A\u0440\u0430\u0442\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0441\u0442\u0440\u0430\u043D\u044B.";
  if (!participation) fieldErrors.participation = "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0444\u043E\u0440\u043C\u0430\u0442 \u0443\u0447\u0430\u0441\u0442\u0438\u044F.";
  if (normalizedLength(values.comment) > 1e3) fieldErrors.comment = "\u0421\u043E\u043A\u0440\u0430\u0442\u0438\u0442\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u0434\u043E 1000 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.";
  if (values.consent !== true) fieldErrors.consent = "\u041D\u0443\u0436\u043D\u043E \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u043D\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0443 \u0437\u0430\u044F\u0432\u043A\u0438.";
  return {
    fieldErrors,
    lead: {
      name,
      telegram,
      alternateContact,
      country,
      comment,
      participationKey,
      participation,
      attribution: normalizeAttribution(values.attribution, now),
      companyWebsite: cleanText(values.company_website, 120)
    }
  };
}
__name(validateLeadPayload, "validateLeadPayload");
function setIfPresent(fields, fieldId, value) {
  if (value !== "" && value !== void 0 && value !== null) fields[fieldId] = value;
}
__name(setIfPresent, "setIfPresent");
function buildAirtableFields(lead) {
  const { email, phone } = splitAlternateContact(lead.alternateContact);
  const fields = {
    [airtableFields.name]: lead.name,
    [airtableFields.status]: "\u041D\u043E\u0432\u0430\u044F",
    [airtableFields.participation]: lead.participation,
    [airtableFields.paymentStatus]: "\u041D\u0435 \u0432\u044B\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043E",
    [airtableFields.consent]: true
  };
  setIfPresent(fields, airtableFields.telegram, lead.telegram);
  setIfPresent(fields, airtableFields.phone, phone);
  setIfPresent(fields, airtableFields.email, email);
  setIfPresent(fields, airtableFields.country, lead.country);
  setIfPresent(fields, airtableFields.comment, lead.comment);
  const attributionMapping = {
    ref_first: airtableFields.refFirst,
    ref_last: airtableFields.refLast,
    credited_ref: airtableFields.creditedRef,
    referrer_name: airtableFields.referrerName,
    utm_source_first: airtableFields.utmSourceFirst,
    utm_source_last: airtableFields.utmSourceLast,
    utm_medium_first: airtableFields.utmMediumFirst,
    utm_medium_last: airtableFields.utmMediumLast,
    utm_campaign_first: airtableFields.utmCampaignFirst,
    utm_campaign_last: airtableFields.utmCampaignLast,
    utm_content_first: airtableFields.utmContentFirst,
    utm_content_last: airtableFields.utmContentLast,
    utm_term_first: airtableFields.utmTermFirst,
    utm_term_last: airtableFields.utmTermLast,
    landing_first: airtableFields.landingFirst,
    landing_last: airtableFields.landingLast,
    touch_at_first: airtableFields.touchAtFirst,
    touch_at_last: airtableFields.touchAtLast,
    current_path: airtableFields.currentPath
  };
  for (const [key, fieldId] of Object.entries(attributionMapping)) {
    setIfPresent(fields, fieldId, lead.attribution[key]);
  }
  return fields;
}
__name(buildAirtableFields, "buildAirtableFields");
async function verifyTurnstile(token, request, env, fetchImpl) {
  if (!env.TURNSTILE_SECRET) return { ok: true };
  if (!token) return { ok: false };
  const formData = new FormData();
  formData.set("secret", env.TURNSTILE_SECRET);
  formData.set("response", token);
  formData.set("remoteip", request.headers.get("CF-Connecting-IP") || "");
  formData.set("idempotency_key", crypto.randomUUID());
  let response;
  try {
    response = await fetchImpl("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData
    });
  } catch {
    return { ok: false, unavailable: true };
  }
  if (!response.ok) return { ok: false, unavailable: true };
  const result = await response.json();
  const allowedHostnames = parseList(env.TURNSTILE_HOSTNAMES);
  const expectedAction = env.TURNSTILE_ACTION || "lead_submit";
  const hostnameMatches = !allowedHostnames.length || allowedHostnames.includes(result.hostname);
  return {
    ok: Boolean(result.success && hostnameMatches && result.action === expectedAction)
  };
}
__name(verifyTurnstile, "verifyTurnstile");
async function handleRequest(request, env, { fetchImpl = fetch, now = Date.now() } = {}) {
  const requestId = crypto.randomUUID();
  const url = new URL(request.url);
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = parseList(env.ALLOWED_ORIGINS);
  const isAllowedOrigin = Boolean(origin && allowedOrigins.includes(origin));
  if (url.pathname !== "/api/leads") {
    return jsonResponse({ ok: false, code: "NOT_FOUND", requestId }, 404, origin, isAllowedOrigin);
  }
  if (!isAllowedOrigin) {
    return jsonResponse({ ok: false, code: "ORIGIN_NOT_ALLOWED", requestId }, 403, origin, false);
  }
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: securityHeaders(origin, true) });
  }
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, code: "METHOD_NOT_ALLOWED", requestId }, 405, origin, true);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ ok: false, code: "UNSUPPORTED_MEDIA_TYPE", requestId }, 415, origin, true);
  }
  let payload;
  try {
    const body = await readBodyWithLimit(request);
    payload = JSON.parse(body);
  } catch (error) {
    const status = error.status === 413 ? 413 : 400;
    const code = status === 413 ? "PAYLOAD_TOO_LARGE" : "INVALID_JSON";
    return jsonResponse({ ok: false, code, requestId }, status, origin, true);
  }
  const { fieldErrors, lead } = validateLeadPayload(payload, now);
  if (lead.companyWebsite) {
    return jsonResponse({ ok: true, requestId }, 201, origin, true);
  }
  if (Object.keys(fieldErrors).length) {
    return jsonResponse({ ok: false, code: "VALIDATION_ERROR", fieldErrors, requestId }, 422, origin, true);
  }
  const turnstile = await verifyTurnstile(cleanText(payload.turnstile_token, 2048), request, env, fetchImpl);
  if (!turnstile.ok) {
    const status = turnstile.unavailable ? 503 : 400;
    const code = turnstile.unavailable ? "BOT_CHECK_UNAVAILABLE" : "BOT_CHECK_FAILED";
    return jsonResponse({ ok: false, code, requestId }, status, origin, true);
  }
  if (!env.AIRTABLE_TOKEN || !env.AIRTABLE_BASE_ID || !env.AIRTABLE_TABLE_ID) {
    return jsonResponse({ ok: false, code: "SERVICE_NOT_CONFIGURED", requestId }, 502, origin, true);
  }
  const airtableUrl = `https://api.airtable.com/v0/${encodeURIComponent(env.AIRTABLE_BASE_ID)}/${encodeURIComponent(env.AIRTABLE_TABLE_ID)}`;
  const fields = buildAirtableFields(lead);
  let airtableResponse;
  try {
    airtableResponse = await fetchImpl(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ records: [{ fields }], typecast: false })
    });
  } catch {
    return jsonResponse({ ok: false, code: "CRM_UNAVAILABLE", requestId }, 503, origin, true);
  }
  if (!airtableResponse.ok) {
    const temporary = airtableResponse.status === 429 || airtableResponse.status >= 500;
    return jsonResponse(
      { ok: false, code: temporary ? "CRM_UNAVAILABLE" : "CRM_SCHEMA_ERROR", requestId },
      temporary ? 503 : 502,
      origin,
      true,
      temporary ? { "Retry-After": "10" } : {}
    );
  }
  return jsonResponse({ ok: true, requestId }, 201, origin, true);
}
__name(handleRequest, "handleRequest");
var index_default = {
  fetch(request, env) {
    return handleRequest(request, env);
  }
};
export {
  buildAirtableFields,
  index_default as default,
  handleRequest,
  validateLeadPayload
};
//# sourceMappingURL=index.js.map
