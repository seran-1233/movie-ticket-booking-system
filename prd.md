# Product Requirements Document (PRD)
## Movie Ticket Booking and Management System

| Field | Detail |
|---|---|
| **Document Type** | Product Requirements Document (PRD) |
| **Platform** | Pega Platform (Low-Code / App Studio) |
| **Blueprint Reference** | BP-2415415 |
| **Application Type** | Customer Engagement + Case Management |
| **Prepared For** | Pega Internship Project |
| **Prepared By** | Karthik Rajalee |
| **Version** | 1.0 |
| **Status** | Draft for Review |
| **Industry Context** | Media & Entertainment (Cinema Chain), classified as "Other" in Blueprint |
| **Target Geography** | India |
| **Primary Language** | English |

---

## 1. Executive Summary

The **Movie Ticket Booking and Management System** is a Pega low-code application designed to digitize and automate the end-to-end lifecycle of cinema ticket booking for a multi-theater cinema chain. The application enables customers to browse currently showing movies, select a showtime and theater, choose seats, and complete payment to receive a QR-code-based digital ticket. On the operations side, theater staff and booking managers can manage showtimes, monitor daily bookings, control seat inventory, and process cancellations and refunds.

The system is built on Pega's Case Management framework, where a **booking is modeled as a case** that flows through defined stages (Movie Selection → Seat Selection → Payment → Confirmation), giving the business full visibility, auditability, and control over every transaction — capabilities that a traditional stateless booking engine does not provide out of the box.

This PRD translates the Pega Blueprint output (6 personas, 4 core workflows, 9 data objects) into a structured, implementation-ready specification, and includes an analysis of why the Pega low-code platform is well suited to this use case.

---

## 2. Problem Statement

Cinema chains that rely on manual counter sales, fragmented booking spreadsheets, or legacy monolithic booking systems face:

- No unified, real-time view of seat inventory across theaters and showtimes.
- Manual, error-prone cancellation and refund handling.
- Poor auditability — no standard "case" trail of who booked what, when, and what changed.
- Slow time-to-market for new business rules (e.g., dynamic pricing, promotions) because logic is hardcoded.
- Disconnected reporting for management (occupancy, revenue, cancellations).

**Goal:** Deliver a single Pega application that unifies customer-facing booking with backend operational case management, so that every booking, cancellation, and refund is a governed, trackable case rather than an untracked database transaction.

---

## 3. Objectives

1. Allow customers to self-serve: browse movies, select showtime/theater/seats, pay, and instantly receive a digital ticket.
2. Give theater staff a real-time operational view of bookings and seat availability.
3. Give booking managers control over showtime creation, scheduling, and inventory.
4. Automate cancellations: release seats back to inventory and trigger refunds without manual intervention.
5. Provide finance with a governed refund/payment reconciliation process.
6. Provide marketing/management with booking analytics for demand and revenue insight.
7. Demonstrate Pega low-code capabilities: case lifecycle management, stage-based workflow automation, data modeling, persona-based access, and reporting — all configured with minimal custom code.

---

## 4. Scope

### 4.1 In Scope
- Customer-facing movie browsing and booking journey.
- Seat selection and real-time inventory locking.
- Payment capture and confirmation.
- Digital ticket generation with QR code.
- Showtime and theater management (staff/admin side).
- Booking cancellation workflow with automatic seat release and refund case.
- Booking analytics/reporting.
- Role-based access for 6 personas.

### 4.2 Out of Scope (Phase 1)
- Loyalty/rewards programs.
- Third-party OTT or multiplex aggregator integrations (e.g., BookMyShow-style syndication).
- Dynamic/surge pricing engine (can be a Phase 2 enhancement using Pega Decisioning).
- Physical box-office hardware/kiosk integration.
- Multi-currency/international payment gateways.

---

## 5. Stakeholders and Personas

Per the Blueprint definition, the application is designed around **6 personas**, each mapped to specific access rights and workflows in Pega (Access Groups / Work Groups in Pega terms).

| # | Persona | Role Description | Primary Channel | Key Interactions |
|---|---|---|---|---|
| 1 | **Customer** | End user booking movie tickets | Web / Mobile (self-service portal) | Browse movies, select showtime/seat, pay, receive ticket, cancel booking |
| 2 | **Theater Staff** | On-ground cinema staff | Internal web portal | View daily bookings, verify tickets/QR codes, manage seat availability |
| 3 | **Booking Manager** | Oversees booking operations across theaters | Internal web portal | Manage showtimes, monitor booking volumes, handle escalations |
| 4 | **Finance Officer** | Manages payments and refunds | Internal web portal | Reconcile payment transactions, approve/process refunds |
| 5 | **Marketing Analyst** | Analyzes booking trends | Internal reporting portal | View booking analytics, occupancy trends, campaign performance |
| 6 | **Application Control Agent** | System/application administrator | Pega Admin Studio | Manage users, access groups, monitor system health, configure rules |

