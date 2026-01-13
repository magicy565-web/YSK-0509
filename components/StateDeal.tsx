import React, { useState, useRef } from 'react';
import { 
  DealData, 
  FactoryQualification, 
  SuccessCase, 
  InfoFormData,
  ESTABLISHED_YEARS,
  ANNUAL_REVENUES,
  CERTIFICATES
} from '../types'; 
import { 
  ArrowRight, ArrowLeft, Package, ShieldCheck, UserCheck, Zap, 
  Building, Shield, User, FileImage, Upload, X, CheckCircle, Target
} from 'lucide-react';
import { LiveTicker } from './LiveTicker';

const successStories: SuccessCase[] = [
  {
    id: 'case-1',
    title: '广东中山照明厂 → 获 Home Depot 试单',
    tags: ['LED照明', '北美市场', '商超直供'],
    imageUrl: 'https://images.unsplash.com/photo-1565514020125-998935c104eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 
    description: '该工厂拥有10年OEM经验，但缺乏直接出口渠道。通过平台“验厂”后，直接进入 Home Depot 采购白名单，2周内获 $12k 试单。',
    metrics: [{ label: '匹配周期', value: '14天' }, { label: '首单金额', value: '$12,000' }],
  },
  {
    id: 'case-2',
    title: '浙江宁波汽配厂 → 签约俄罗斯分销商',
    tags: ['汽车底盘件', '俄罗斯', '品牌代理'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '敏锐捕捉供应链真空。我们协助工厂进行俄语本地化包装，精准对接莫斯科大型汽配分销商，首月签署 $80k 采购意向书。',
    metrics: [{ label: '市场突破', value: '0 -> 1' }, { label: '意向金额', value: '$80,000' }],
  },
  {
    id: 'case-3',
    title: '福建泉州鞋服厂 → 跨境电商柔性供应',
    tags: ['运动鞋服', 'SHEIN供应', '小单快返'],
    imageUrl: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: '针对跨境电商“小单快返”的需求，我们筛选出该工厂具备极强的柔性生产能力。成功对接 5 位亚马逊大卖，月均返单量稳定在 20,000 件以上。',
    metrics: [{ label: '对接大卖', value: '5位' }, { label: '月返单', value: '2w+件' }],
  }
];

const ImageUploadField: React.FC<{
  label: string;
  subLabel?: string;
  accept?: string;
  multiple?: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}> = ({ label, subLabel, accept = "image/png, image/jpeg", multiple = false, files, onFilesChange, maxFiles = 5 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (multiple) {
      onFilesChange([...files, ...validFiles].slice(0, maxFiles));
    } else {
      if (validFiles.length > 0) onFilesChange([validFiles[0]]);
    }
  };

  const onDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === "dragenter" || e.type === "dragover"); };
  const onDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files) handleFile(Array.from(e.dataTransfer.files)); };
  const removeFile = (index: number) => onFilesChange(files.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">
        {label} <span className="text-slate-500 font-normal ml-1">{subLabel}</span>
      </label>
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer group ${dragActive ? 'border-emerald-500 bg-emerald-500/10' : files.length > 0 ? 'border-emerald-500/50 bg-slate-800' : 'border-slate-600 hover:border-emerald-500/50 hover:bg-slate-800'}`}
        onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" className="hidden" accept={accept} multiple={multiple} onChange={(e) => e.target.files && handleFile(Array.from(e.target.files))} />
        <div className="flex flex-col items-center justify-center py-2">
            <div className="bg-slate-700 p-2 rounded-full mb-2 group-hover:bg-slate-600 transition-colors">
                <Upload className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm text-slate-300">点击或拖拽上传</p>
            <p className="text-xs text-slate-500 mt-1">{multiple ? `最多${maxFiles}张` : '仅限单张'} (JPG/PNG)</p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {files.map((file, index) => (
            <div key={index} className="relative group rounded-md overflow-hidden aspect-square border border-slate-600">
              <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
              <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(index); }} className="absolute top-0.5 right-0.5 bg-black/60 text-white p-0.5 rounded-full hover:bg-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TrustBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700"><span className="text-emerald-500 mr-2">{icon}</span>{text}</div>
);

const ProgressBar = ({ current, total }: { current: number, total: number }) => (
    <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
        <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${(current / total) * 100}%` }}></div>
    </div>
);

