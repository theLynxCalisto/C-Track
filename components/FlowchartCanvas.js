"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function FlowchartCanvas() {
  const { profile } = useSchedule();
  const canvasRef = useRef(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('pan'); 
  const [color, setColor] = useState('#e74c3c'); 
  const [penSize, setPenSize] = useState(3);
  const [isSaving, setIsSaving] = useState(false);

  const undoStack = useRef([]);
  const redoStack = useRef([]);
  
  const imagePath = `/flowcharts/${profile.major}_${profile.catalogYear}.png`;
  const storageKey = `ctrack_canvas_${profile.username}_${profile.major}_${profile.catalogYear}`;

  const saveStateToMemory = useCallback(() => {
    if (!canvasRef.current) return;
    undoStack.current.push(canvasRef.current.toDataURL());
    redoStack.current = []; 
  }, []);

  const restoreState = useCallback((dataUrl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (dataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = dataUrl;
    }
  }, []);

  const saveToProfile = useCallback(() => {
    if (canvasRef.current) {
      setIsSaving(true);
      localStorage.setItem(storageKey, canvasRef.current.toDataURL());
      setTimeout(() => setIsSaving(false), 1500);
    }
  }, [storageKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      restoreState(savedData);
      setTimeout(() => undoStack.current.push(savedData), 100);
    }
  }, [imagePath, storageKey, restoreState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.ctrlKey && !e.metaKey) {
        if (e.key.toLowerCase() === 'v') setMode('pan');
        if (e.key.toLowerCase() === 'b') setMode('draw');
        if (e.key.toLowerCase() === 'e') setMode('erase');
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (undoStack.current.length > 0) {
            redoStack.current.push(canvasRef.current.toDataURL());
            restoreState(undoStack.current.pop());
          }
        }
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          saveToProfile();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [restoreState, saveToProfile]);

  const startInteraction = (e) => {
    if (mode === 'pan') return; 
    saveStateToMemory(); 
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (mode === 'draw' || mode === 'erase') {
      setIsDrawing(true);
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (mode === 'stamp-x' || mode === 'stamp-o') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = 6;
      const stampSize = 20; 
      ctx.beginPath();
      if (mode === 'stamp-x') {
        ctx.moveTo(x - stampSize, y - stampSize);
        ctx.lineTo(x + stampSize, y + stampSize);
        ctx.moveTo(x + stampSize, y - stampSize);
        ctx.lineTo(x - stampSize, y + stampSize);
      } else if (mode === 'stamp-o') {
        ctx.arc(x, y, stampSize, 0, 2 * Math.PI);
      }
      ctx.stroke();
      saveToProfile();
    }
  };

  const draw = (e) => {
    if (!isDrawing || mode === 'pan') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = mode === 'erase' ? 'destination-out' : 'source-over';
    ctx.lineWidth = mode === 'erase' ? 25 : penSize;
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToProfile();
    }
  };

  if (!profile.major || !profile.catalogYear) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-slate-500">
        <span className="text-4xl mb-4">🗺️</span>
        <p className="font-bold">No Flowchart Loaded</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[750px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* TOOLBAR */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="flex bg-white border border-slate-300 rounded-md overflow-hidden shadow-sm">
          <button onClick={() => setMode('pan')} title="Pan (V)" className={`px-4 py-2 text-sm font-bold transition-colors ${mode === 'pan' ? 'bg-[#461D7C] text-white' : 'hover:bg-slate-100'}`}>🖐</button>
          <button onClick={() => setMode('draw')} title="Draw (B)" className={`px-4 py-2 text-sm font-bold border-l border-slate-300 transition-colors ${mode === 'draw' ? 'bg-[#461D7C] text-white' : 'hover:bg-slate-100'}`}>✏️</button>
          <button onClick={() => setMode('erase')} title="Erase (E)" className={`px-4 py-2 text-sm font-bold border-l border-slate-300 transition-colors ${mode === 'erase' ? 'bg-[#461D7C] text-white' : 'hover:bg-slate-100'}`}>🧼</button>
          <button onClick={() => setMode('stamp-x')} title="Stamp X" className={`px-4 py-2 text-sm font-bold border-l border-slate-300 transition-colors ${mode === 'stamp-x' ? 'bg-[#461D7C] text-white' : 'hover:bg-slate-100'}`}>❌</button>
          <button onClick={() => setMode('stamp-o')} title="Stamp O" className={`px-4 py-2 text-sm font-bold border-l border-slate-300 transition-colors ${mode === 'stamp-o' ? 'bg-[#461D7C] text-white' : 'hover:bg-slate-100'}`}>⭕</button>
        </div>

        {mode !== 'pan' && mode !== 'erase' && (
          <div className="flex items-center gap-2">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none p-0" />
            {mode === 'draw' && (
              <input type="range" min="1" max="15" value={penSize} onChange={(e) => setPenSize(e.target.value)} className="w-24 cursor-pointer" />
            )}
          </div>
        )}

        <div className="ml-auto flex gap-3 items-center">
          <button onClick={() => { if(confirm("Clear all?")) restoreState(null); }} className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded hover:bg-red-100 transition-colors">Clear All</button>
          
          <div className="w-px h-6 bg-slate-300 mx-1"></div>

          <button 
            onClick={saveToProfile}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm ${
              isSaving 
              ? 'bg-green-500 text-white shadow-green-100' 
              : 'bg-[#461D7C] text-white hover:bg-[#32155a] shadow-purple-100'
            }`}
          >
            {isSaving ? '✓ Saved' : '💾 Save'}
          </button>
        </div>
      </div>

      {/* CANVAS VIEWPORT */}
      <div className="flex-1 bg-slate-100 relative overflow-hidden cursor-crosshair flex items-center justify-center">
        <TransformWrapper 
          disabled={mode !== 'pan'} 
          limitToBounds={true}
          centerOnInit={true}
          centerZoomedOut={true}
          minScale={1} 
          maxScale={4} 
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div 
              className="relative w-full h-full bg-white shadow-sm" 
              style={{ 
                backgroundImage: `url('${imagePath}')`, 
                backgroundSize: 'contain', 
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            >
              <canvas
                ref={canvasRef}
                width={1200}
                height={900}
                className="absolute top-0 left-0 w-full h-full"
                onMouseDown={startInteraction}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}