---

## 6. Case Lifecycle (Stage-Based Workflow)

The core case type, **Ticket Booking**, follows the Blueprint-defined stage model:

```
[Movie Selection] → [Seat Selection] → [Payment] → [Confirmation]
```

| Stage | Description | Exit Criteria |
|---|---|---|
| **Movie Selection** | Customer browses currently showing movies and selects one, along with theater and showtime | Movie, theater, and showtime selected |
| **Seat Selection** | Customer views real-time seat map and selects available seat(s); seats are soft-locked to prevent double booking | Seats selected and reserved (temporary hold) |
| **Payment** | Customer completes payment via integrated payment gateway | Payment Transaction status = Success |
| **Confirmation** | System generates a Digital Ticket with QR code and sends confirmation to customer | Digital Ticket generated and dispatched |

**Case Resolution:** The case resolves as **Booking Confirmed**. If payment fails, the case can loop back to Payment or resolve as **Booking Failed** (with seat hold released after timeout). If a customer cancels post-confirmation, a linked **Booking Cancellation** case is triggered.

---

## 7. Functional Requirements — Workflows

The Blueprint defines **4 core workflows (case types)**. Each is detailed below with functional requirements suitable for App Studio configuration.

### 7.1 Ticket Booking (Primary Case Type)

| ID | Requirement |
|---|---|
| FR-1.1 | System shall display a list of currently showing movies with poster, genre, language, and duration. |
| FR-1.2 | System shall allow filtering movies by theater, city, date, and language. |
| FR-1.3 | System shall display available showtimes for a selected movie and theater. |
| FR-1.4 | System shall render a real-time seat map reflecting current seat availability (Available / Held / Booked). |
| FR-1.5 | System shall place a temporary hold on selected seats for a configurable timeout window (e.g., 5–10 minutes) to prevent double-booking. |
| FR-1.6 | System shall integrate with a payment gateway to capture and confirm payment. |
| FR-1.7 | Upon successful payment, system shall auto-generate a Digital Ticket record with a unique QR code. |
| FR-1.8 | System shall send the digital ticket to the customer via email/SMS/app notification. |
| FR-1.9 | System shall release seat holds automatically if payment is not completed within the timeout window. |

### 7.2 Show Management

| ID | Requirement |
|---|---|
| FR-2.1 | Booking Manager/Theater Staff shall be able to create, edit, and deactivate showtimes for a given movie and theater/screen. |
| FR-2.2 | System shall validate that showtimes for the same screen do not overlap (buffer time for cleaning/entry). |
| FR-2.3 | System shall allow configuration of seat layout per theater/screen (rows, columns, seat categories e.g., Standard/Premium/Recliner). |
| FR-2.4 | System shall allow staff to view and update real-time seat availability per showtime. |
| FR-2.5 | System shall support bulk showtime creation for recurring schedules (e.g., daily 6 PM show for a week). |

### 7.3 Booking Cancellation

| ID | Requirement |
|---|---|
| FR-3.1 | Customer shall be able to cancel a confirmed booking prior to the showtime, subject to a configurable cancellation window/policy. |
| FR-3.2 | Upon cancellation, system shall automatically release the associated seats back into available inventory. |
| FR-3.3 | System shall automatically create a linked **Refund** case for the Finance Officer to process (or auto-approve based on policy). |
| FR-3.4 | System shall update the Digital Ticket status to "Cancelled" and invalidate its QR code. |
| FR-3.5 | System shall notify the customer of cancellation confirmation and expected refund timeline. |
| FR-3.6 | System shall enforce business rules (e.g., no cancellation within X hours of showtime) via Pega decision rules. |

### 7.4 Booking Analytics

| ID | Requirement |
|---|---|
| FR-4.1 | System shall provide dashboards showing bookings per movie, per theater, and per showtime. |
| FR-4.2 | System shall report seat occupancy rate per showtime/theater. |
| FR-4.3 | System shall report cancellation rate and refund volume over configurable time periods. |
| FR-4.4 | System shall provide revenue reporting by movie, theater, and date range. |
| FR-4.5 | Marketing Analyst shall be able to export reports and view trend visualizations. |
| FR-4.6 | Reports shall be built using Pega's native reporting (Report Definitions / Pega Insights or Constellation reporting widgets) without custom code. |

---

## 8. Data Model (9 Data Objects)

Per the Blueprint, the application is backed by **9 data objects**, each configured as a System of Record (Pega Local) unless integrated with an external core system in later phases.

