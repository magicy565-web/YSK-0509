
import React from 'react';
import { Input, Textarea, Button, Select, CheckboxGroup } from './common';

interface StateDealProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, value: string[]) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const StateDeal: React.FC<StateDealProps> = ({ formData, handleChange, handleCheckboxChange, handleSubmit, isSubmitting }) => {
  
  const certificateOptions = [
    { label: 'ISO 9001', value: 'ISO 9001' },
    { label: 'ISO 14001', value: 'ISO 14001' },
    { label: 'CE', value: 'CE' },
    { label: 'RoHS', value: 'RoHS' },
    { label: 'REACH', value: 'REACH' },
    { label: 'Other', value: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Factory Application</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name/Keywords"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          placeholder="e.g., LED lamps, USB cables"
        />
        <Input
          label="Target Market"
          name="targetMarket"
          value={formData.targetMarket}
          onChange={handleChange}
          placeholder="e.g., Europe, North America"
        />
      </div>

      <Textarea
        label="Product Details"
        name="productDetails"
        value={formData.productDetails}
        onChange={handleChange}
        placeholder="Describe the main products you want to source."
      />

      <hr className="my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Factory/Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
        <Input
          label="Contact Person"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
        />
        <Input
          label="Contact Phone"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
        />
        <Input
          label="Position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          placeholder="e.g., Purchasing Manager, CEO"
        />
      </div>
      
      <Textarea
        label="Core Advantages of the Factory"
        name="coreAdvantages"
        value={formData.coreAdvantages}
        onChange={handleChange}
        placeholder="What makes this factory stand out? e.g., unique technology, pricing, certifications"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Established Year"
          name="establishedYear"
          value={formData.establishedYear}
          onChange={handleChange}
          placeholder="e.g., 2005"
        />
        <Input
          label="Annual Revenue (USD)"
          name="annualRevenue"
          value={formData.annualRevenue}
          onChange={handleChange}
          placeholder="e.g., 10,000,000"
        />
        <Select
          label="Main Product Category"
          name="mainProductCategory"
          value={formData.mainProductCategory}
          onChange={handleChange}
          options={[
            { label: 'Electronics', value: 'Electronics' },
            { label: 'Apparel', value: 'Apparel' },
            { label: 'Home Goods', value: 'Home Goods' },
            { label: 'Industrial', value: 'Industrial' },
            { label: 'Other', value: 'Other' },
          ]}
        />
      </div>

      <CheckboxGroup
        label="Main Certificates"
        name="mainCertificates"
        options={certificateOptions}
        value={formData.mainCertificates}
        onChange={(value) => handleCheckboxChange('mainCertificates', value)}
      />
      
      {/* File Inputs (styling needed) */}
      <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Business License</label>
          <input type="file" name="businessLicense" onChange={handleChange} className="w-full" />
          
          <label className="block text-sm font-medium text-gray-700">Factory Photos</label>
          <input type="file" name="factoryPhotos" multiple onChange={handleChange} className="w-full" />
          
          <label className="block text-sm font-medium text-gray-700">Product Certificates</label>
          <input type="file" name="productCertificates" multiple onChange={handleChange} className="w-full" />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}

export default StateDeal;
