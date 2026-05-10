/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AgendaTopic {
  title: string;
  summary: string;
  actionItems: string[];
  stakeholders: string[];
  durationMinutes: number;
}

export interface MeetingAgenda {
  title: string;
  totalDuration: number;
  topics: AgendaTopic[];
  overallSummary: string;
}
