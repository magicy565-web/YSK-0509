import { Client } from '@hubspot/api-client';
import formidable from 'formidable';

// 禁用 Vercel 的默认 body 解析器
export const config = {
  api: {
    bodyParser: false,
  },
};

// 表单解析辅助函数
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(req, res) {
  // 1. 设置跨域头 (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  try {
    const { fields, files } = await parseForm(req);
    const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

    // --- 核心修改：跳过文件上传，只处理文本 ---
    
    // 1. 整理证书信息
    const certificates = Array.isArray(fields['mainCertificates[]']) 
      ? fields['mainCertificates[]'].join(', ') 
      : (fields.mainCertificates || '无');

    // 2. 检查是否有文件（仅做文本提示，不上传）
    const fileCount = Object.keys(files).length;
    let fileNote = "";
    if (fileCount > 0) {
        // 提示语：告诉管理员用户其实提交了图片，但因为权限没存进来，需要手动联系
        fileNote = `
【⚠️ 附件提示】
用户提交了 ${fileCount} 个文件（营业执照/工厂实拍）。
由于当前HubSpot账号无文件API权限，图片未自动保存。请根据联系方式(电话/微信)找客户获取。`;
    }

    // 3. 将所有信息打包进 "Description" 字段
    // 这样就不需要创建自定义字段，也不需要 Note 权限
    const combinedDescription = `
【工厂基本信息】
工厂名称: ${fields.companyName}
成立年份: ${fields.establishedYear}
年营收: ${fields.annualRevenue}
联系人: ${fields.contactPerson} (${fields.position})
联系电话: ${fields.contactPhone}

【产品实力】
主营类目: ${fields.mainProductCategory}
产品关键词: ${fields.productName}
核心证书: ${certificates}

【核心优势描述】
${fields.productDetails}
${fileNote}
    `.trim();

    // 4. 创建交易
    // 只需要 crm.objects.deals.write 这一个权限！
    const dealProperties = {
      "dealname": `${fields.companyName || 'New Factory'} - 入驻申请`,
      "pipeline": "default",
      "dealstage": "appointmentscheduled", 
      "description": combinedDescription 
    };

    console.log(`[API] 正在创建纯文本交易: ${fields.companyName}`);
    const dealResponse = await hubspotClient.crm.deals.basicApi.create({ properties: dealProperties });
    
    console.log(`[API] 成功! Deal ID: ${dealResponse.id}`);
    return res.status(200).json({ success: true, crmId: dealResponse.id });

  } catch (e) {
    console.error("--- HubSpot API Error ---", e);
    // 返回通用错误
    return res.status(500).json({ error: 'Failed to process application.' });
  }
}