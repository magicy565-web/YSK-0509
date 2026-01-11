import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { UploadCloud, FileText } from 'lucide-react';
import { QuotationItem } from '../types';

interface ExcelUploaderProps {
  onDataExtracted: (data: QuotationItem[]) => void;
  onClear: () => void;
}

// A more specific type for the expected Excel row structure
type ExcelRow = {
  '产品名称'?: string;
  'Product Name'?: string;
  '型号'?: string;
  'Model'?: string;
  '单位'?: string;
  'Unit'?: string;
  '出厂单价'?: string | number;
  'Price'?: string | number;
  '最小起订量'?: string | number;
  'MOQ'?: string | number;
  [key: string]: any; // Allow other columns
};

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onDataExtracted, onClear }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      setError("未检测到文件，请重试。");
      return;
    }

    // Reset state for new upload
    setFileName(null);
    setError(null);
    onClear(); // Clear existing data in parent

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

        if (json.length === 0) {
          setError("上传的文件为空或格式不正确。");
          return;
        }

        const extractedData: QuotationItem[] = json.map((row, index) => ({
          id: Date.now() + index, // Unique ID for each item
          productName: row['产品名称'] || row['Product Name'] || '',
          model: row['型号'] || row['Model'] || '',
          unit: row['单位'] || row['Unit'] || 'pcs',
          exwPrice: String(row['出厂单价'] || row['Price'] || ''),
          moq: String(row['最小起订量'] || row['MOQ'] || ''),
        }));
        
        onDataExtracted(extractedData);
        setFileName(file.name);
      } catch (err) {
        console.error("Error parsing Excel file:", err);
        setError("解析Excel文件失败，请确保文件格式正确。");
      }
    };

    reader.onerror = () => {
      setError("读取文件失败。");
    };

    reader.readAsArrayBuffer(file);
  }, [onDataExtracted, onClear]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  if (fileName) {
    return (
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50">
        <FileText className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-2 text-sm font-medium text-slate-700">文件已上传：{fileName}</p>
        <button 
          onClick={() => { setFileName(null); onClear(); }}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          重新上传
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-200 
        ${isDragActive ? 'border-indigo-600 bg-indigo-50' : 'border-slate-300 hover:border-slate-400 bg-white'}`}>
      <input {...getInputProps()} />
      <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
      <p className="mt-2 text-sm text-slate-600">
        {isDragActive ? '将文件拖拽到此处...' : '拖拽Excel文件到此处，或点击选择文件'}
      </p>
      <p className="mt-1 text-xs text-slate-500">支持 .xlsx, .xls 格式</p>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};
