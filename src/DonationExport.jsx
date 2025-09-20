import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify"; // 👈 import toast

const DonationExport = () => {
  const [selectedRange, setSelectedRange] = useState("week");

  const downloadExcel = async (range) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://localhost:8004/donations/export?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.data || res.data.length === 0) {
        toast.warn("No donation data found for selected range.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(res.data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, `donations_${range}.xlsx`);
      toast.success(`✅ Downloaded donations for ${range}`);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("❌ Download failed. Please try again.");
    }
  };

  return (
    <div style={{ marginTop: "30px", textAlign: "center", color: "white" }}>
      <h3>📥 Export Donations to Excel</h3>

      <div style={{ display: "inline-flex", gap: "10px", marginTop: "10px" }}>
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value='week'>Past Week</option>
          <option value='month'>Past Month</option>
          <option value='90days'>Last 90 Days</option>
        </select>

        <button
          onClick={() => downloadExcel(selectedRange)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Download Excel
        </button>
      </div>
    </div>
  );
};

export default DonationExport;
