# AI SAMRAT ASSESSMENT HUB — ENTERPRISE TECHNICAL CERTIFICATION SYSTEM

AI SAMRAT Assessment Hub is a production-grade enterprise technical assessment and proctoring platform featuring real-time proctoring, calibrated 3-warning anti-malpractice detection, dynamic question/option shuffling, tamper-evident digital certificates, and full Excel audit exports.

---

## 🌐 Public Live Link (Active 24/7)

- **Production Live URL**: [https://word-subsidiary-recognition-alignment.trycloudflare.com](https://word-subsidiary-recognition-alignment.trycloudflare.com)
- **Local Port**: `http://localhost:8080` (Backend + Integrated Frontend)
- **Vite Dev Server**: `http://localhost:5173` (Frontend Hot-Reloading)
- **Public Credential Verification**: [https://word-subsidiary-recognition-alignment.trycloudflare.com/verify](https://word-subsidiary-recognition-alignment.trycloudflare.com/verify)

---

## 🔐 Default Access Credentials

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `Admin@1234` | Full platform administration, roster management, live proctoring monitoring, question bank, score correction, and certificate revocation |
| **Evaluator** | `evaluator` | `Eval@1234` | Exam submission evaluation, candidate answer review, official scoring adjustments with mandatory audit justifications |
| **Employee 1** | `emp001` | `Emp@1234` | Candidate portal, AI assessment track, proctored examination, digital certificates |
| **Employee 2** | `emp002` | `Emp@1234` | Machine Learning assessment track |
| **Employee 3** | `emp003` | `Emp@1234` | Data Science assessment track |
| **Self-Registration** | *(Candidate Portal)* | *(Self-Created)* | Any candidate can register with their email & employee ID |

---

## 🚀 Instant 1-Command Startup

### Option A: Run the Pre-Built Executable JAR (Zero Dependencies)
Requires Java 21+:
```bash
cd backend
java -jar target/examhub-backend-1.0.0.jar
```
The application will launch on `http://localhost:8080` with the complete built frontend already integrated inside!

### Option B: Development Mode (Hot-Reloading)
1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📋 Key Platform Capabilities

1. **Public Portal & Specimen Credential**: Warm white corporate design with floating assessment matrix and public certificate verification (Arjun Mehta's certificate removed from public showcase).
2. **Curated 600-MCQ Question Bank**: 6 technical tracks (Artificial Intelligence, Machine Learning, Data Science, Java Programming, Web Development, Shell Scripting & DevOps) with Sets A & B across Beginner, Intermediate, and Advanced tiers.
3. **Calibrated 3-Warning Anti-Malpractice Proctoring**: Real-time webcam green-box face detection, tab switch detection, and fullscreen enforcement. Violation #4 triggers automatic examination termination.
4. **Digital Certificate Engine**:
   - Title: `CERTIFICATE OF ACHIEVEMENT`
   - Issuer: `AI SAMRAT PRIVATE LIMITED`
   - Signatory: `Deepak Ganer`, Director & Authorised Signatory
   - Landscape A4 high-res PDF generation with embedded QR codes, gold border brackets, and official company logo.
   - Permanent cryptographic verification registry & revocation workflow.
5. **Full Excel (.xlsx) Audit Exports**:
   - Super Admin can export complete examination submissions with question text, options A-D, candidate's picked choice, official answer key, marks awarded, and timestamps.
   - One-click Excel export for employees, examinations, question bank, and certificate registry.
6. **Live Proctoring Command Center**: WebSocket-driven participant grid, real-time warning counts, and video feed inspection.

---

## 🏢 Organization
**AI SAMRAT PRIVATE LIMITED**  
Enterprise Technical Assessment & Certification
