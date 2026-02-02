# FXM21 Water Pilot Diagnostic Tool – Enterprise Design Overview

## 1) Objectives

Design an enterprise-grade diagnostic application that can:

- Read data from the **HRT 710 ICP Con device** over **Ethernet**.
- Read data from the **FXM21 Water Pilot** through a **dry-contact connection** from HRT 710 using the **HRT protocol**.
- Provide a unified, auditable view of both devices for troubleshooting, health monitoring, and reporting.

## 2) Physical & Logical Connectivity

### 2.1 Physical Connections

1. **Software (Diagnostic App) → HRT 710 ICP Con**
   - **Ethernet connection** (TCP/IP).
   - The app acts as a client to the HRT 710 device.

2. **HRT 710 ICP Con → FXM21 Water Pilot**
   - **Dry-contact wiring** that carries the **HRT protocol** signals.
   - The HRT 710 serves as the protocol bridge for the FXM21 Water Pilot and can host a **loop of up to 6 FXM21 units** on the dry-contact bus.

### 2.2 Logical Data Flow

- The diagnostic application queries HRT 710 over Ethernet.
- HRT 710 reads from FXM21 devices over the dry-contact HRT protocol and exposes their data to the application.
- The application enumerates FXM21 **device IDs** (up to six on a loop) and correlates per-device readings into a single diagnostic view.

## 3) Enterprise Requirements

### 3.1 Reliability & Availability

- **High availability** deployment (active/passive or active/active).
- **Automatic reconnection** and **exponential backoff** for Ethernet link loss.
- **Offline buffering** when connectivity is disrupted.

### 3.2 Security

- **Network segmentation** (VLANs, firewall ACLs) to isolate device networks.
- **Mutual authentication** between the diagnostic app and HRT 710 when supported.
- **Audit logging** of all read/write operations.
- **Role-based access control (RBAC)** in the application UI/API.

### 3.3 Compliance & Operations

- **Centralized logging** (SIEM integration).
- **Metrics & alerting** for device status, protocol errors, and throughput.
- **Versioned configurations** and change management.

## 4) Protocol Integration Details

### 4.1 HRT 710 ICP Con Ethernet Interface

Required information (to be confirmed by vendor documentation):

- IP address and port(s).
- Transport protocol: TCP/UDP.
- Authentication method (if any).
- Message format (binary/ASCII, framing, checksum).

### 4.2 HRT Protocol (Dry Contact)

Required information:

- Electrical characteristics: voltage levels, timing requirements.
- Protocol frame structure and message types.
- Supported commands and response codes.

### 4.3 Data Mapping

- Map FXM21 measurements/status codes to canonical diagnostics.
- Normalize timestamps using a single time source (NTP) in the application.
- Maintain a **device registry** keyed by FXM21 device ID so calibration and diagnostics can be executed per unit or across the loop.

## 5) Software Architecture

### 5.1 Core Components

- **Device Connector Service**
  - Manages Ethernet communication with HRT 710.
  - Implements protocol parsing and retries.

- **Protocol Bridge Adapter**
  - Interprets HRT 710 responses as FXM21 data.
  - Handles dry-contact protocol specifics.

- **Data Normalization Layer**
  - Standardizes units, timestamps, and status codes.

- **Diagnostic & Analytics Engine**
  - Health checks, anomaly detection, rule-based diagnostics.
  - Calibration workflow orchestration per FXM21 device ID or across the full 6-device loop.

- **UI/Reporting Module**
  - Dashboards, logs, alerts, exportable reports.

### 5.2 Deployment

- Containerized services (e.g., Docker/Kubernetes).
- Separate **device communication service** from UI/API.
- **Edge gateway option** for low-latency plant deployments.

## 6) What Must Be Done (Implementation Steps)

1. **Obtain official protocol specs** from ICP Con and FXM21 vendors.
2. **Confirm electrical wiring and signal timing** for the dry-contact HRT protocol.
3. **Develop Ethernet connector** for HRT 710 with robust error handling.
4. **Implement protocol translator** for FXM21 data through HRT 710, including **device ID enumeration** for the 6-unit loop.
5. **Define data model** for all device readings, states, and calibration parameters per FXM21.
6. **Build UI** for live diagnostics and historical views.
7. **Add enterprise observability** (logs, metrics, alerts).
8. **Conduct integration tests** using real hardware or vendor simulators.
9. **Harden security** and implement RBAC, audit logs, and encrypted storage.
10. **Prepare deployment automation** (CI/CD and environment provisioning).

## 7) Deliverables

- Functional diagnostic application with:
  - Live status of HRT 710 and each FXM21 device in the 6-unit loop.
  - Diagnostic logs and alarms.
  - Report exports (PDF/CSV).
  - Calibration controls for **single FXM21** or **batch loop** calibration.
- Technical documentation:
  - Network topology.
  - Protocol integration details.
  - Operational runbook.

## 8) Open Questions for Final Design

- Does HRT 710 provide a documented API for FXM21 data exposure?
- Is bi-directional control required, or read-only diagnostics?
- Are there latency or regulatory constraints (industry standards)?
- Expected number of devices and scaling requirements?

## 9) Next Step (Enterprise Delivery Plan)

### 9.1 Discovery & Vendor Alignment (Weeks 1–2)

- Secure protocol documentation, wiring diagrams, and electrical specs from ICP Con and FXM21 vendors.
- Validate the 6-device loop topology and device ID enumeration behavior with a bench setup.
- Define a minimal diagnostic data set and calibration workflow acceptance criteria.

### 9.2 Prototype & Validation (Weeks 3–5)

- Build a proof-of-connection service for the HRT 710 Ethernet interface.
- Implement FXM21 loop scanning and device ID discovery.
- Validate read-only diagnostics and calibration command sequencing on real hardware.

### 9.3 Enterprise-Grade Buildout (Weeks 6–10)

- Productionize the connector with resiliency, observability, and secure configuration.
- Implement RBAC, audit trails, and reporting dashboards.
- Add calibration orchestration for single-unit and batch loop operations.

### 9.4 Pilot & Rollout (Weeks 11–12)

- Run on-site pilot with real operations and collect telemetry for tuning.
- Finalize runbook, security hardening, and deployment automation.

### 9.5 Success Metrics

- ≥99.5% connector uptime with automatic reconnection.
- 100% FXM21 device ID discovery in a 6-unit loop under nominal conditions.
- Calibration workflow completion without manual intervention in pilot scenarios.

---

**Summary:** This enterprise-grade diagnostic solution requires a robust Ethernet connector to the HRT 710, a protocol adapter for dry-contact HRT communication to FXM21, and enterprise observability/security layers to ensure reliability, compliance, and operational transparency.
