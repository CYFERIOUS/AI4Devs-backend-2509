# Session Prompts Log

This document tracks all prompts and interactions from this development session.

---

## Prompt 1

**Timestamp:** Session Start

**User Request:**
```
for all this session create a  prompts.md and save it in root
```

**Action Taken:**
- Created `prompts.md` file in the root directory to track all prompts from this session

---

## Prompt 2

**Timestamp:** Session Continuation

**User Request:**
```
make a list of all endpoints of this back end project
```

**Action Taken:**
- Analyzed route files, controllers, and API specification
- Created comprehensive list of all backend endpoints (see below)

---

## Prompt 3

**Timestamp:** Session Continuation

**User Request:**
```
make one more endpoint: GET /positions/:id/candidates with the following data: complete name of the candidate, current interview step, average points in the interview, and position ID
```

**Action Taken:**
- Created `positionService.ts` with `getCandidatesByPositionId` function
- Created `positionController.ts` with `getPositionCandidates` controller
- Created `positionRoutes.ts` with the GET route
- Registered position routes in `index.ts`
- Updated endpoint documentation in `prompts.md`

**Implementation Details:**
- Service queries Applications for the given positionId
- Includes candidate data (firstName, lastName), interviewStep name, and all interviews
- Calculates average points from interview scores (null if no scores exist)
- Returns formatted array with completeName, currentInterviewStep, averagePoints, and positionId

---

## Prompt 4

**Timestamp:** Session Continuation

**User Request:**
```
make another endpoint with PUT /candidates/:id/stage, this endpoint will update the position of the candidate in the step of the process
```

**Action Taken:**
- Added `updateCandidateInterviewStep` function to `candidateService.ts`
- Created `updateCandidateStage` controller in `candidateController.ts`
- Added PUT route `/candidates/:id/stage` to `candidateRoutes.ts`
- Updated endpoint documentation in `prompts.md`

**Implementation Details:**
- Service validates candidate, position, and interview step exist
- Finds the application matching candidateId and positionId
- Updates the application's currentInterviewStep field
- Returns updated application data with candidate name, position title, and new interview step name
- Requires positionId in request body since candidates can have multiple applications

---

# Backend API Endpoints

## Base URL
```
http://localhost:3010
```

## Endpoints List

### 1. Root Endpoint
- **Method:** `GET`
- **Path:** `/`
- **Description:** Root endpoint that returns a greeting message
- **Response:** `200 OK`
- **Response Body:** `"Hola LTI!"`

---

### 2. Create Candidate
- **Method:** `POST`
- **Path:** `/candidates`
- **Description:** Adds a new candidate to the system
- **Request Body:** JSON object with candidate data
  - `firstName` (string, required): First name (2-50 chars, letters only)
  - `lastName` (string, required): Last name (2-50 chars, letters only)
  - `email` (string, required): Email address (valid email format)
  - `phone` (string, required): Phone number (valid phone format)
  - `address` (string, optional): Address (max 100 chars)
  - `educations` (array, optional): Education history
    - `institution` (string): Institution name (max 100 chars)
    - `title` (string): Degree or title (max 100 chars)
    - `startDate` (string): Start date (YYYY-MM-DD format)
    - `endDate` (string): End date (YYYY-MM-DD format)
  - `workExperiences` (array, optional): Work experience
    - `company` (string): Company name (max 100 chars)
    - `position` (string): Position held (max 100 chars)
    - `description` (string): Job responsibilities (max 200 chars)
    - `startDate` (string): Start date (YYYY-MM-DD format)
    - `endDate` (string): End date (YYYY-MM-DD format)
  - `cv` (object, optional): CV file information
    - `filePath` (string): Path to the CV file
    - `fileType` (string): Type of the CV file
- **Response:** `201 Created` - Returns created candidate data
- **Error Responses:**
  - `400 Bad Request` - Invalid input data
  - `500 Internal Server Error` - Server error

---

### 3. Get Candidate by ID
- **Method:** `GET`
- **Path:** `/candidates/:id`
- **Description:** Retrieves a candidate by their ID
- **Path Parameters:**
  - `id` (integer, required): Candidate ID
- **Response:** `200 OK` - Returns candidate data
- **Error Responses:**
  - `400 Bad Request` - Invalid ID format
  - `404 Not Found` - Candidate not found
  - `500 Internal Server Error` - Server error

---

### 4. Upload File
- **Method:** `POST`
- **Path:** `/upload`
- **Description:** Uploads a file to the server (PDF or DOCX only)
- **Request Body:** `multipart/form-data`
  - `file` (file, required): File to upload
    - Allowed types: PDF (`application/pdf`) or DOCX (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
    - Max file size: 10MB
- **Response:** `200 OK`
  - Response Body:
    ```json
    {
      "filePath": "string",
      "fileType": "string"
    }
    ```
- **Error Responses:**
  - `400 Bad Request` - Invalid file type (only PDF and DOCX allowed)
  - `500 Internal Server Error` - Error during file upload

---

### 5. Get Candidates by Position ID
- **Method:** `GET`
- **Path:** `/positions/:id/candidates`
- **Description:** Retrieves all candidates for a specific position with their interview information
- **Path Parameters:**
  - `id` (integer, required): Position ID
- **Response:** `200 OK` - Returns array of candidate information
  - Response Body:
    ```json
    [
      {
        "completeName": "string",
        "currentInterviewStep": "string",
        "averagePoints": number | null,
        "positionId": number
      }
    ]
    ```
  - Fields:
    - `completeName` (string): Full name of the candidate (firstName + lastName)
    - `currentInterviewStep` (string): Name of the current interview step the candidate is in
    - `averagePoints` (number | null): Average score from all interviews for this candidate's application (null if no interviews with scores exist)
    - `positionId` (number): The position ID
- **Error Responses:**
  - `400 Bad Request` - Invalid position ID format
  - `404 Not Found` - Position not found
  - `500 Internal Server Error` - Server error

---

### 6. Update Candidate Interview Stage
- **Method:** `PUT`
- **Path:** `/candidates/:id/stage`
- **Description:** Updates the candidate's current interview step for a specific position application
- **Path Parameters:**
  - `id` (integer, required): Candidate ID
- **Request Body:** JSON object
  - `positionId` (integer, required): Position ID to identify which application to update
  - `interviewStepId` (integer, required): New interview step ID to set as current step
- **Response:** `200 OK` - Returns updated application information
  - Response Body:
    ```json
    {
      "message": "Candidate interview step updated successfully",
      "data": {
        "candidateId": number,
        "positionId": number,
        "interviewStepId": number,
        "currentInterviewStep": "string",
        "candidateName": "string",
        "positionTitle": "string"
      }
    }
    ```
- **Error Responses:**
  - `400 Bad Request` - Invalid ID format or missing required fields
  - `404 Not Found` - Candidate, Position, Interview Step, or Application not found
  - `500 Internal Server Error` - Server error

---

## Notes

- All endpoints support CORS from `http://localhost:3000`
- The API uses JSON for request/response bodies (except `/upload` which uses `multipart/form-data`)
- Request logging middleware logs all requests with timestamp, method, and path
- Error handling middleware catches and formats errors appropriately

---