| # | Data Object | Purpose | Key Attributes (indicative) | Relationships |
|---|---|---|---|---|
| 1 | **Customer** | Stores customer profile | CustomerID, Name, Email, Phone, PreferredLanguage | 1 – Many → Booking |
| 2 | **Movie** | Movie catalog | MovieID, Title, Genre, Language, Duration, Rating, PosterURL, Status (Showing/Upcoming) | 1 – Many → Showtime |
| 3 | **Showtime** | A scheduled screening | ShowtimeID, MovieID, TheaterID, ScreenID, StartTime, EndTime, PriceCategory | Many – 1 → Movie, Theater |
| 4 | **Theater** | Cinema location/screen details | TheaterID, Name, City, Address, ScreenCount, SeatLayout | 1 – Many → Showtime |
| 5 | **Booking** | The core booking/case record | BookingID, CustomerID, ShowtimeID, SeatIDs, Status (Pending/Confirmed/Cancelled), BookingDate | Central entity linking Customer, Showtime, Seat, Payment, Ticket |
| 6 | **Seat** | Individual seat inventory | SeatID, ScreenID, RowLabel, SeatNumber, Category, Status (Available/Held/Booked) | Many – 1 → Theater/Screen |
| 7 | **Payment Transaction** | Payment record | TransactionID, BookingID, Amount, PaymentMethod, Status, Timestamp | 1 – 1 → Booking |
| 8 | **Digital Ticket** | Issued ticket | TicketID, BookingID, QRCodeData, IssueDate, Status (Active/Cancelled/Used) | 1 – 1 → Booking |
| 9 | **Refund** | Refund case record | RefundID, BookingID, Amount, Status (Initiated/Approved/Processed/Rejected), ProcessedBy | 1 – 1 → Booking (on cancellation) |

**Entity Relationship Summary:**
```
Customer 1───N Booking N───1 Showtime N───1 Movie
                  │               │
                  │               └──1 Theater
                  ├──1 Payment Transaction
                  ├──1 Digital Ticket
                  ├──N Seat (via SeatIDs)
                  └──0..1 Refund (on cancellation)
```

---

## 9. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Seat map and availability data shall load within 2 seconds under normal load; seat hold/lock operations shall be near real-time to prevent race conditions on high-demand shows. |
| **Scalability** | System shall handle concurrent seat selection for high-demand releases (e.g., opening day) without double-booking — enforced via Pega's optimistic/pessimistic locking on the Seat data object. |
| **Availability** | Target 99.5% uptime for the customer-facing booking channel. |
| **Security** | Role-based access control (RBAC) via Pega Access Groups mapped 1:1 to the 6 personas; payment data handled per PCI-DSS guidelines (tokenized, not stored raw in Pega). |
| **Auditability** | Every booking, cancellation, and refund shall have a full case history/audit trail (native Pega case history). |
| **Usability** | Customer-facing UI shall be built using Pega Constellation UI for responsive, mobile-first design. |
| **Compliance** | Customer data handling shall align with India's data protection regulations (DPDP Act). |
| **Notifications** | System shall support email/SMS notifications for booking confirmation, cancellation, and refund status via Pega Notifications framework. |

---

## 10. Pega Platform Analysis

### 10.1 Why Pega Case Management Fits This Use Case
A movie booking transaction is not a simple form submission — it is a **multi-stage, stateful process** with conditional paths (payment success/failure, cancellation, refund) and multiple participants (customer, staff, finance). This is precisely the pattern Pega's Case Management is designed for:

- **Stages and Processes** map directly to the booking journey (Movie Selection → Seat Selection → Payment → Confirmation).
- **Case hierarchy**: The Booking case can spawn a child **Refund** case on cancellation, keeping the two processes independently trackable but linked — a native Pega capability (parent-child case relationships).
- **SLAs and escalations**: Seat-hold timeouts and refund-processing deadlines can be enforced using Pega's built-in SLA/escalation rules rather than custom timers.
- **Case-wide audit trail**: Every stage transition, assignment, and status change is automatically logged — critical for finance reconciliation and dispute handling.

### 10.2 Low-Code Application Development on Pega
This application is well suited to Pega's low-code **App Studio** environment:

