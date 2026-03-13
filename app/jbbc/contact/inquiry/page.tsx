'use client';
import { Form, Input, Select, Button, Checkbox, Segmented, Modal, message, Radio } from 'antd';
import { useState } from 'react';
import Breadcrumbs from "@/components/breadcrumb/page";
import BgFont from "@/components/bgFont/BgFont";
import { getCdnUrl } from "@/config/cdn";

const PREFECTURES = [
  "Hokkaido","Aomori","Iwate","Miyagi","Akita","Yamagata","Fukushima",
  "Ibaraki","Tochigi","Gunma","Saitama","Chiba","Tokyo","Kanagawa",
  "Niigata","Toyama","Ishikawa","Fukui","Yamanashi","Nagano","Gifu",
  "Shizuoka","Aichi","Mie","Shiga","Kyoto","Osaka","Hyogo","Nara",
  "Wakayama","Tottori","Shimane","Okayama","Hiroshima","Yamaguchi",
  "Tokushima","Kagawa","Ehime","Kochi","Fukuoka","Saga","Nagasaki",
  "Kumamoto","Oita","Miyazaki","Kagoshima","Okinawa",
];

const PRIVACY_POLICY = `[Privacy Policy]
Before submitting your information, please read the following carefully. If you agree, check "I agree" and click "Send".

Our company will properly manage and protect the personal information you provide as follows.

1. Personal Information Protection Manager
Japan Bangla Bridge Co., Ltd.
Manager: Management Department Manager
Address: 7-22-39 Nishi-Shinjuku, Shinjuku-ku, Tokyo 160-0023, Japan
Phone: 03-6279-1289 / FAX: 03-6279-1287
Email: info@jbbc.co.jp / URL: jbbc.co.jp`;

