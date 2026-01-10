import React from 'react';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

export const SuccessState = () => {
    return (
        <div className="max-w-2xl mx-auto py-12 text-center animate-fade-in">
            <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Contract Sent Successfully!</h2>
            <p className="text-slate-600 mb-8 text-lg">
                The Proforma Invoice (PI) and Sales Contract have been sent to <b>Turner Construction Co.</b> via DocuSign.
            </p>
            
            <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mb-8 border border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                    <span className="text-slate-500">Contract ID</span>
                    <span className="font-mono font-medium text-slate-800">#EXP-2023-8842</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-500">Exp. Closing</span>
                    <span className="font-medium text-emerald-600">24 Hours</span>
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <button className="flex items-center text-slate-600 hover:text-slate-900 font-medium px-4 py-2">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                </button>
                <button className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition font-medium flex items-center" onClick={() => window.location.reload()}>
                    Start New Shipment <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        </div>
    )
}