| Pega Low-Code Capability | Application to This Project |
|---|---|
| **App Studio** | Personas, case types (Ticket Booking, Cancellation, etc.), and data objects can be defined visually without hand-coding Java/UI markup. |
| **Case Designer** | Stages (Movie Selection, Seat Selection, Payment, Confirmation) are configured as drag-and-drop stages/steps. |
| **Data Designer** | The 9 data objects and their relationships (Customer, Movie, Showtime, etc.) are modeled declaratively. |
| **Constellation UI / DX Components** | Auto-generates responsive, theme-consistent UI for both customer self-service and internal staff views from the case/data model — reducing frontend build time significantly versus a hand-coded SPA. |
| **Decision Rules (DMN/When rules)** | Business logic such as cancellation-window policy, seat overlap validation, and refund eligibility is configured as declarative rules — editable by business analysts without a full dev cycle. |
| **Access Groups & Work Groups** | Directly maps to the 6 personas for out-of-the-box RBAC, without custom auth logic. |
| **Pega Notifications** | Email/SMS/push notifications for ticket delivery and cancellation updates configured declaratively. |
| **Reporting (Report Definitions / Constellation Reports)** | Booking Analytics workflow requirements (FR-4.x) are met natively without a separate BI tool. |
| **Integration Designer** | Payment gateway integration (REST/SOAP connector) configured with minimal code, using Pega's built-in connector wizard. |
| **Pega Cloud Deployment** | Enables rapid environment provisioning (Dev/Test/Prod) with built-in CI/CD via Pega's Deployment Manager. |

### 10.3 Trade-offs / Considerations
- **Low-code speed vs. custom UX**: Constellation UI accelerates delivery but highly custom seat-map visualizations (e.g., theater-shaped seat layouts) may require custom React-based Pega components rather than pure out-of-the-box widgets.
- **Locking strategy**: High-concurrency seat selection (blockbuster releases) requires careful configuration of case locking/seat data object locking to avoid performance bottlenecks — a known consideration in Pega high-throughput case types.
- **Payment PCI compliance**: Pega should not store raw card data; use a tokenized payment gateway connector and store only transaction references.

---

## 11. Access Control Matrix

| Persona | Ticket Booking | Show Management | Booking Cancellation | Booking Analytics | Admin/System Config |
|---|---|---|---|---|---|
| Customer | Create/View (own) | – | Create (own) | – | – |
| Theater Staff | View (all, own theater) | Edit | View | – | – |
| Booking Manager | View (all) | Create/Edit/Delete | View/Approve | View | – |
| Finance Officer | View (payment data) | – | Process Refund | View (financial) | – |
| Marketing Analyst | – | – | – | View/Export | – |
| Application Control Agent | – | – | – | – | Full Admin |

---

## 12. Success Metrics (KPIs)

| Metric | Target |
|---|---|
| Average booking completion time (Movie Selection → Confirmation) | < 3 minutes |
| Seat double-booking incidents | 0 |
| Cancellation-to-refund case cycle time | < 24 hours |
| Digital ticket delivery success rate | ≥ 99% |
| Customer self-service adoption (vs. counter booking) | ≥ 70% within 3 months of launch |
| System uptime | ≥ 99.5% |

---

## 13. Assumptions and Constraints

- Payment gateway is a third-party integration; exact provider (Razorpay/Stripe/PayU, etc.) to be finalized during integration design.
- Seat layouts are theater/screen-specific and configured by Booking Manager during onboarding of each theater.
- QR code validation at the theater entrance is assumed to be a manual staff scan in Phase 1 (no turnstile hardware integration).
- Refunds are processed to the original payment method; refund SLA depends on the payment gateway's own processing time.
- Single currency (INR) and single language (English) for Phase 1, per Blueprint context.

---

## 14. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| High-concurrency seat selection causing double-booking | High | Implement seat-level locking with short TTL holds; load-test before high-demand releases |
| Payment gateway downtime blocking bookings | High | Configure fallback messaging and retry logic; monitor via Pega alerts |
| Incorrect cancellation-window rule configuration | Medium | Validate decision rules with business/finance sign-off before go-live |
| Data privacy non-compliance (customer PII) | High | Apply Pega's data masking/access control features; align with DPDP Act |

---

## 15. Milestones (Indicative, for Internship Delivery)

| Phase | Deliverable |
|---|---|
| Phase 1 | Data model + Case type design (App Studio) for Ticket Booking |
| Phase 2 | Stage/process configuration + Constellation UI for customer journey |
| Phase 3 | Show Management + Booking Cancellation workflows |
| Phase 4 | Payment integration + Digital Ticket (QR) generation |
| Phase 5 | Booking Analytics dashboards + Access Group/RBAC setup |
| Phase 6 | UAT, bug fixing, and final demo/documentation |

---

## 16. Appendix

**Source:** Pega Blueprint (Blueprint ID: BP-2415415), Application Overview Document, generated 29/08/2026.

**Blueprint Summary Counts:**
- Personas & Channels: 6
- Workflows: 4
- Data Objects: 9

**Note:** Per Pega's own disclaimer on the Blueprint export, the AI-generated content should be validated by a human (business analyst/developer) before being treated as final for build — this PRD expands and structures that output into an implementation-ready specification but should still be reviewed with your internship mentor/stakeholders before development begins.
