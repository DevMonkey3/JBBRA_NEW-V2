"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function DownloadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Japanese phone number format: 10-11 digits, can include hyphens
    const phoneRegex = /^(\d{2,4}-?\d{2,4}-?\d{3,4}|\d{10,11})$/;
    return phoneRegex.test(phone.replace(/-/g, ""));
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    if (!validateName(formData.name)) {
      newErrors.name = "名前は2文字以上で入力してください";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = "有効な電話番号を入力してください（10-11桁）";
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (newErrors.name || newErrors.email || newErrors.phone) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/download/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Redirect to success page
      router.push("/download/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-yellow-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center">
          <h1 className="text-2xl font-bold text-center">お問い合わせ</h1>
          <p className="text-sm text-gray-600 text-center">
            ご興味をお持ちいただきありがとうございます
            <br />
            下記フォームにご記入ください
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="お名前"
              placeholder="山田 太郎"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              isRequired
              variant="bordered"
            />

            <Input
              label="メールアドレス"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              isRequired
              variant="bordered"
            />

            <Input
              label="電話番号"
              placeholder="090-1234-5678"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              isInvalid={!!errors.phone}
              errorMessage={errors.phone}
              isRequired
              variant="bordered"
            />

            <Button
              type="submit"
              color="warning"
              className="w-full bg-[#f89834] text-white font-bold"
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
