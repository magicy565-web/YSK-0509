import React from 'react';
import { FileText, ShieldCheck, Truck, Edit2, PenTool, CheckCircle } from 'lucide-react';
import { DealData } from '../types';

interface StateDealProps {
  data: DealData;
  onSign: () => void;
}

export const StateDeal: React.FC<StateDealProps> = ({ data, onSign }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in pb-24 md:pb-8">
      {/* High Intent Alert */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-6 text-white mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">High Intent Inquiry Received!</h2>
            <p className="text-emerald-50 opacity-90">Customer replied within 2 hours. Intent Score: 98/100.</p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-sm opacity-75">Status</div>
          <div className="font-bold text-lg">Action Required</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Client Profile */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Client Profile</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs text-slate-500">Company Name</label>
                <div className="text-xl font-bold text-slate-900">{data.clientName}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <div>
                  <label className="text-xs text-slate-500">Credit Rating</label>
                  <div className="font-medium text-slate-800">{data.clientRating}</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                 <div className="flex items-center text-sm text-slate-600 mb-2">
                    <Truck className="w-4 h-4 mr-2" />
                    Preferred Incoterm
                 </div>
                 <div className="font-bold text-slate-900">{data.term}</div>
              </div>
            </div>
          </div>

          {/* Right: AI Quote */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">AI Suggested Quote</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">Dynamic Pricing</span>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Product</span>
                    <span className="font-medium text-slate-900">{data.productName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Quantity</span>
                    <span className="font-medium text-slate-900">{data.quantity}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Unit Price</span>
                    <span className="font-medium text-slate-900">{data.unitPrice}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Logistics (Est.)</span>
                    <span className="font-medium text-slate-900">{data.shippingCost}</span>
                </div>
                
                <div className="pt-4 mt-2 flex justify-between items-end">
                    <span className="text-lg font-bold text-slate-700">Total</span>
                    <span className="text-3xl font-extrabold text-emerald-600">{data.totalPrice}</span>
                </div>
            </div>

            <div className="mt-8 flex flex-col space-y-3">
                <button className="w-full py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors flex justify-center items-center">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modify Quote
                </button>
                <button 
                    onClick={onSign}
                    className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg shadow-lg hover:bg-slate-800 transition-all flex justify-center items-center"
                >
                    <PenTool className="w-4 h-4 mr-2" />
                    Approve & Generate Contract
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};