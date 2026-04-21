import {create} from 'zustand';

import {DailyReport} from '../types/models';

interface ReportState {
  dailyReports: DailyReport[];
  setDailyReports: (reports: DailyReport[]) => void;
}

export const useReportStore = create<ReportState>(set => ({
  dailyReports: [],
  setDailyReports: reports => set({dailyReports: reports}),
}));
