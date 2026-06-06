import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { uploadCSV } from '../../utils/api';

export default function CSVUpload({ onSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f?.type === 'text/csv' || f?.name?.endsWith('.csv')) {
      setFile(f);
      setResult(null);
      setError('');
    } else {
      setError('Only CSV files are supported');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadCSV(formData);
      setResult(res);
      setFile(null);
      onSuccess?.();
    } catch (err) {
      setError(err?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-white font-semibold mb-4">Upload Location Dataset</h3>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragging ? 'border-ev-blue bg-ev-blue/5' : 'border-ev-dark-border hover:border-ev-blue/50'
        }`}
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        <Upload size={32} className="text-ev-gray mx-auto mb-3" />
        <p className="text-white font-medium">Drop CSV file here or click to browse</p>
        <p className="text-ev-gray text-xs mt-1">Columns: name, city, state, latitude, longitude, populationDensity, trafficVolume, commercialScore, evScore</p>
      </div>

      {file && (
        <div className="flex items-center justify-between mt-4 p-3 bg-ev-dark-border/30 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-ev-blue" />
            <span className="text-white text-sm">{file.name}</span>
            <span className="text-ev-gray text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
          <button onClick={handleUpload} disabled={uploading} className="btn-primary text-sm py-1.5">
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-2">
          <CheckCircle size={18} className="text-green-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="text-green-400 font-medium">{result.message}</p>
            <p className="text-ev-gray text-xs mt-0.5">
              Upserted: {result.upserted} · Modified: {result.modified} · Errors: {result.errors}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
          <XCircle size={18} className="text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
