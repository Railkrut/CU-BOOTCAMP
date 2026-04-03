import { api } from "./apiClient";

export const trainerApi = {
  health: () => api("/health"),
  getCases: () => api("/api/v1/cases"),
  getCaseById: (caseId) => api(`/api/v1/cases/${caseId}`),
  createIdeaSession: (payload) =>
    api("/api/v1/idea-sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  sendIdeaMessage: (sessionId, payload) =>
    api(`/api/v1/idea-sessions/${sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createCaseSession: (payload) =>
    api("/api/v1/case-sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  submitCaseSolution: (sessionId, payload) =>
    api(`/api/v1/case-sessions/${sessionId}/submit`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  sendCaseMessage: (sessionId, payload) =>
    api(`/api/v1/case-sessions/${sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  completeProgress: (payload) =>
    api("/api/v1/progress/complete", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getStats: (clientId) => api(`/api/v1/stats/${clientId}`),
};
