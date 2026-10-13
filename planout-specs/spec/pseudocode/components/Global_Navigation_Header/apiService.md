// API Signature definition
SERVICE API:
    FUNCTION fetchUserContext():
        // Endpoint: GET /api/user/context
        // Returns JSON:
        // {
        //   "fullName": string,
        //   "role": string,
        //   "initials": string,
        //   "taskCounts": number
        // }
        RETURN HTTP.GET("/api/user/context")