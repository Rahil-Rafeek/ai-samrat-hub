# AI SAMRAT ASSESSMENT HUB — ENTERPRISE TECHNICAL ASSESSMENT & CERTIFICATION PLATFORM

> **Official Enterprise Evaluation, Real-Time Proctoring & Digital Credentialing Infrastructure**  
> Developed for **AI SAMRAT PRIVATE LIMITED**  
> Enterprise Technical Assessment & Certification

---

## 📑 Table of Contents

- [1. Executive Overview](#1-executive-overview)
- [2. Live Platform Links & Environments](#2-live-platform-links--environments)
- [3. Pre-Configured Access Credentials](#3-pre-configured-access-credentials)
- [4. System Architecture & Technology Stack](#4-system-architecture--technology-stack)
- [5. Complete Guide to the 18 Distinct Interfaces](#5-complete-guide-to-the-18-distinct-interfaces)
- [6. Calibrated 3-Warning Anti-Malpractice Proctoring Policy](#6-calibrated-3-warning-anti-malpractice-proctoring-policy)
- [7. Digital Certificate Design & OpenPDF Generation Engine](#7-digital-certificate-design--openpdf-generation-engine)
- [8. Curated 600-MCQ Technical Curriculum (6 Tracks)](#8-curated-600-mcq-technical-curriculum-6-tracks)
- [9. Full Excel (.xlsx) Audit & Submission Export System](#9-full-excel-xlsx-audit--submission-export-system)
- [10. Quickstart & Universal Deployment Guide](#10-quickstart--universal-deployment-guide)
  - [10.1 Windows 1-Click Launch (Any Windows Version)](#101-windows-1-click-launch-any-windows-version)
  - [10.2 macOS & Linux 1-Click Launch](#102-macos--linux-1-click-launch)
  - [10.3 Direct Standalone Executable JAR Run](#103-direct-standalone-executable-jar-run)
  - [10.4 24/7 Permanent Cloud Deployment (Render / Docker)](#104-247-permanent-cloud-deployment-render--docker)
- [11. Complete REST API Reference](#11-complete-rest-api-reference)
- [12. Repository Directory Structure](#12-repository-directory-structure)
- [13. Corporate Governance & Ownership](#13-corporate-governance--ownership)

---

## 1. Executive Overview

**AI SAMRAT Assessment Hub** is a production-grade enterprise web application designed to evaluate, benchmark, and certify software engineers, artificial intelligence researchers, data scientists, and DevOps practitioners. 

Built with an enterprise **warm-white aesthetic**, strict **zero-trust proctoring**, dynamic **question and option randomization**, calibrated **3-warning anti-malpractice rules**, and a cryptographic **digital certificate issuance & verification engine**, the platform bridges technical hiring, annual competency evaluations, and professional credentialing.

### Core Value Propositions
* **Objective Baseline**: 6 specialized technical tracks featuring 600 peer-reviewed MCQs structured across Sets A & B with 3 difficulty tiers (Beginner, Intermediate, Advanced).
* **Calibrated Proctoring**: Automated webcam computer vision face tracking, fullscreen enforcement, and tab-switch detection backed by an enforceable 3-warning rule (Violation #4 triggers automatic exam termination).
* **Cryptographic Credentials**: Landscape A4 digitally stamped certificates generated on-the-fly via OpenPDF with unique verification codes (`AIS-CERT-YYYY-XXXXXX`), embedded QR codes, and a public verification registry.
* **Audit Transparency**: Full Excel export capabilities allow Super Administrators to download the exact questions, options picked, correct keys, awarded scores, and timestamps for every single candidate submission.

---

## 2. Live Platform Links & Environments

| Environment | URL | Purpose |
| :--- | :--- | :--- |
| **Permanent Cloud (Render 24/7)** | [https://ai-samrat-hub.onrender.com](https://ai-samrat-hub.onrender.com) | 24/7 permanent cloud production web service (never crashes) |
| **Permanent Credential Verification** | [https://ai-samrat-hub.onrender.com/verify](https://ai-samrat-hub.onrender.com/verify) | Official public certificate lookup & QR scan verification |
| **Active Live Tunnel** | [https://private-maintain-achieving-artwork.trycloudflare.com](https://private-maintain-achieving-artwork.trycloudflare.com) | Real-time SSL encrypted edge preview |
| **Local Integrated Backend** | [http://localhost:8080](http://localhost:8080) | Standalone JAR serving both API and bundled frontend |
| **Vite Dev Server** | [http://localhost:5173](http://localhost:5173) | Frontend development with hot-module replacement |

---

## 3. Pre-Configured Access Credentials

The database automatically initializes with standard enterprise test accounts:

| Role | Username | Password | Full Name & Title | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `Admin@1234` | Vikramaditya Sharma, Head of HR & Evaluation | Complete administrative access: employee roster, 600-MCQ question bank, live surveillance, grade adjustment, certificate revocation, system telemetry |
| **Evaluator** | `evaluator` | `Eval@1234` | Sunita Deshmukh, Chief Evaluator | Review candidate answer sheets, execute score corrections with mandatory audit reasoning, export Excel audits |
| **Candidate 1** | `emp001` | `Emp@1234` | Arjun Mehta, Senior AI Engineer | Candidate portal, AI assessment track, proctored examination room, certificate management |
| **Candidate 2** | `emp002` | `Emp@1234` | Priya Sharma, ML Research Associate | Machine Learning assessment track |
| **Candidate 3** | `emp003` | `Emp@1234` | Rahul Verma, Senior Data Analyst | Data Science assessment track |
| **Public Candidate** | *(Self-Registration)* | *(User-Defined)* | Open Self-Registration Portal | Any new applicant can register directly via the public landing page |

---

## 4. System Architecture & Technology Stack

```
                                  [ Browser / Mobile Client ]
                                               │
                        ┌──────────────────────┴──────────────────────┐
                        ▼                                             ▼
             [ Public Landing & Verify ]                   [ Authenticated SPA Portal ]
                        │                                             │
                        └──────────────────────┬──────────────────────┘
                                               │ HTTPS / WSS
                                               ▼
                              [ Spring Boot 3.3.4 Application ]
                                               │
               ┌───────────────────────┬───────┴───────────────┬───────────────────────┐
               ▼                       ▼                       ▼                       ▼
      [ Spring Security ]     [ Exam Engine Service ]  [ OpenPDF Generator ]    [ POI Excel Export ]
      - JWT Stateless Auth    - Fisher-Yates Permute   - Landscape A4 Document  - Full Question Papers
      - RBAC Role Filters     - 3-Warning Anti-Cheat   - QR Code & Vector Water - Candidate Choices
      - Password Encryption   - Auto-Scoring Engine    - Stamped Audit Trail    - Evaluator Audit Trail
               │                       │                       │                       │
               └───────────────────────┴───────┬───────────────┴───────────────────────┘
                                               ▼
                                 [ Persistence Layer: JPA ]
                                               │
                               ┌───────────────┴───────────────┐
                               ▼                               ▼
                      [ Embedded H2 DB ]             [ PostgreSQL DB ]
                      (Local Zero-Config)           (Cloud Production)
```

### Technology Highlights
* **Backend Framework**: Java 21 LTS, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, Hibernate ORM 6.
* **Real-Time Communication**: Spring WebSocket with STOMP message broker for live video surveillance and warning counters.
* **Frontend SPA**: React 18, TypeScript, Tailwind CSS, Vite 5, Framer Motion (floating physics), Recharts (analytics), Lucide Icons.
* **Document & Data Engines**:
  - **OpenPDF 2.0.2**: High-resolution landscape vector certificate rendering, QR code embedding, watermark overlays, and revocation stamping.
  - **Apache POI 5.2.5**: Complete `.xlsx` spreadsheet generation with multi-colored question answer audits.
* **Computer Vision Proctoring**: WebRTC MediaStream API + HTML5 Canvas mathematical pixel analysis for candidate face tracking, eye yaw monitoring, and multi-face intrusion warnings.

---

## 5. Complete Guide to the 18 Distinct Interfaces

The application delivers 18 fully functional, production-ready interfaces:

### Interface 1: Public Landing & Certificate Verification
- **Aesthetic**: Warm white (`#FBFBFA`) and soft ivory backgrounds with deep charcoal typography and subtle brand blue accents.
- **Floating Hero Matrix**: Parallax floating assessment preview with real-time competency bars and undulating motion physics.
- **Assessment Tracks Grid**: Interactive syllabus review for 6 technical tracks.
- **Genuine Public Verification Tool**: Instant certificate lookup field connecting to the backend registry (no promotional fake certificates or private employee data exposed).

### Interface 2: Employee Login & Account Activation
- Single sign-on interface with role-based redirection.
- Dedicated tab for new account activation via security tokens.
- Self-registration modal for prospective candidates.

### Interface 3: Employee Dashboard
- Candidate welcome banner with dynamic cohort progress indicators.
- Assigned technical tracks with active examination windows, time limits, and question count indicators.
- Quick shortcuts to personal skill passport, certificate registry, and coding playground.

### Interface 4: Examination Instructions & Pre-Flight Diagnostic
- Formal assessment ground rules, scoring blueprint, and violation consequences.
- Interactive camera and microphone pre-flight hardware diagnostic test.
- Fullscreen capability verification before starting the timer.

### Interface 5: Live Examination Room
- **Calibrated 3-Warning Anti-Malpractice Engine**: Real-time detection of tab switching, window blurring, and fullscreen exits.
- **Computer Vision Webcam Feed**: Live green-box face tracking overlay checking for continuous single-candidate presence.
- **Question Palette**: Comprehensive 50-question navigation grid tracking Answered, Marked for Review, and Unanswered questions.
- **Timer & Auto-Save**: Persistent server-synced countdown timer with continuous answer auto-saving.

### Interface 6: Examination Submission & Auto-Grading Engine
- Double-confirmation submission dialog displaying question completion metrics.
- Instant server-side answer evaluation against cryptographically hashed answer keys.
- Automatic calculation of raw score, percentage, and passing eligibility threshold (≥ 60.0%).

### Interface 7: Results & Category Performance Scorecard
- Immediate post-exam feedback with composite score and achievement tier.
- Topic-by-topic mastery breakdown (e.g., *Heuristic Search: 96%*, *Neural Foundations: 92%*).
- Instant shortcut to claim and view the digital certificate if passing threshold is met.

### Interface 8: Employee Certificates Registry
- Dedicated "My Certificates" portfolio for authenticated candidates.
- In-browser interactive preview modal rendering the landscape certificate.
- One-click high-resolution PDF download.
- "Copy Verification Link" button with instant clipboard feedback.

### Interface 9: Super Admin Command Center & Metric Overview
- High-level platform KPIs: Total Registered Employees, Active Exams, Completed Submissions, Issued Certificates, Integrity Flag Count.
- Cohort performance bar charts and system-wide pass/fail distributions.

### Interface 10: Employee Roster Management
- Complete searchable employee database with department, designation, and account status tags.
- Exam assignment controls to dynamically grant or revoke access to specific assessment tracks.
- Account status controls: `ACTIVE`, `PENDING_ACTIVATION`, `SUSPENDED`.

### Interface 11: New Employee Registration
- Modal form to register individual technical staff.
- Automatic employee code generation (`EMP-2026-XXX`) and temporary password provisioning.

### Interface 12: Bulk Employee Roster Import
- One-click bulk onboarding supporting roster datasets (includes 43 pre-built technical staff).
- Live preview table before committing additions to PostgreSQL.

### Interface 13: Examination Track Management
- Administrative controls to create, schedule, open, or close examination windows.
- Configurable settings: Passing threshold (default 60%), duration (minutes), total questions, and assigned question sets (Set A / Set B).

### Interface 14: Curated 600-MCQ Question Bank Management
- Filterable repository across all 6 technical tracks.
- Question editor with options A, B, C, D, official correct key, topic tagging, difficulty tiers, and explanatory rationales.

### Interface 15: Live Examination Monitoring & Surveillance Grid
- Real-time command center showing all currently active examinees.
- Live warning counters tracking tab switches and fullscreen exits per participant.
- Video feed inspection modal displaying the live webcam stream.

### Interface 16: Employee Performance Analytics
- Deep-dive analytics across departments and cohorts.
- Distribution curves comparing beginner, intermediate, and advanced performance.

### Interface 17: Intelligence Centre
- Automated platform intelligence summarizing candidate competency gaps.
- Track difficulty indices identifying questions with high error rates.

### Interface 18: Full Excel (.xlsx) Audit Exports & System Settings
- One-click Excel exports for every core section:
  1. Complete candidate exam submission sheets (every question, candidate's picked option, official key, marks, timestamps).
  2. Complete employee directory export.
  3. Question bank export.
  4. Certificate registry export.
- System telemetry dashboard monitoring live JVM memory allocation, thread count, database connection pool, and WebSocket health.

---

## 6. Calibrated 3-Warning Anti-Malpractice Proctoring Policy

The AI SAMRAT Assessment Hub enforces an objective, calibrated 3-warning anti-cheating policy:

```
[ Candidate Enters Exam ] ──► [ Fullscreen Locked & Webcam Active ]
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         ▼                                                                   ▼
[ Normal Examination Progress ]                                  [ Violation Triggered ]
- Answering MCQs                                                 - Tab switch / window blur
- Code playground execution                                      - Fullscreen exit / resize
                                                                 - Absence from camera frame
                                                                             │
                                                                             ▼
                                                                     [ Violation #1 ]
                                                                 Warning 1/3 Modal Displayed
                                                                             │
                                                                             ▼
                                                                     [ Violation #2 ]
                                                                 Warning 2/3 Modal Displayed
                                                                             │
                                                                             ▼
                                                                     [ Violation #3 ]
                                                                 Final Warning 3/3 Displayed
                                                                             │
                                                                             ▼
                                                                     [ Violation #4 ]
                                                                 AUTOMATIC TERMINATION
                                                                 - Exam locked immediately
                                                                 - Answers sealed in DB
                                                                 - Evaluation status marked FAILED
```

### Violation Detection Mechanisms:
1. **Window Focus / Tab Switch**: Listens to browser `visibilitychange` and `blur` events. Leaving the examination tab increments the violation counter immediately.
2. **Fullscreen Exit**: Listens to `fullscreenchange` events. Any attempt to exit fullscreen mode pauses the test and displays an alert modal.
3. **Computer Vision Presence**: Analyzes video frames locally via Canvas pixel luminance checks to detect face absence or secondary face intrusions.

---

## 7. Digital Certificate Design & OpenPDF Generation Engine

Certificates issued by AI SAMRAT communicate enterprise credibility and professional recognition:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  AI SAMRAT PRIVATE LIMITED                                                             │
│  Enterprise Technical Assessment & Certification                                      │
│                                                                                        │
│                               CERTIFICATE OF ACHIEVEMENT                               │
│                                                                                        │
│                         This certificate is proudly presented to                       │
│                                     [CANDIDATE NAME]                                   │
│                        Employee ID: EMP-2026-001 • Technical Engineering               │
│                                                                                        │
│      "This certificate is proudly presented in recognition of successfully             │
│       demonstrating technical knowledge and competency through the                     │
│       AI SAMRAT Enterprise Technical Assessment."                                      │
│                                                                                        │
│                       [ARTIFICIAL INTELLIGENCE & INTELLIGENT SYSTEMS]                  │
│                                     Technical Assessment                               │
│                                                                                        │
│  ┌──────────────────┬──────────────────┬──────────────────┬─────────────────────────┐  │
│  │ Score: 94 / 100  │ Grade: Distinction│ Exam Date: Nov 10│ Issue Date: Nov 11, 2026│  │
│  └──────────────────┴──────────────────┴──────────────────┴─────────────────────────┘  │
│                                                                                        │
│  [ QR CODE ]                                                    Deepak Ganer           │
│  AIS-CERT-2026-XXXXXX                                  Director & Authorised Signatory │
│  Scan to Verify Authenticity                             AI SAMRAT PRIVATE LIMITED     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Visual Specifications
- **Layout**: Landscape A4 (`297mm × 210mm` / `842pt × 595pt`).
- **Borders**: Outer dark navy border (3.5pt) paired with an inner refined gold border (1.2pt) and ornamental corner bracket accents.
- **Official Branding**: Direct embedding of the official company logo (`/logo.png`) preserving original proportions, colors, and bilingual Kannada/English text.
- **Watermark**: Subtle background logo watermark set to 4.5% opacity.
- **Authorised Signatory**: Explicitly designated to **Deepak Ganer**, *Director & Authorised Signatory, AI SAMRAT PRIVATE LIMITED*.
- **Achievement Grading Scale**:
  - **90–100%**: **Distinction**
  - **75–89%**: **Achievement**
  - **60–74%**: **Participation**
  - **Below 60%**: **No certificate issued**

### Cryptographic Verification & Revocation
- Every certificate generates a permanent QR code linking to `/verify?code=AIS-CERT-YYYY-XXXXXX`.
- If an administrator revokes a credential due to post-exam audit findings, the database marks the certificate as `REVOKED`. Subsequent PDF downloads and verification scans will display a prominent red **"REVOKED / CANCELLED"** diagonal watermark stamp with the official revocation reason.

---

## 8. Curated 600-MCQ Technical Curriculum (6 Tracks)

The platform embeds a comprehensive question bank of 600 questions categorized into Sets A & B across 6 tracks:

| Track Code | Track Name | Question Allocation | Beginner | Intermediate | Advanced | Core Syllabus |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `AI-TRACK` | **Artificial Intelligence** | 100 (50 Set A, 50 Set B) | 32 | 36 | 32 | Heuristic search, A* algorithm, Alpha-Beta pruning, CSP, expert systems, neural basics |
| `ML-TRACK` | **Machine Learning** | 100 (50 Set A, 50 Set B) | 32 | 36 | 32 | Gradient descent, regularization (L1/L2), SVMs, decision trees, ensemble learning, validation metrics |
| `DS-TRACK` | **Data Science** | 100 (50 Set A, 50 Set B) | 32 | 36 | 32 | Pandas transformations, statistical inference, hypothesis testing, feature engineering, big data |
| `JAVA-TRACK`| **Java Programming** | 100 (50 Set A, 50 Set B) | 32 | 36 | 32 | JVM memory model, garbage collection, concurrency, Stream API, generics, Spring Boot architecture |
| `WEB-TRACK` | **Web Development** | 100 (50 Set A, 50 Set B) | 32 | 36 | 32 | React 18 architecture, TypeScript type safety, DOM performance, CSS Grid, state management, REST |
| `SHELL-TRACK`| **Shell Scripting & DevOps**| 100 (50 Set A, 50 Set B) | 32 | 36 | 32 | POSIX Bash scripting, Sed & Awk stream parsing, process signals, CI/CD pipelines, Linux security |

---

## 9. Full Excel (.xlsx) Audit & Submission Export System

Super Administrators and Evaluators can download complete examination submissions as Excel spreadsheets via Apache POI:

### Excel Submission Audit Contains:
1. **Candidate Profile**: Full name, employee ID, department, exam attempt UUID.
2. **Execution Timing**: Start timestamp, submission timestamp, total seconds taken.
3. **Question Paper Breakdown (All 50 MCQs)**:
   - Question sequence number (`Q1` to `Q50`)
   - Unique Question Code (`AI-001`, `ML-045`)
   - Complete Question Text
   - Option A, Option B, Option C, Option D text
   - Candidate's Picked Choice (Highlighted in soft red if incorrect, soft green if correct)
   - Official Answer Key
   - Marks Awarded (e.g. `2.0` or `0.0`)
   - Full Explanation & Rationale
4. **Official Audit Trail**: History of any manual score revisions signed by reviewers with justification notes.

---

## 10. Quickstart & Universal Deployment Guide

The project is designed to run seamlessly across all operating systems.

### 10.1 Windows 1-Click Launch (Any Windows Version)
Teammates on Windows 11, Windows 10, Windows 8, or Windows 7 can launch the platform with a single double-click:

1. Extract the project folder (or `AI_SAMRAT_Assessment_Hub_Complete.zip`).
2. Double-click:
   ```cmd
   start-windows.bat
   ```
   *(Or right-click and run with PowerShell: `start-windows.ps1`)*
3. The script verifies Java, starts the integrated application, and automatically opens **`http://localhost:8080`** in your default web browser!

---

### 10.2 macOS & Linux 1-Click Launch
1. Open your terminal in the project directory:
   ```bash
   chmod +x start-mac-linux.sh
   ./start-mac-linux.sh
   ```
2. The browser will open automatically to `http://localhost:8080`.

---

### 10.3 Direct Standalone Executable JAR Run
Requires **Java 17+** or **Java 21**:
```bash
# Run the root executable JAR
java -jar examhub-app.jar

# Or run from backend target
cd backend
java -jar target/examhub-backend-1.0.0.jar
```
The application will start on port `8080` with the embedded database and pre-compiled React frontend.

---

### 10.4 24/7 Permanent Cloud Deployment (Render / Docker)
To host the platform permanently in the cloud with zero downtime:

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "AI SAMRAT Assessment Hub Release"
   git push origin main
   ```
2. Open **[Render.com](https://render.com)** and click **New +** → **Web Service**.
3. Connect your repository.
4. Select **Docker** environment and **Free** instance type.
5. Add an environment variable: `PORT` = `8080`.
6. Click **Deploy Web Service**!

Render will build the multi-stage container and provide your permanent URL:
👉 **`https://ai-samrat-hub.onrender.com`**

---

## 11. Complete REST API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate with username and password, returns JWT token | Public |
| `POST` | `/api/auth/self-register` | Register a new public candidate account | Public |
| `POST` | `/api/auth/activate` | Activate employee account via verification token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile and roles | Authenticated |

### Examination & Proctoring Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employee/examinations` | List examinations assigned to the logged-in candidate | Candidate |
| `POST` | `/api/employee/examinations/{id}/start` | Start an exam attempt (randomizes questions & sets) | Candidate |
| `POST` | `/api/employee/examinations/attempts/{uuid}/autosave` | Autosave selected MCQ answer | Candidate |
| `POST` | `/api/employee/examinations/attempts/{uuid}/integrity-event` | Log tab switch or fullscreen violation | Candidate |
| `POST` | `/api/employee/examinations/attempts/{uuid}/submit` | Submit examination for auto-grading | Candidate |

### Digital Certificate Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/certificates/verify/{code}` | Verify authenticity of any certificate code | Public |
| `GET` | `/api/certificates/download/{code}` | Download official landscape A4 OpenPDF certificate | Public / Auth |
| `GET` | `/api/certificates/my` | List all certificates awarded to the current employee | Candidate |
| `GET` | `/api/certificates/all` | View global registry of all issued certificates | Super Admin |
| `POST` | `/api/certificates/{code}/revoke` | Revoke a certificate with mandatory audit justification | Super Admin |

### Evaluator & Admin Endpoints
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard/stats` | Retrieve platform KPI summary metrics | Super Admin |
| `GET` | `/api/evaluator/submissions` | List all completed candidate submissions | Evaluator / Admin |
| `GET` | `/api/evaluator/submissions/{id}` | Inspect submission answer sheet and audit history | Evaluator / Admin |
| `POST` | `/api/evaluator/submissions/{id}/correct` | Record official score adjustment and audit log | Evaluator / Admin |
| `POST` | `/api/evaluator/submissions/{id}/issue-certificate` | Issue digital certificate for qualified submission | Evaluator / Admin |
| `GET` | `/api/evaluator/submissions/{id}/export-excel` | Export complete exam submission audit as `.xlsx` | Evaluator / Admin |
| `GET` | `/api/admin/export-excel/{section}` | Bulk export `employees`, `questions`, `certificates` | Super Admin |

---

## 12. Repository Directory Structure

```
exam-system/
├── Dockerfile                   # Root multi-stage Docker container for cloud deployments
├── render.yaml                  # Render cloud blueprint definition
├── start-windows.bat            # 1-Click launcher for Windows (cmd.exe)
├── start-windows.ps1            # 1-Click launcher for Windows (PowerShell)
├── start-mac-linux.sh           # 1-Click launcher for macOS & Linux
├── examhub-app.jar              # Pre-compiled standalone executable JAR (Java 21)
├── README.md                    # Comprehensive platform documentation
├── docker-compose.yml           # Multi-container orchestration (PostgreSQL + App)
│
├── frontend/                    # React 18 + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── pages/               # Top-level interfaces (Landing, Login, Dashboard, ExamRoom, Admin)
│   │   ├── components/
│   │   │   ├── common/          # DigitalCertificateView, CompanyLogo
│   │   │   ├── layout/          # Navbar, Sidebar
│   │   │   ├── admin/           # AddEmployeeModal, RosterImportModal
│   │   │   ├── coding/          # CodeAssessmentView
│   │   │   └── employee/        # EmployeeSkillPassport
│   │   ├── services/            # REST API client, WebRTC/Canvas proctoring service
│   │   └── types/               # TypeScript data models and DTO interfaces
│   ├── public/                  # Static assets including official logo.png
│   └── package.json             # Frontend dependencies and Vite configuration
│
└── backend/                     # Java 21 / Spring Boot 3.3.4 Backend
    ├── pom.xml                  # Maven build definition (Spring Boot, OpenPDF, POI)
    └── src/
        └── main/
            ├── java/com/aisamrat/examhub/
            │   ├── controller/  # REST Controllers (Auth, Exam, Certificate, Evaluator, Admin)
            │   ├── service/     # Business logic (ExamEngine, Certificate, Reporting, POI Export)
            │   ├── entity/      # JPA Hibernate entities (User, Employee, Question, Certificate)
            │   ├── security/    # Spring Security 6, JWT Filter, UserDetails
            │   └── dto/         # Request and Response record DTOs
            └── resources/
                ├── application.yml                 # Default configuration & credentials
                ├── logo.png                        # Official logo asset for OpenPDF certificates
                ├── data/questions_bank_600.json    # 600-question curated bank seed
                └── static/                         # Integrated production build of React SPA
```

---

## 13. Corporate Governance & Ownership

**AI SAMRAT PRIVATE LIMITED**  
*Enterprise Technical Assessment & Certification Division*

* **Authorized Signatory**: Deepak Ganer, *Director & Authorised Signatory*  
* **Platform Security**: Zero-Trust Calibrated Proctoring & Cryptographic Registry  
* **Copyright**: © 2026 AI SAMRAT PRIVATE LIMITED. All rights reserved.  

*This software, assessment curricula, question banks, and certificate designs are proprietary enterprise assets of AI SAMRAT PRIVATE LIMITED.*
