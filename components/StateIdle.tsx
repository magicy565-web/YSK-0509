import React, { useRef, useState } from 'react';
import { Upload, Camera, Zap, CheckCircle, Image as ImageIcon } from 'lucide-react';

interface StateIdleProps {
  onStart: () => void;
}

export const StateIdle: React.FC<StateIdleProps> = ({ onStart }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 点击上传区域时，触发隐藏的 input 点击事件
  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // 创建预览图 URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="animate-fade-in py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Start Your Export Engine
        </h1>
        <p className="text-slate-500 mb-8">Upload your product image to let AI identify markets and generate leads.</p>

        {/* Upload Area - 现在可以点击了 */}
        <div 
          onClick={handleBoxClick}
          className={`border-4 border-dashed rounded-xl p-12 transition-all cursor-pointer relative overflow-hidden group
            ${selectedFile ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}
          `}
        >
          {/* 隐藏的文件输入框 */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" // 限制只能传图片
            onChange={handleFileChange}
          />

          {selectedFile ? (
            // 状态：已选择文件
            <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
              <div className="relative">
                {previewUrl ? (
                   <img src={previewUrl} alt="Preview" className="h-32 w-32 object-cover rounded-lg shadow-md border-2 border-white" />
                ) : (
                   <div className="bg-emerald-100 p-4 rounded-full shadow-sm">
                     <ImageIcon className="h-10 w-10 text-emerald-600" />
                   </div>
                )}
                <div className="absolute -right-2 -top-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-slate-600">
                <p className="font-semibold text-slate-900 text-lg">{selectedFile.name}</p>
                <p className="text-sm text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <p className="text-xs text-emerald-600 font-medium bg-emerald-100 px-3 py-1 rounded-full">
                Image Ready for Analysis
              </p>
              <p className="text-xs text-slate-400 mt-2 hover:text-slate-600 transition-colors">
                Click to change image
              </p>
            </div>
          ) : (
            // 状态：未选择文件 (默认)
            <>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-slate-400 font-medium">Click to select file</p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <Camera className="h-10 w-10 text-slate-400 group-hover:text-slate-600" />
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">Drag & drop</span> or click to upload
                </div>
                <p className="text-xs text-slate-400">Supports JPG, PNG (Max 10MB)</p>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-10">
          <button
            onClick={onStart}
            disabled={!selectedFile} // 如果没选文件，禁用按钮
            className={`group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 rounded-full w-full md:w-auto
              ${selectedFile 
                ? 'bg-slate-900 hover:bg-slate-800 hover:shadow-2xl cursor-pointer' 
                : 'bg-slate-300 cursor-not-allowed opacity-70'}
            `}
          >
            <Zap className={`w-5 h-5 mr-2 ${selectedFile ? 'text-yellow-400 group-hover:animate-pulse' : 'text-slate-100'}`} />
            {selectedFile ? 'Start Full-Managed Engine' : 'Please Upload Image First'}
          </button>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-3 gap-4 max-w-4xl mx-auto text-center opacity-60">
        <div className="p-4">
          <h3 className="font-bold text-slate-900">1. Analyze</h3>
          <p className="text-sm text-slate-500">Market & Profit Prediction</p>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-900">2. Strategize</h3>
          <p className="text-sm text-slate-500">Auto-Content Generation</p>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-900">3. Close</h3>
          <p className="text-sm text-slate-500">Negotiation & Logistics</p>
        </div>
      </div>
    </div>
  );
};
