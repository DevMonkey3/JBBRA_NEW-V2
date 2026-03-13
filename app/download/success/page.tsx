"use client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function DownloadSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-center text-green-600">
            送信完了
          </h1>
          <p className="text-sm text-gray-600 text-center">
            ありがとうございます！
          </p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 items-center">
          <p className="text-center text-gray-700">
            お問い合わせいただきありがとうございます。
            <br />
            ご入力いただいた情報を確認次第、
            <br />
            担当者よりご連絡させていただきます。
          </p>

          <div className="w-full h-px bg-gray-200 my-2" />

          <p className="text-center text-sm text-gray-600">
            今後ともよろしくお願いいたします。
          </p>

          <Button
            color="warning"
            className="w-full bg-[#f89834] text-white font-bold mt-4"
            onClick={() => router.push("/")}
          >
            ホームに戻る
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