export default function Inquiry() {
  const [form] = Form.useForm();
  const [segmentedValue, setSegmentedValue] = useState('Corporate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const breadcrumbData = [
    { key: "top",     title: <span style={{ color: "#00619A" }}>Top</span> },
    { key: "inquiry", title: "Contact Us" },
  ];

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/inquiry/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: segmentedValue, ...values }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Submission failed");
      }
      setSuccessModalVisible(true);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCorporate = segmentedValue === 'Corporate';

  // Shared row component
  const FormRow = ({
    label, required, name, rules, children
  }: {
    label: string; required?: boolean; name?: string; rules?: any[]; children: React.ReactNode;
  }) => (
    <div style={{
      display: 'flex', borderBottom: '1px solid #c8dcea',
    }}>
      {/* Label cell */}
      <div style={{
        width: 180, minWidth: 180, flexShrink: 0,
        backgroundColor: '#ddeef6',
        borderRight: '1px solid #c8dcea',
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        {required && (
          <span style={{
            background: '#c0392b', color: '#fff',
            fontSize: '0.65rem', fontWeight: 700,
            padding: '1px 5px', letterSpacing: '0.03em', flexShrink: 0,
          }}>
            ✱
          </span>
        )}
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.03em' }}>
          {label}
        </span>
      </div>
      {/* Input cell */}
      <div style={{ flex: 1, padding: '8px 14px', background: '#fff' }}>
        {name ? (
          <Form.Item name={name} rules={rules} style={{ marginBottom: 0 }}>
            {children}
          </Form.Item>
        ) : children}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .inq-wrap, .inq-wrap * { font-family: var(--font-serif-jp), serif !important; }
        .inq-wrap .ant-input,
        .inq-wrap .ant-input-affix-wrapper,
        .inq-wrap .ant-select-selector,
        .inq-wrap textarea,
        .inq-wrap .ant-segmented,
        .inq-wrap .ant-segmented-item,
        .inq-wrap .ant-btn { border-radius: 0 !important; }
        .inq-wrap .ant-input,
        .inq-wrap .ant-select-selector { border-color: #b0cdd9 !important; }
        .inq-wrap .ant-input:focus,
        .inq-wrap .ant-select-selector:focus { border-color: #00619A !important; box-shadow: none !important; }
        .inq-wrap .ant-form-item { margin-bottom: 0 !important; }
      `}</style>

      <div className="inq-wrap bg-white">
        <div className="container mx-auto">
          <Breadcrumbs
            breadcrumb={breadcrumbData}
            pageTitle="inquiry"
            breadcrumbTitle={breadcrumbData[breadcrumbData.length - 1].title}
          />
          <BgFont textBg="inquiry" title="Contact Us" />
        </div>

        {/* Phone card */}
        <div className="container mx-auto px-4 md:px-6 mt-8 mb-2">
          <div style={{ backgroundColor: 'rgba(0,97,154,0.15)', padding: '20px 28px', maxWidth: 860, margin: '0 auto' }}>
            <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', marginBottom: 6, letterSpacing: '0.05em' }}>
              Contact by Phone
            </p>
            <p style={{ textAlign: 'center', color: '#555', fontSize: '0.8rem', marginBottom: 12 }}>
              Corporate Reception — Not for job search purposes
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <img style={{ height: 26 }} src={getCdnUrl("/icon/iphone.avif")} alt="Phone" />
              <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, color: '#1a1a1a', letterSpacing: '0.04em' }}>
                03-6279-1289
              </span>
              <span style={{ fontSize: '0.9rem', color: '#444' }}>Weekdays 9:00 – 17:00</span>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 18, marginBottom: 20, fontSize: '0.85rem', color: '#333', letterSpacing: '0.04em' }}>
            Thank you for your inquiry. Please fill in the form below.
          </p>
        </div>

        {/* Form area */}
        <div style={{ backgroundColor: 'rgba(0,97,154,0.1)', padding: '32px 16px 48px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', background: '#fff', border: '1px solid #c8dcea' }}>

            {/* Classification toggle */}
            <div style={{
              background: '#00619A', color: '#fff',
              padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em' }}>
                Corporate / Individual Classification
              </span>
              <Segmented
                size="middle"
                value={segmentedValue}
                onChange={(v) => { setSegmentedValue(v as string); form.resetFields(); }}
                options={[
                  { label: 'Corporate', value: 'Corporate' },
                  { label: 'Individual', value: 'Individual' },
                ]}
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
              />
            </div>

            {/* Form table */}
            <Form form={form} onFinish={handleSubmit}>
              <div style={{ border: '1px solid #c8dcea', borderTop: 'none' }}>

                {/* Inquiry Type */}
                <FormRow label="Inquiry Type" required name="inquiryType"
                  rules={[{ required: true, message: 'Please select an inquiry type' }]}>
                  <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {isCorporate ? (
                      <>
                        <Checkbox value="Human Resources Consultation">Human Resources Consultation</Checkbox>
                        <Checkbox value="Document Request">Document Request</Checkbox>
                        <Checkbox value="Other">Other</Checkbox>
                      </>
                    ) : (
                      <>
                        <Checkbox value="Job Search">Job Search</Checkbox>
                        <Checkbox value="Other">Other</Checkbox>
                      </>
                    )}
                  </Checkbox.Group>
                </FormRow>

                {/* Company Name — corporate only */}
                {isCorporate && (
                  <FormRow label="Company Name" required name="companyName"
                    rules={[{ required: true, message: 'Please enter your company name' }]}>
                    <Input placeholder="Japan Bangladesh Bridge Co., Ltd." size="middle" />
                  </FormRow>
                )}

                {/* Full Name */}
                <FormRow label="Full Name" required name="name"
                  rules={[{ required: true, message: 'Please enter your name' }, { min: 2, message: 'At least 2 characters' }]}>
                  <Input placeholder="Taro Yamada" size="middle" />
                </FormRow>

                {/* Email */}
                <FormRow label="Email Address" required name="email"
                  rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Invalid email' }]}>
                  <Input placeholder="info@jbbc.co.jp" size="middle" />
                </FormRow>

                {/* Phone */}
                <FormRow label="Phone Number" required name="phone"
                  rules={[{ required: true, message: 'Please enter your phone number' }, { pattern: /^[\d-]+$/, message: 'Numbers and hyphens only' }]}>
                  <Input placeholder="03-6279-1289" size="middle" />
                </FormRow>

                {/* Postal Code */}
                <FormRow label="Postal Code" required name="postalCode"
                  rules={[{ required: true, message: 'Please enter postal code' }, { pattern: /^\d{7}$/, message: '7 digits required' }]}>
                  <Input placeholder="1600023" size="middle" style={{ maxWidth: 160 }} />
                </FormRow>

                {/* Prefecture */}
                <FormRow label="Prefecture" required name="prefecture"
                  rules={[{ required: true, message: 'Please select your prefecture' }]}>
                  <Select placeholder="Please select" size="middle" style={{ maxWidth: 220 }}>
                    {PREFECTURES.map((p) => (
                      <Select.Option key={p} value={p}>{p}</Select.Option>
                    ))}
                  </Select>
                </FormRow>

                {/* Address */}
                <FormRow label="Street Address" required name="address"
                  rules={[{ required: true, message: 'Please enter your address' }]}>
                  <Input placeholder="7-22-39 Nishi-Shinjuku, Shinjuku-ku" size="middle" />
                </FormRow>

                {/* Business Content — corporate only */}
                {isCorporate && (
                  <FormRow label="Business Content" required name="businessContent"
                    rules={[{ required: true, message: 'Please enter business content' }]}>
                    <Input placeholder="e.g. IT Consulting, Manufacturing" size="middle" />
                  </FormRow>
                )}

                {/* Inquiry Details */}
                <FormRow label="Inquiry Details" required name="inquiryContent"
                  rules={[{ required: true, message: 'Please enter your inquiry' }]}>
                  <Input.TextArea rows={4} placeholder="e.g. I would like to know more about Bangladesh talent introduction" />
                </FormRow>

                {/* Privacy Policy */}
                <FormRow label="Privacy Policy">
                  <Input.TextArea rows={6} readOnly value={PRIVACY_POLICY} style={{ fontSize: '0.75rem', color: '#444', resize: 'none' }} />
                  <Form.Item
                    name="agreedToTerms"
                    valuePropName="checked"
                    rules={[{ validator: (_, v) => v ? Promise.resolve() : Promise.reject('Please agree to the privacy policy') }]}
                    style={{ marginTop: 8, marginBottom: 0 }}
                  >
                    <Checkbox style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                      I agree to the privacy policy
                    </Checkbox>
                  </Form.Item>
                </FormRow>

              </div>

              {/* Submit */}
              <div style={{ padding: '16px 18px', background: '#f5f9fc', borderTop: '1px solid #c8dcea' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  style={{
                    background: '#00619A', borderRadius: 0,
                    fontFamily: "var(--font-serif-jp), serif",
                    letterSpacing: '0.04em', paddingLeft: 28, paddingRight: 28,
                  }}
                >
                  ▶ Send Inquiry
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={successModalVisible}
        onOk={() => setSuccessModalVisible(false)}
        onCancel={() => setSuccessModalVisible(false)}
        centered
        styles={{ content: { borderRadius: 0 } }}
        footer={[
          <Button key="ok" type="primary" onClick={() => setSuccessModalVisible(false)}
            style={{ background: '#00619A', borderRadius: 0 }}>
            Close
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center', padding: '24px 0', fontFamily: "var(--font-serif-jp), serif" }}>
          <div style={{
            width: 64, height: 64, background: '#00619A', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', fontWeight: 900, margin: '0 auto 16px',
          }}>✓</div>
          <h3 style={{ color: '#00619A', fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>
            Inquiry Submitted Successfully
          </h3>
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
            Thank you for your inquiry.<br />We will be in touch shortly.
          </p>
        </div>
      </Modal>
    </>
  );
}