interface StateDealProps {
  initialFormData: InfoFormData;
  onApprove: (data: DealData) => void;
}

export const StateDeal: React.FC<StateDealProps> = ({ initialFormData, onApprove }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FactoryQualification>({
    companyName: '', establishedYear: ESTABLISHED_YEARS[0], annualRevenue: ANNUAL_REVENUES[0],
    mainProductCategory: '', mainCertificates: [],
    businessLicense: null, factoryPhotos: [], productCertificates: [],
    contactPerson: '', position: 'manager', contactPhone: '',
  });
  const [ndaAccepted, setNdaAccepted] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCertificateChange = (certificate: string) => {
    setFormData(prev => {
        const newCerts = prev.mainCertificates.includes(certificate)
            ? prev.mainCertificates.filter(c => c !== certificate)
            : [...prev.mainCertificates, certificate];
        return { ...prev, mainCertificates: newCerts };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove(formData);
  };

  const canGoToStep2 = formData.companyName && formData.establishedYear && formData.annualRevenue;
  const canGoToStep3 = formData.mainProductCategory && formData.mainCertificates.length > 0;
  const canGoToStep4 = formData.businessLicense !== null && formData.factoryPhotos.length > 0;
  const canSubmit = formData.contactPerson && formData.position && /^1[3-9]\d{9}$/.test(formData.contactPhone);

  return (
    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-6xl mx-auto border border-slate-800">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        <div className="lg:w-5/12 flex flex-col">
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            加入<span className="text-emerald-400">【出海严选】</span>联盟<br/>
            链接全球优质采购资源
          </h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            我们不赚差价，不收会员费。我们只服务对自己产品有信心、有出海决心的源头工厂。
          </p>
          
          <div className="space-y-6 mb-8">
            {successStories.map(story => (
               <div key={story.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all group">
                  <div className="relative h-32 overflow-hidden">
                    <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-3">
                        <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">成功案例</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-white mb-1">{story.title}</h4>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-2">{story.description}</p>
                    <div className="flex gap-2">
                        {story.metrics.map((m, i) => (
                            <div key={i} className="bg-slate-700/50 px-2 py-1 rounded text-xs text-slate-300">
                                <span className="text-slate-500 mr-1">{m.label}:</span>
                                <span className="text-emerald-400 font-bold">{m.value}</span>
                            </div>
                        ))}
                    </div>
                  </div>
               </div>
            ))}
          </div>

          <LiveTicker />

           <div className="mt-auto pt-6 flex flex-wrap gap-3">
             <TrustBadge icon={<Zap className="w-4 h-4" />} text="0费用入驻" />
             <TrustBadge icon={<UserCheck className="w-4 h-4" />} text="社群专家赋能" />
             <TrustBadge icon={<Target className="w-4 h-4" />} text="结果导向" />
           </div>
        </div>

        <div className="lg:w-7/12 bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 flex flex-col">
          <div className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="font-bold text-xl text-white">供应商实力验厂</h2>
                <p className="text-sm text-slate-400 mt-1">请如实填写，数据将用于AI精准匹配</p>
              </div>
              <span className="text-emerald-400 font-mono text-xl font-bold">Step {step}/4</span>
          </div>
          
          <ProgressBar current={step} total={4} />
          
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
            
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center text-emerald-400 mb-2"><Building className="w-5 h-5 mr-2"/> <span className="font-semibold">企业基础信息</span></div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">工厂全称</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white focus:ring-emerald-500 focus:border-emerald-500 transition-all" placeholder='例如：深圳市XX科技有限公司' required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">成立年限</label>
                    <select name="establishedYear" value={formData.establishedYear} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white">
                        {ESTABLISHED_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">年出口额</label>
                    <select name="annualRevenue" value={formData.annualRevenue} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white">
                        {ANNUAL_REVENUES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center text-emerald-400 mb-2"><Shield className="w-5 h-5 mr-2"/> <span className="font-semibold">合规与认证</span></div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">主营产品类目</label>
                    <input type="text" name="mainProductCategory" value={formData.mainProductCategory} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white" placeholder='例如：LED照明, 3C配件' required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">核心认证 (有证书将优先匹配欧美大买家)</label>
                    <div className="grid grid-cols-3 gap-3">
                        {CERTIFICATES.map(cert => (
                            <button type="button" key={cert} onClick={() => handleCertificateChange(cert)} className={`py-2 px-3 text-sm rounded-lg border transition-all ${formData.mainCertificates.includes(cert) ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_10px_rgba(5,150,105,0.4)]' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}>
                                {cert}
                            </button>
                        ))}
                    </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center text-emerald-400 mb-2"><FileImage className="w-5 h-5 mr-2"/> <span className="font-semibold">实力证明 (图片)</span></div>
                <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/50 mb-2 flex items-start">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-xs text-slate-400">所有图片仅用于平台人工核验，严格保密。上传真实图片可提高 <span className="text-emerald-400 font-bold">300%</span> 的审核通过率。</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUploadField 
                        label="营业执照" subLabel="(必传)"
                        files={formData.businessLicense ? [formData.businessLicense] : []}
                        onFilesChange={(files) => setFormData(p => ({ ...p, businessLicense: files[0] || null }))}
                    />
                    <ImageUploadField 
                        label="工厂/车间实拍" subLabel="(必传, 1-5张)"
                        multiple maxFiles={5}
                        files={formData.factoryPhotos}
                        onFilesChange={(files) => setFormData(p => ({ ...p, factoryPhotos: files }))}
                    />
                </div>
                <div className="mt-2">
                    <ImageUploadField 
                        label="相关证书/专利" subLabel="(选传, 加分项)"
                        multiple maxFiles={3}
                        files={formData.productCertificates}
                        onFilesChange={(files) => setFormData(p => ({ ...p, productCertificates: files }))}
                    />
                </div>
              </div>
            )}

            {step === 4 && (
                <div className="space-y-5 animate-fade-in">
                    <div className="flex items-center text-emerald-400 mb-2"><User className="w-5 h-5 mr-2"/> <span className="font-semibold">决策人直连</span></div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">联系人姓名</label>
                            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white" placeholder='真实姓名' required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">您的职位</label>
                            <select name="position" value={formData.position} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white">
                                <option value="owner">工厂法人/股东 (优先审核)</option>
                                <option value="manager">外贸经理/业务主管</option>
                                <option value="other">其他</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">手机号码</label>
                            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-lg p-3 text-white" placeholder='用于接收审核通知，例如: 13812345678' required />
                        </div>
                        <div className="pt-2">
                            <label htmlFor="nda" className="flex items-start text-sm text-slate-400 cursor-pointer">
                                <input 
                                    id="nda" 
                                    type="checkbox" 
                                    checked={ndaAccepted} 
                                    onChange={(e) => setNdaAccepted(e.target.checked)}
                                    className="h-5 w-5 rounded border-slate-500 bg-slate-700 text-emerald-500 focus:ring-emerald-500/50 mr-3 mt-0.5 flex-shrink-0"
                                />
                                <span>
                                    我同意平台隐私条款，并要求平台对我的工厂信息签署
                                    <a href="#" className="font-semibold text-emerald-400 hover:text-emerald-300"> 单向保密协议 (NDA)</a>。
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-4 mt-8 pt-4 border-t border-slate-700">
                {step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" /> 上一步
                    </button>
                )}
                
                {step < 4 ? (
                    <button 
                        type="button" 
                        onClick={() => setStep(step + 1)} 
                        disabled={step === 1 ? !canGoToStep2 : step === 2 ? !canGoToStep3 : !canGoToStep4}
                        className="flex-grow px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none transition-all flex items-center justify-center"
                    >
                        下一步 <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                ) : (
                    <button 
                        type="submit" 
                        disabled={!canSubmit || !ndaAccepted}
                        className="flex-grow px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:shadow-none transition-all flex items-center justify-center"
                    >
                        <CheckCircle className="w-5 h-5 mr-2" /> 提交申请，获取买家资源
                    </button>
                )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};