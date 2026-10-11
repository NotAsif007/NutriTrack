# Security Design & Audit Notes
## NutriTrack — Smart Calorie & Nutrition Tracker

---

## 1. Authentication Security Controls
* **Token Transport**: JWTs are placed inside HTTP-Only cookies with flags:
  * `httpOnly: true`: Blocks client-side JavaScript access (`document.cookie`), mitigating XSS token extraction.
  * `secure: process.env.NODE_ENV === 'production'`: Enforces HTTPS in production environments.
  * `sameSite: 'lax'` (or `'strict'`): Protects against unauthorized cross-origin forged requests.
* **Token Payload**: Contains only non-sensitive identifiers (`userId`). Never stores passwords, emails, or personal details in token payload.
* **Password Hashing**: Utilizes `bcryptjs` with a work factor of 10 rounds. Constant-time comparison protects against timing attacks.

---

## 2. Authorization & Data Isolation
* **Zero Trust User Ownership**: Every route operating on private models (`food_logs`, `weight_logs`, custom `foods`, `profile`) explicitly queries `{ _id: resourceId, userId: req.user.id }`.
* Cross-tenant read/write attempts are rejected with `404 Not Found` or `403 Forbidden` to prevent object enumeration.

---

## 3. Input Validation & Injection Defenses
* **Strict Schema Validation**: Zod parses and sanitizes all incoming bodies and query parameters.
* **NoSQL Injection Defense**: Strict type validation prevents passing MongoDB query operators (such as `{"$gt": ""}`) as input parameters.
* **XSS Sanitization**: User-submitted textual inputs (notes, names) are trimmed and output-encoded by React's native JSX escaping.

---

## 4. HTTP Headers & Rate Limiting
* **Helmet**: Standard security headers (Content Security Policy, X-Content-Type-Options, X-Frame-Options) enabled on the Express server.
* **Express Rate Limit**: Authentication routes (`/auth/login`, `/auth/register`) are rate-limited to 20 attempts per 15-minute window to deter brute-force attacks.
* **CORS**: Origin is restricted strictly to the client domain (`CLIENT_ORIGIN`), with `credentials: true`.
