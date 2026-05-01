/**
 * Mock Data
 * Simulates raw data that would normally come from GitHub + Jira APIs.
 *
 * Shapes:
 *   PullRequest  { id, title, openedAt, mergedAt, deployedAt }
 *   Issue        { id, title, type, startedAt, completedAt }
 *   Deployment   { id, deployedAt, environment }
 */

const mockData = {

  /* ── Pull Requests ───────────────────────────────────────────────────────── */
  pullRequests: [
    {
      id: 'pr-001', title: 'Add user authentication',
      openedAt:  '2024-01-02T09:00:00Z',
      mergedAt:  '2024-01-04T14:00:00Z',
      deployedAt:'2024-01-05T10:00:00Z',
    },
    {
      id: 'pr-002', title: 'Fix login page redirect bug',
      openedAt:  '2024-01-06T10:00:00Z',
      mergedAt:  '2024-01-07T11:00:00Z',
      deployedAt:'2024-01-08T09:00:00Z',
    },
    {
      id: 'pr-003', title: 'Refactor database queries',
      openedAt:  '2024-01-08T08:00:00Z',
      mergedAt:  '2024-01-12T16:00:00Z',
      deployedAt:'2024-01-14T11:00:00Z',
    },
    {
      id: 'pr-004', title: 'Add payment integration',
      openedAt:  '2024-01-15T09:00:00Z',
      mergedAt:  '2024-01-19T15:00:00Z',
      deployedAt:'2024-01-22T10:00:00Z',
    },
    {
      id: 'pr-005', title: 'Update API documentation',
      openedAt:  '2024-01-22T10:00:00Z',
      mergedAt:  '2024-01-23T12:00:00Z',
      deployedAt:'2024-01-24T09:00:00Z',
    },
    {
      id: 'pr-006', title: 'Implement search feature',
      openedAt:  '2024-01-25T09:00:00Z',
      mergedAt:  '2024-01-30T17:00:00Z',
      deployedAt:'2024-02-01T10:00:00Z',
    },
    {
      id: 'pr-007', title: 'Fix performance issue in feed',
      openedAt:  '2024-02-01T09:00:00Z',
      mergedAt:  '2024-02-02T14:00:00Z',
      deployedAt:'2024-02-03T09:00:00Z',
    },
    {
      id: 'pr-008', title: 'Add dark mode support',
      openedAt:  '2024-02-05T10:00:00Z',
      mergedAt:  '2024-02-10T11:00:00Z',
      deployedAt:'2024-02-12T09:00:00Z',
    },
  ],

  /* ── Issues / Tasks ──────────────────────────────────────────────────────── */
  issues: [
    { id:'iss-001', type:'feature', title:'User auth flow',         startedAt:'2024-01-02T09:00:00Z', completedAt:'2024-01-05T17:00:00Z' },
    { id:'iss-002', type:'bug',     title:'Login redirect bug',     startedAt:'2024-01-06T10:00:00Z', completedAt:'2024-01-07T16:00:00Z' },
    { id:'iss-003', type:'chore',   title:'DB query refactor',      startedAt:'2024-01-08T08:00:00Z', completedAt:'2024-01-14T17:00:00Z' },
    { id:'iss-004', type:'feature', title:'Payment gateway',        startedAt:'2024-01-15T09:00:00Z', completedAt:'2024-01-22T17:00:00Z' },
    { id:'iss-005', type:'bug',     title:'Payment timeout error',  startedAt:'2024-01-20T10:00:00Z', completedAt:'2024-01-21T15:00:00Z' },
    { id:'iss-006', type:'feature', title:'Search functionality',   startedAt:'2024-01-25T09:00:00Z', completedAt:'2024-02-01T17:00:00Z' },
    { id:'iss-007', type:'bug',     title:'Feed performance bug',   startedAt:'2024-02-01T09:00:00Z', completedAt:'2024-02-03T16:00:00Z' },
    { id:'iss-008', type:'feature', title:'Dark mode',              startedAt:'2024-02-05T10:00:00Z', completedAt:'2024-02-12T17:00:00Z' },
    { id:'iss-009', type:'bug',     title:'Dark mode contrast bug', startedAt:'2024-02-10T09:00:00Z', completedAt:'2024-02-11T14:00:00Z' },
    { id:'iss-010', type:'chore',   title:'Update dependencies',    startedAt:'2024-02-13T09:00:00Z', completedAt:'2024-02-14T12:00:00Z' },
  ],

  /* ── Deployments ─────────────────────────────────────────────────────────── */
  deployments: [
    { id:'dep-001', deployedAt:'2024-01-05T10:00:00Z', environment:'production' },
    { id:'dep-002', deployedAt:'2024-01-08T09:00:00Z', environment:'production' },
    { id:'dep-003', deployedAt:'2024-01-14T11:00:00Z', environment:'production' },
    { id:'dep-004', deployedAt:'2024-01-22T10:00:00Z', environment:'production' },
    { id:'dep-005', deployedAt:'2024-01-24T09:00:00Z', environment:'production' },
    { id:'dep-006', deployedAt:'2024-02-01T10:00:00Z', environment:'production' },
    { id:'dep-007', deployedAt:'2024-02-03T09:00:00Z', environment:'production' },
    { id:'dep-008', deployedAt:'2024-02-12T09:00:00Z', environment:'production' },
  ],

  /* ── Meta ────────────────────────────────────────────────────────────────── */
  meta: {
    developerName: 'Alex Johnson',
    role:          'Senior Software Engineer',
    team:          'Platform Engineering',
    reportPeriod: {
      start: '2024-01-01T00:00:00Z',
      end:   '2024-02-28T23:59:59Z',
    },
  },
};

module.exports = mockData;