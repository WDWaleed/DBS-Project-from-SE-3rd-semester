"use client";

import Spinner from "@/components/atoms/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";

interface ReportItem {
  [key: string]: any;
}

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [reportData, setReportData] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const reports = [
    {
      id: "overdue-books",
      name: "Overdue Books",
      description: "Books that are past their due date",
    },
    {
      id: "frequent-borrowers",
      name: "Frequent Borrowers",
      description: "Members who have borrowed more than 5 books",
    },
    {
      id: "member-stats",
      name: "Member Statistics",
      description: "Borrowing statistics for all members",
    },
    {
      id: "borrow-duration-stats",
      name: "Borrow Duration Stats",
      description: "Average and range of borrow durations",
    },
  ];

  const fetchReport = async (reportId: string) => {
    setIsLoading(true);
    try {
      let url = `/api/reports/${reportId}`;
      if (reportId === "available") {
        url = "/api/books/available";
      }

      const res = await axios.get(url);
      // Handle both array and single object responses
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report:", error);
      setReportData([]);
    }
    setIsLoading(false);
  };

  const handleReportSelect = (reportId: string) => {
    setSelectedReport(reportId);
    fetchReport(reportId);
  };

  const renderTable = () => {
    if (!reportData || reportData.length === 0) return null;

    // Filter out any invalid items and ensure we have at least one valid item
    const validData = reportData.filter(
      (item) => item && typeof item === "object"
    );
    if (validData.length === 0) return null;

    const headers = Object.keys(validData[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-border">
          <thead className="bg-sidebar">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border"
                >
                  {header
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-background">
            {validData.map((item, index) => (
              <tr key={index} className="border-b border-border">
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-4 py-2 text-sm text-foreground"
                  >
                    {item[header]?.toString() || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-6">Library Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedReport === report.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => handleReportSelect(report.id)}
          >
            <h3 className="font-semibold text-lg">{report.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {report.description}
            </p>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            {reports.find((r) => r.id === selectedReport)?.name} Report
          </h2>

          {isLoading ? <Spinner /> : renderTable()}
        </div>
      )}
    </main>
  );
}
