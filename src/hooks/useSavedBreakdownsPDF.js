export function useSavedBreakdownsPDF(_, __, setSavedBreakdowns, savedBreakdowns) {
  const loadScript = (src, globalName) => {
    return new Promise((resolve, reject) => {
      if (window[globalName]) return resolve(window[globalName]);
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve(window[globalName]);
      s.onerror = (e) => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  };

  const exportBreakdownPDF = async (breakdownItem) => {
    try {
      const jspdfGlobal = window.jspdf || window.jspPDF || (await loadScript('https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js', 'jspdf'));
      const PDFClass = jspdfGlobal?.jsPDF || jspdfGlobal?.default || jspdfGlobal || null;
      if (!PDFClass) throw new Error('jsPDF unavailable');

      const pdf = new PDFClass('p', 'mm', 'a4');
      let y = 15;
      pdf.setFont('helvetica', '');
      pdf.setFontSize(16);
      pdf.text(`Saved Breakdown - ${new Date(breakdownItem.createdAt).toLocaleString()}`, 10, y);
      y += 10;
      pdf.setFontSize(12);
      pdf.text(`Destination: ${breakdownItem.destination || ''}`, 10, y);
      y += 8;
      pdf.setFontSize(11);
      breakdownItem.items.forEach(it => {
        pdf.text(`${it.date || ''} | ${it.hotel || ''} ($${it.hotelPrice || 0}) | ${it.lunch ? it.lunch + ' ($' + (it.lunchPrice || 0) + ')' : ''} | ${it.dinner ? it.dinner + ' ($' + (it.dinnerPrice || 0) + ')' : ''} | Total: $${it.total || 0}`.trim(), 10, y);
        y += 7;
        if (y > 270) { pdf.addPage(); y = 15; }
      });
      y += 5;
      pdf.setFontSize(13);
      pdf.text(`Grand Total: $${breakdownItem.grand || 0}`, 10, y);
      pdf.save(`saved-breakdown-${breakdownItem.id}.pdf`);
    } catch (e) {
      alert('PDF export error: ' + (e.message || 'error'));
    }
  };

  const deleteBreakdown = (breakdownId) => {
    const arr = savedBreakdowns.filter(x => x.id !== breakdownId);
    localStorage.setItem('hb_saved_breakdowns', JSON.stringify(arr));
    setSavedBreakdowns(arr); 
  };

  return { exportBreakdownPDF, deleteBreakdown };
}
