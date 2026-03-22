"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { Typography, Paper, Chip, CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { myReport } from "@/redux/Slices/reportSlice"; 
import { useTranslation } from "react-i18next";

export default function ReportsTab() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const observerTarget = useRef(null);

  const { reports, loadingReports } = useSelector((state) => state.report);
  const { data: reportsData, current_page, last_page } = reports || {};

  useEffect(() => {
    dispatch(myReport(1));
  }, [dispatch]);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && current_page < last_page && !loadingReports) {
        dispatch(myReport(current_page + 1));
      }
    },
    [dispatch, current_page, last_page, loadingReports]
  );

  useEffect(() => {
    const element = observerTarget.current;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });

    if (element) observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Typography variant="h5" className="font-black mb-4">
        {t("settings.reportHistory", "Report History")}
      </Typography>
      
      <div className="space-y-4">
        {reportsData?.length > 0 ? (
          <>
            {reportsData.map((report) => (
              <Paper
                key={report.report_id}
                elevation={0}
                className="p-5 border border-[#e7edf7] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Typography className="font-extrabold text-[#0f172a]">
                      Report #{report.report_id}
                    </Typography>
                    <Chip
                      label={report.report_type.toUpperCase()}
                      size="small"
                      className="bg-slate-100 text-slate-600 text-[11px] font-black"
                    />
                  </div>
                  <Typography className="text-[#64748b] text-sm font-medium">
                    {t("settings.reason", "Reason: ")} {report.reason}
                  </Typography>
                  <Typography className="text-[#94a3b8] text-xs mt-2">
                    {t("settings.submitted", "Submitted: ")} {new Date(report.created_at).toLocaleDateString()}
                  </Typography>
                </div>
                <Chip
                  label={report.status}
                  className={`font-bold ${
                    report.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                />
              </Paper>
            ))}
            
            <div ref={observerTarget} className="py-4 flex justify-center w-full">
              {current_page < last_page && (
                <CircularProgress size={24} sx={{ color: "#64748b" }} />
              )}
              {current_page >= last_page && reportsData.length > 5 && (
                <Typography className="text-sm text-slate-400">
                  {t("settings.noMoreReports", "No more reports to show.")}
                </Typography>
              )}
            </div>
          </>
        ) : !loadingReports ? (
          <Paper
            elevation={0}
            className="p-8 border border-dashed border-[#e7edf7] rounded-2xl text-center bg-transparent"
          >
            <Typography className="text-slate-400 font-medium">
              {t("settings.noReportsYet", "You haven't submitted any reports yet.")}
            </Typography>
          </Paper>
        ) : null}

        {loadingReports && !reportsData && (
           <div className="flex justify-center py-10">
              <CircularProgress size={30} sx={{ color: "#1477ff" }} />
           </div>
        )}
      </div>
    </div>
  );
}
