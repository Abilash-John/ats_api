# ATS API Reference (v1)

**Base URL:** `http://localhost:3000/api/v1`
**Auth Header:** `Authorization: Bearer <JWT>`

## API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register new user/recruiter |
| POST | `/auth/login` | No | Login to receive JWT token |
| GET | `/jobs/search?keyword=&skills=&location=` | No | Full-text search via Elasticsearch |
| GET | `/jobs/:id` | No | Get job details (optimized with Redis cache) |
| POST | `/jobs` | Recruiter+ | Create a new job posting |
| PUT | `/jobs/:id` | Recruiter+ | Update existing job details |
| POST | `/candidates` | Any | Register a new candidate (triggers resume parse) |
| GET | `/candidates/:id` | Auth | Retrieve full candidate profile |
| POST | `/applications` | Auth | Apply to a job (atomic locking via Redlock) |
| PATCH | `/applications/:id/stage` | Recruiter+ | Move candidate to a new hiring stage |
| GET | `/applications?job_id=` | Auth | List/Filter applications for a specific job |

---

## Technical Stack Overview
- **Core**: Node.js & Express
- **ORM**: TypeORM (Entity Schema for JS) & MySQL
- **Caching**: Redis (Job pre-loading & Candidate lists)
- **Search**: Elasticsearch (Multi-field match with boosting)
- **Queues**: BullMQ (Resume parsing & Email notifications)
- **Concurrency**: Redlock (Distributed Resource Locking)
