# Text Test Cases: User Story 2 — Server and Webapp Run in Parallel

**Feature**: 001-nodejs-server-webapp  
**Date**: 2025-02-07

## Start server and webapp

| ID  | Precondition   | Action                         | Expected result                                      |
|-----|----------------|---------------------------------|------------------------------------------------------|
| S1  | No processes   | Start server (e.g. cd server && npm start) | Server listens on PORT (default 3001); no error       |
| S2  | Server running | Start webapp (e.g. cd webapp && npm run dev) | Webapp listens on its port (e.g. 3000); no conflict  |
| S3  | Both running   | Open http://localhost:3001/api-docs | Swagger UI loads                                     |
| S4  | Both running   | Open webapp in browser          | App loads; if API URL configured, data can come from server |

## Full flow (manual)

| ID  | Precondition   | Action                         | Expected result                                      |
|-----|----------------|---------------------------------|------------------------------------------------------|
| F1  | Server + webapp running, API URL set in webapp | Create a day in UI, add tasks, mark one done | Data persists; after refresh, data still present (from server) |
