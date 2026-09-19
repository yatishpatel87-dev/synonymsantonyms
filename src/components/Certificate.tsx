import React, { useRef } from 'react';
import { RoundResult } from '../types';
import { Download, Printer, Award, CheckCircle, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';

interface CertificateProps {
  result: RoundResult;
}

export const Certificate: React.FC<CertificateProps> = ({ result }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleDownloadPNG = () => {
    sound.playClick();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1200, 840);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(1, '#020617');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 840);

    // Golden Borders
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 780);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(46, 46, 1108, 748);

    // Decorative corner accents
    ctx.fillStyle = '#f59e0b';
    const corners = [
      [55, 55],
      [1145, 55],
      [55, 785],
      [1145, 785],
    ];
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('SYNONYM – ANTONYM VOCABULARY BATTLE', 600, 130);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Cinzel", Georgia, serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 190);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('THIS PRESTIGIOUS HONOR IS OFFICIALLY PRESENTED TO', 600, 240);

    // Student Name
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 50px "Cinzel", Georgia, serif';
    ctx.fillText(result.studentName, 600, 315);

    // Decorative Line under Name
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 340);
    ctx.lineTo(850, 340);
    ctx.stroke();

    // Achievement text
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '20px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '0.5px';
    const levelText = result.level.toUpperCase();
    const modeText = result.mode === 'synonym' ? 'SYNONYM' : result.mode === 'antonym' ? 'ANTONYM' : 'SYNONYM & ANTONYM BATTLE';
    ctx.fillText(
      `for outstanding linguistic performance in the ${levelText} level (${modeText} MODE)`,
      600,
      390
    );

    // Title / Rank Badge
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `${result.vocabularyTitle.badgeIcon} ${result.vocabularyTitle.en} • ${result.vocabularyTitle.gu}`,
      600,
      440
    );

    // Stats Grid Box
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.roundRect(200, 480, 800, 140, 16);
    ctx.fill();
    ctx.stroke();

    // Stats Columns
    ctx.textAlign = 'center';

    // Score
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('FINAL SCORE', 330, 525);
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(String(result.score), 330, 575);

    // Accuracy
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ACCURACY', 600, 525);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${result.accuracy}%`, 600, 575);

    // Correct / Total
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('QUESTIONS CLEARED', 870, 525);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${result.correctCount} / ${result.totalQuestions}`, 870, 575);

    // Footer - Date & Certificate ID
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Issued: ${result.completedAt}`, 100, 720);
    ctx.fillText(`Certificate ID: ${result.certificateId}`, 100, 745);

    // Verified Seal
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('★ OFFICIAL VOCABULARY ARENA ★', 1100, 720);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Verified Digital Credential', 1100, 745);

    // Download trigger
    const link = document.createElement('a');
    link.download = `Vocabulary_Certificate_${result.studentName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="w-full">
      {/* Hidden canvas for PNG export */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Visual Certificate Card */}
      <div
        id="printable-certificate"
        className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-4 border-amber-600/80 rounded-2xl p-6 sm:p-10 shadow-2xl overflow-hidden print:border-8 print:border-amber-700 print:text-black print:bg-white"
      >
        {/* Ornate Inner Border */}
        <div className="absolute inset-3 border border-amber-500/30 rounded-xl pointer-events-none" />

        {/* Decorative Golden Corner Accents */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

        {/* Certificate Header */}
        <div className="text-center relative z-10 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Official Credential of Vocabulary Proficiency</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wider font-serif uppercase print:text-slate-900">
            Certificate of Achievement
          </h2>
          <p className="text-xs sm:text-sm text-amber-400/90 font-medium tracking-wide mt-1">
            પ્રમાણપત્ર • SYNONYM–ANTONYM VOCABULARY BATTLE
          </p>
        </div>

        {/* Recipient Presentation */}
        <div className="text-center my-6 relative z-10">
          <p className="text-xs sm:text-sm text-slate-400 tracking-wider uppercase font-medium print:text-slate-600">
            This certificate is proudly awarded to
          </p>

          <div className="text-3xl sm:text-5xl font-black text-amber-400 my-2 font-serif tracking-wide print:text-amber-800">
            {result.studentName}
          </div>

          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-4" />

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed print:text-slate-700">
            for successfully conquering 20 rigorous vocabulary trials in{' '}
            <strong className="text-white uppercase print:text-black">{result.level}</strong> level under{' '}
            <strong className="text-amber-300 uppercase print:text-black">{result.mode} MODE</strong>.
          </p>

          {/* Evaluated Vocabulary Level Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-xl bg-slate-900/90 border border-amber-500/40 shadow-inner">
            <span className="text-2xl">{result.vocabularyTitle.badgeIcon}</span>
            <div className="text-left">
              <div className="text-xs text-slate-400">Assessed Vocabulary Rating:</div>
              <div className="text-sm sm:text-base font-bold text-amber-300">
                {result.vocabularyTitle.en} ({result.vocabularyTitle.gu})
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-3 my-6 max-w-2xl mx-auto relative z-10 text-center">
          <div className="p-3 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:border-slate-300 print:bg-slate-100">
            <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Total Score</div>
            <div className="text-xl sm:text-3xl font-black text-amber-400 font-mono mt-1 print:text-amber-700">
              {result.score}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:border-slate-300 print:bg-slate-100">
            <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Accuracy</div>
            <div className="text-xl sm:text-3xl font-black text-emerald-400 font-mono mt-1 print:text-emerald-700">
              {result.accuracy}%
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:border-slate-300 print:bg-slate-100">
            <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Cleared</div>
            <div className="text-xl sm:text-3xl font-black text-sky-400 font-mono mt-1 print:text-sky-700">
              {result.correctCount}/{result.totalQuestions}
            </div>
          </div>
        </div>

        {/* Official Footer Verification */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative z-10 print:text-slate-600">
          <div>
            <div>Date: <span className="text-slate-200 font-medium">{result.completedAt}</span></div>
            <div>Certificate ID: <span className="font-mono text-amber-400/90 font-semibold">{result.certificateId}</span></div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-amber-500/30 text-amber-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Knowledge Seal</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Download & Print */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 print:hidden">
        <button
          type="button"
          id="download-cert-btn"
          onClick={handleDownloadPNG}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Download Certificate (PNG)</span>
        </button>

        <button
          type="button"
          id="print-cert-btn"
          onClick={handlePrint}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-300" />
          <span>Print / Save as PDF</span>
        </button>
      </div>
    </div>
  );
};
