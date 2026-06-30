import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Card, Button, CircularProgress } from '@mui/material';
import { Download, ShowChart, LocalActivity, AttachMoney, AssignmentTurnedIn } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

export const Reports: React.FC = () => {
  const { getReports } = useApp();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReportData(data);
      } catch (err) {
        console.error('Failed to load reports:', err);
        toast.error('Failed to load analytical reports.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [getReports]);
  const exportData = (format: 'pdf' | 'csv') => {
    if (format === 'csv') {
      const csvRows = [
        ["Gross Sales", "Tickets Booked", "Refunds Ratio", "Peak Hour"],
        [reportData?.grossSales || 0, reportData?.ticketsBooked || 0, `${reportData?.refundsRatio || 0}%`, reportData?.peakHour || "07:00 PM"],
        [],
        ["Hall Name", "Occupancy"]
      ];
      
      reportData?.hallUtilization?.forEach((h: any) => {
        csvRows.push([`${h.hallName} Hall`, `${h.occupancy}%`]);
      });

      const csvContent = "data:text/csv;charset=utf-8," 
        + csvRows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `MarvelCinema_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Report exported successfully as CSV!');
    } else {
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333;">
          <h1 style="color: #C1121F; margin-bottom: 5px; font-size: 28px;">Marvel Cinema Sales & Analytics Report</h1>
          <div style="color: #777; font-size: 13px; margin-bottom: 30px;">Generated on: ${new Date().toLocaleString()}</div>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; background-color: #fafafa;">
              <div style="font-size: 11px; color: #777; text-transform: uppercase; font-weight: bold;">Gross Sales</div>
              <div style="font-size: 20px; font-weight: bold; margin-top: 5px; color: #111;">$${reportData?.grossSales?.toLocaleString() || '0'}</div>
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; background-color: #fafafa;">
              <div style="font-size: 11px; color: #777; text-transform: uppercase; font-weight: bold;">Tickets Booked</div>
              <div style="font-size: 20px; font-weight: bold; margin-top: 5px; color: #111;">${reportData?.ticketsBooked || 0}</div>
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; background-color: #fafafa;">
              <div style="font-size: 11px; color: #777; text-transform: uppercase; font-weight: bold;">Refunds Ratio</div>
              <div style="font-size: 20px; font-weight: bold; margin-top: 5px; color: #111;">${reportData?.refundsRatio || 0}%</div>
            </div>
            <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; background-color: #fafafa;">
              <div style="font-size: 11px; color: #777; text-transform: uppercase; font-weight: bold;">Peak Hour</div>
              <div style="font-size: 20px; font-weight: bold; margin-top: 5px; color: #111;">${reportData?.peakHour || '07:00 PM'}</div>
            </div>
          </div>
          
          <h2 style="font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #C1121F; padding-bottom: 5px; color: #111;">Hall Utilization</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px;">Hall Name</th>
                <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px;">Occupancy</th>
              </tr>
            </thead>
            <tbody>
              ${reportData?.hallUtilization?.map((h: any) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px; font-size: 13px;">${h.hallName} Hall</td>
                  <td style="border: 1px solid #ddd; padding: 10px; font-size: 13px; font-weight: bold; color: #C1121F;">${h.occupancy}%</td>
                </tr>
              `).join('') || '<tr><td colspan="2" style="text-align:center; padding:10px; color:#999;">No halls data available</td></tr>'}
            </tbody>
          </table>
        </div>
      `;
      const options = {
        margin: 10,
        filename: `MarvelCinema_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      const html2pdf = (window as any).html2pdf;
      if (html2pdf) {
        html2pdf().from(element).set(options).save()
          .then(() => {
            toast.success('Report PDF downloaded successfully!');
          })
          .catch((err: any) => {
            console.error('PDF Generation error:', err);
            toast.error('Failed to download PDF.');
          });
      } else {
        toast.error('PDF engine not loaded yet. Please try again.');
      }
    }
  };

  const breadcrumbs = [
    { label: 'Admin Dashboard', path: '/admin' },
    { label: 'Reports & Analytics' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress sx={{ color: '#C1121F' }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Header title="Reports & Analytics" breadcrumbs={breadcrumbs} />

      {/* Export Controls */}
      <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 flex justify-between items-center shadow-xl">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Financial Reports Console</h3>
          <p className="text-[10px] text-gray-500 mt-1">Export transaction logs and booking activity tallies.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={() => exportData('csv')}
            sx={{ color: '#FFF', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Download />}
            onClick={() => exportData('pdf')}
            sx={{ bgcolor: '#C1121F', '&:hover': { bgcolor: '#A00F19' } }}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Analytical Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="text-gray-500 mb-2"><AttachMoney /></div>
            <p className="text-gray-400 uppercase font-bold tracking-wider text-xs">Gross Sales</p>
            <h4 className="text-2xl font-black text-white mt-2">${reportData?.grossSales?.toLocaleString() || '0'}</h4>
            <p className="text-[10px] text-emerald-400 mt-1 font-semibold">Live revenue from SQL database</p>
          </Card>
        </div>
        
        <div>
          <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="text-gray-500 mb-2"><LocalActivity /></div>
            <p className="text-gray-400 uppercase font-bold tracking-wider text-xs">Tickets Booked</p>
            <h4 className="text-2xl font-black text-white mt-2">{reportData?.ticketsBooked || '0'} tickets</h4>
            <p className="text-[10px] text-gray-500 mt-1 font-semibold">Real-time seat reservations</p>
          </Card>
        </div>

        <div>
          <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="text-gray-500 mb-2"><AssignmentTurnedIn /></div>
            <p className="text-gray-400 uppercase font-bold tracking-wider text-xs">Refunds Ratio</p>
            <h4 className="text-2xl font-black text-red-400 mt-2">{reportData?.refundsRatio || '0'}%</h4>
            <p className="text-[10px] text-gray-550 mt-1 font-semibold">{reportData?.cancellationsCount || '0'} cancellations total</p>
          </Card>
        </div>

        <div>
          <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="text-gray-500 mb-2"><ShowChart /></div>
            <p className="text-gray-400 uppercase font-bold tracking-wider text-xs">Peak Hour</p>
            <h4 className="text-2xl font-black text-[#FFD700] mt-2">{reportData?.peakHour || '07:00 PM'}</h4>
            <p className="text-[10px] text-gray-550 mt-1 font-semibold">Top booked showtime slot</p>
          </Card>
        </div>
      </div>

      {/* Hall Occupancy (CSS Chart) */}
      <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">Hall Utilization Rate</h3>
        <div className="space-y-4">
          {reportData?.hallUtilization?.map((item: any) => {
            const displayColor = item.hallName.toLowerCase() === 'platinum' ? 'text-amber-400'
                               : item.hallName.toLowerCase() === 'silver' ? 'text-[#C0C0C0]'
                               : 'text-orange-400';
            const widthPct = `${item.occupancy}%`;
            return (
              <div className="space-y-1.5" key={item.hallName}>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-white">{item.hallName} Hall</span>
                  <span className={displayColor}>{item.occupancy}% Occupancy</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#C1121F] to-amber-500" style={{ width: widthPct }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Reports;
