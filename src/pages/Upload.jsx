import React, { useState, useRef } from 'react';
import api from '../api/axiosConfig';
import { UploadCloud, CheckCircle, XCircle, FileText } from 'lucide-react';

const Upload = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const res = await api.post('/candidates/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResults(res.data.results);
        } catch (err) {
            console.error('Upload failed', err);
            alert("Upload failed. Ensure you have the right permissions.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full h-full relative z-10 pb-10">
            <div className="max-w-4xl mx-auto pb-8 relative z-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2 tracking-tight">Bulk CV Upload</h1>
                    <p className="text-[var(--muted-text)] font-medium">Upload multiple resumes to parse and create candidates automatically</p>
                </div>

                <div className="glass-panel rounded-[2rem] p-10 border border-[var(--border-color)] text-center shadow-2xl bg-[var(--panel-bg)]">
                    <div 
                        className="border-2 border-dashed border-[var(--border-color)] rounded-3xl p-16 hover:border-emerald-500/50 transition-all cursor-pointer bg-[var(--input-bg)] group relative overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <UploadCloud className="h-20 w-20 text-emerald-500/30 group-hover:text-emerald-500 mx-auto mb-6 transition-all group-hover:scale-110" />
                        <h3 className="text-2xl font-black mb-2 relative z-10">Drag & Drop CVs</h3>
                        <p className="text-[var(--muted-text)] font-bold relative z-10">or click to browse from your computer (PDF only)</p>
                        <input 
                            type="file" 
                            multiple 
                            accept=".pdf" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>

                    {files.length > 0 && (
                        <div className="mt-10 text-left bg-[var(--input-bg)] p-8 rounded-3xl border border-[var(--border-color)] shadow-inner">
                            <h4 className="font-black mb-6 flex items-center uppercase tracking-widest text-xs text-blue-500">
                                Selected Files <span className="ml-3 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">{files.length}</span>
                            </h4>
                            <ul className="space-y-3 mb-8 max-h-56 overflow-y-auto pr-3 custom-scrollbar">
                                {files.map((f, i) => (
                                    <li key={i} className="text-sm bg-[var(--background)] p-4 rounded-2xl border border-[var(--border-color)] truncate flex items-center font-bold">
                                        <FileText className="h-4 w-4 mr-4 text-emerald-500 shrink-0" />
                                        {f.name}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="w-full py-5 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 text-base uppercase tracking-widest"
                            >
                                {uploading ? 'Processing CVs...' : 'Upload & Parse CVs'}
                            </button>
                        </div>
                    )}

                    {results && (
                        <div className="mt-10 text-left bg-[var(--input-bg)] p-8 rounded-3xl border border-[var(--border-color)] shadow-inner">
                            <h4 className="font-black mb-6 uppercase tracking-widest text-xs text-purple-500">Upload Results</h4>
                            <ul className="space-y-3">
                                {results.map((r, i) => (
                                    <li key={i} className="flex items-center text-sm p-4 rounded-2xl bg-[var(--background)] border border-[var(--border-color)] shadow-sm">
                                        {r.status === 'success' ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-500 mr-4 shrink-0" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-rose-500 mr-4 shrink-0" />
                                        )}
                                        <span className="truncate w-1/2 font-bold">{r.filename}</span>
                                        <span className={`ml-auto font-black uppercase tracking-tighter text-[10px] px-3 py-1 rounded-full border ${r.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                            {r.status === 'success' ? `Success #${r.id}` : r.reason}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Upload;
