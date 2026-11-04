# Security Policy: Crocs Visualizer

**Version:** 1.0.0-beta  

---

## 1. Supported Versions

| Version | Supported |
| :--- | :--- |
| `1.0.0-beta` | Yes |

---

## 2. Reporting a Vulnerability

If you discover a potential security vulnerability, please do **not** open a public issue. 

Instead, report it directly to the repository maintainer through private GitHub vulnerability reporting.

---

## 3. Security Standards

- **No Secrets in Client Bundles:** No private API keys or tokens are stored in the client application.
- **Client-Side Isolation:** The application is static and operates inside the browser sandbox using `localStorage`.
- **Dependency Auditing:** Automated dependency audits (`pnpm audit` / `npm audit`) are executed in CI workflows.
