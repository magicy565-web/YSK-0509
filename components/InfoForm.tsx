
import React, { useState } from 'react';
import { Briefcase, User, Phone, Package, Globe, Upload, FileText } from 'lucide-react';

interface InfoFormData {
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  productName: string;
  targetCountry: string;
  productBrochure: File | null;
  productImages: FileList | null;
  auxiliaryFiles: FileList | null;
}

interface InfoFormProps {
  onSubmit: (data: InfoFormData) => void;
}

export const InfoForm: React.FC<InfoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<InfoFormData>({
    companyName: '',
    contactPerson: '',
    contactPhone: '',
    productName: '',
    targetCountry: 'USA',
    productBrochure: null,
    productImages: null,
    auxiliaryFiles: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (e.target.multiple) {
        setFormData(prev => ({ ...prev, [name]: files }));
      } else {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const countries = ["USA", "Canada", "Mexico", "UK", "Germany", "France", "Japan", "Australia"];

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Company & Product Information</h2>
      <p className="text-slate-500 mb-6">Provide the following details to start the market analysis.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company and Contact Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-indigo-600"/>Company & Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Company Name</label>
              <input type="text" name="companyName" onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Contact Person</label>
              <input type="text" name="contactPerson" onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Contact Phone</label>
              <input type="tel" name="contactPhone" onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" required />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center"><Package className="w-5 h-5 mr-2 text-indigo-600"/>Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Product Name</label>
              <input type="text" name="productName" onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" required />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Target Country</label>
              <select name="targetCountry" onChange={handleChange} className="w-full p-2 mt-1 border rounded-md">
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700 flex items-center"><Upload className="w-4 h-4 mr-2"/>Product Brochure</label>
            <input type="file" name="productBrochure" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="w-full text-sm mt-1" />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700 flex items-center"><Upload className="w-4 h-4 mr-2"/>Product Images</label>
            <input type="file" name="productImages" onChange={handleFileChange} accept="image/*" multiple className="w-full text-sm mt-1" />
          </div>
        </div>

        {/* Auxiliary Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center"><FileText className="w-5 h-5 mr-2 text-indigo-600"/>Auxiliary Information (Optional)</h3>
          <div>
            <label className="text-sm font-medium text-slate-700">Industry Reports</label>
            <input type="file" name="auxiliaryFiles" onChange={handleFileChange} accept=".pdf,.doc,.docx,.md" multiple className="w-full text-sm mt-1" />
            <p className="text-xs text-slate-500 mt-1">Upload PDF, Word, or Markdown files of industry analysis reports.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all">
            Start Analysis
          </button>
        </div>
      </form>
    </div>
  );
};
