# Security Specification for AgriData (test-database-01)

This document outlines the security invariants, threat vectors (the "Dirty Dozen"), and the security rule tests for the Firestore database.

## 1. Data Invariants
- **Plots (`/plots/{plotId}`)**:
  - Requires standard fields: `id`, `replication`, `cornVarieties`, `irrigationSystem`, `moisture`, `temperature`.
  - Creator ID (`createdBy`) must match `request.auth.uid`.
  - Soil moisture must be between 0 and 100.
  - Temperature must be between -10 and 60.
- **Login History (`/login_history/{logId}`)**:
  - Must record user login status and user identity.
  - Creator ID/auth context must exist.

## 2. The "Dirty Dozen" Payloads (Vulnerability Vector Matrix)
1. **Unauthenticated Plot Creation**: Trying to write a plot document without being signed in.
2. **Identity Spoofing**: Trying to write a plot with `createdBy` set to someone else's UID.
3. **Moisture Range Poisoning**: Writing a plot document with `moisture: 105`.
4. **Moisture Type Poisoning**: Writing a plot document with `moisture: "very_moist"`.
5. **Temperature Range Poisoning**: Writing a plot document with `temperature: 150`.
6. **Plot ID character poisoning**: Injected junk characters in Plot ID document paths.
7. **Bypassing App Restrictions**: Direct database update to modify immutable fields like `createdAt`.
8. **Blanket Query Reading**: Reading plots without specifying query constraints (forcing lists to match creator).
9. **Fake Login History injection**: Writing login history under another user's identity.
10. **Shadow Fields**: Plot payload containing secret administrative flags like `isAdmin: true` in user metadata.
11. **Empty Variety Selection**: Submitting empty arrays or arrays exceeding limit for `cornVarieties`.
12. **Future Timestamp Spoofing**: Setting `createdAt` to a custom future timestamp instead of `request.time`.

## 3. The Rules Implementation Plan
We will draft standard safe rules that protect these collections securely, validating authentication status and validating all types/sizes.
