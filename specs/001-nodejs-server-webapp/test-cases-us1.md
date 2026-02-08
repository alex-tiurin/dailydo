# Text Test Cases: User Story 1 — Backend Serves Application Data

**Feature**: 001-nodejs-server-webapp  
**Date**: 2025-02-07

## List days

| ID   | Precondition     | Action           | Expected result                    |
|------|------------------|------------------|------------------------------------|
| L1   | No data          | GET /days        | 200, body []                       |
| L2   | One or more days | GET /days        | 200, array of Day, newest first   |

## Create day

| ID   | Precondition | Action                          | Expected result                          |
|------|--------------|----------------------------------|------------------------------------------|
| C1   | —            | POST /days { "name": "Today" }   | 201, Day with id, name, tasks [], createdAt |
| C2   | —            | POST /days { "name": "X", "tasks": [{ "label": "L1" }] } | 201, Day with one task (id, label, done: false) |
| C3   | —            | POST /days {}                    | 400, { "error": "..." }                  |
| C4   | —            | POST /days { "name": "" }        | 400, { "error": "..." }                  |

## Get day

| ID   | Precondition | Action           | Expected result        |
|------|--------------|------------------|------------------------|
| G1   | Day exists    | GET /days/:id    | 200, Day               |
| G2   | Day missing   | GET /days/:id    | 404, { "error": "..." } |

## Update day (mark task done)

| ID   | Precondition              | Action                              | Expected result        |
|------|---------------------------|-------------------------------------|------------------------|
| U1   | Day exists, task exists   | PATCH /days/:id { "tasks": [...] }  | 200, updated Day        |
| U2   | Day missing               | PATCH /days/:id { "tasks": [] }     | 404, { "error": "..." } |
