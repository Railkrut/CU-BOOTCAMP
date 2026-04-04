import { api, getStableClientId, withQuery } from "./apiClient";

const getClientId = () => getStableClientId();

export const testApi = {
  health: () => api("/test3/health"),
  getCases: () => api("/test3/cases"),
  getCaseById: (caseId) => api(`/test3/cases/${caseId}`),
  getCasesProgress: () =>
    api(withQuery("/test3/cases/progress", { client_id: getClientId() })),
  markCaseSolved: (caseId) =>
    api("/test3/cases/progress/mark-solved", {
      method: "POST",
      body: JSON.stringify({ client_id: getClientId(), case_id: caseId }),
    }),
  unmarkCaseSolved: (caseId) =>
    api("/test3/cases/progress/unmark-solved", {
      method: "POST",
      body: JSON.stringify({ client_id: getClientId(), case_id: caseId }),
    }),
  resetCasesProgress: () =>
    api("/test3/cases/progress/reset", {
      method: "POST",
      body: JSON.stringify({ client_id: getClientId() }),
    }),
  startCase: (caseId) =>
    api("/test3/case/start", {
      method: "POST",
      body: JSON.stringify({ client_id: getClientId(), case_id: caseId }),
    }),
  submitCase: (solutionText) =>
    api("/test3/case/submit", {
      method: "POST",
      body: JSON.stringify({
        client_id: getClientId(),
        solution_text: solutionText,
      }),
    }),
  followupCase: (message) =>
    api("/test3/case/followup", {
      method: "POST",
      body: JSON.stringify({ client_id: getClientId(), message }),
    }),
  getCaseState: () =>
    api(withQuery("/test3/case/state", { client_id: getClientId() })),
};
