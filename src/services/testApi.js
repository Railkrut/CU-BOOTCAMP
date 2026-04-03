import { api } from "./apiClient";

export const testApi = {
  health: () => api("/test/health"),
  getCases: () => api("/test/cases"),
  getCaseById: (caseId) => api(`/test/cases/${caseId}`),
  /** GET /test/cases/progress — solved / unsolved списки и счётчики */
  getCasesProgress: () => api("/test/cases/progress"),
  markCaseSolved: (caseId) =>
    api("/test/cases/progress/mark-solved", {
      method: "POST",
      body: JSON.stringify({ case_id: caseId }),
    }),
  unmarkCaseSolved: (caseId) =>
    api("/test/cases/progress/unmark-solved", {
      method: "POST",
      body: JSON.stringify({ case_id: caseId }),
    }),
  resetCasesProgress: () =>
    api("/test/cases/progress/reset", {
      method: "POST",
    }),
  startCase: (caseId) =>
    api("/test/case/start", {
      method: "POST",
      body: JSON.stringify({ case_id: caseId }),
    }),
  submitCase: (solutionText) =>
    api("/test/case/submit", {
      method: "POST",
      body: JSON.stringify({ solution_text: solutionText }),
    }),
  followupCase: (message) =>
    api("/test/case/followup", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
  getCaseState: () => api("/test/case/state"),
};
