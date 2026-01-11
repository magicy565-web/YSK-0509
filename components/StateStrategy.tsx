import React, { useState, useEffect } from 'react';
import { StrategyData, StrategyOption } from '../types';

interface Props {
  data: StrategyData;
  onApprove: (selectedStrategy: StrategyOption) => void;
}

export const StateStrategy: React.FC<Props> = ({ data, onApprove }) => {
  const [activeTab, setActiveTab] = useState(data[0]?.id || '');
  const [editedStrategies, setEditedStrategies] = useState<StrategyData>(data);

  useEffect(() => {
    if (data.length > 0 && !data.find(s => s.id === activeTab)) {
      setActiveTab(data[0].id);
    }
    setEditedStrategies(data);
  }, [data]);

  const handleContentChange = (id: string, field: 'subject' | 'emailBody', value: string) => {
    const updatedStrategies = editedStrategies.map(strategy =>
      strategy.id === id ? { ...strategy, [field]: value } : strategy
    );
    setEditedStrategies(updatedStrategies);
  };

  const handleApproveClick = () => {
    const selectedStrategy = editedStrategies.find(s => s.id === activeTab);
    if (selectedStrategy) {
      onApprove(selectedStrategy);
    }
  };

  const activeStrategy = editedStrategies.find(s => s.id === activeTab);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-2">第三步：选择开发策略</h2>
      <p className="text-slate-600 mb-6">AI为您生成了三种开发策略，请选择并进行个性化定制。</p>

      <div className="flex border-b border-slate-200 mb-6">
        {editedStrategies.map(strategy => (
          <button
            key={strategy.id}
            onClick={() => setActiveTab(strategy.id)}
            className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 ease-in-out -mb-px border-b-2 ${activeTab === strategy.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}>
            {strategy.title}
          </button>
        ))}
      </div>

      {activeStrategy && (
        <div>
          <p className="text-sm text-slate-500 mb-4">{activeStrategy.description}</p>
          <div className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">邮件主题</label>
              <input
                type="text"
                id="subject"
                value={activeStrategy.subject}
                onChange={(e) => handleContentChange(activeStrategy.id, 'subject', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="emailBody" className="block text-sm font-medium text-slate-700 mb-1">邮件正文</label>
              <textarea
                id="emailBody"
                rows={12}
                value={activeStrategy.emailBody}
                onChange={(e) => handleContentChange(activeStrategy.id, 'emailBody', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 whitespace-pre-wrap"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleApproveClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
          确认并发送
        </button>
      </div>
    </div>
  );
};
