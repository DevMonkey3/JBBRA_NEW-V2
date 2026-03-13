'use client';

export const Construction = () => {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">特定技能（SSW）とは？</h2>
      <p>特定技能（SSW）とは、一定の専門的なスキルと日本語能力を持つ外国人が、日本の労働力不足の産業で働くための在留資格です。</p>

      <h3 className="text-lg font-bold text-gray-800 mt-4">主な2つの区分：</h3>
      <div className="mt-2">
        <h4 className="font-bold">特定技能1号：</h4>
        <ul className="list-disc pl-6">
          <li>12の指定産業での就労が可能</li>
          <li>在留期間は最長5年間（更新可）</li>
          <li>家族の帯同は不可</li>
        </ul>

        <h4 className="font-bold mt-4">特定技能2号：</h4>
        <ul className="list-disc pl-6">
          <li>より高度なスキルが必要</li>
          <li>在留期間に制限なし（永続的な就労が可能）</li>
          <li>家族の帯同が可能</li>
        </ul>
      </div>
    </div>
  );
};

export const SSW = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-justify leading-relaxed text-gray-700">
        <p className="mb-2">
          高度専門職制度は、<strong>ポイント制</strong>を採用しており、学歴・職歴・年収・年齢・日本語能力などに応じてポイントが加算され、
          <strong>合計70点以上</strong>で申請が可能です。
        </p>

        <p className="mb-2">主な対象分野は以下のとおりです：</p>
        <ul className="list-disc pl-6 mb-2">
          <li>学術研究活動：大学教授、研究者など</li>
          <li>高度専門・技術活動：エンジニア、ITスペシャリスト、建築士、弁護士、会計士など</li>
          <li>経営・管理活動：企業の管理職、経営者、スタートアップの代表者など</li>
        </ul>

        <p className="mb-2">高度専門職に認められると、以下のような優遇措置があります：</p>
        <ul className="list-disc pl-6 mb-2">
          <li>最長5年間の在留期間</li>
          <li>永住権の取得が通常より早い</li>
          <li>配偶者や子供の帯同が可能</li>
          <li>家事使用人の帯同が可能（一定条件あり）</li>
          <li>複数の活動を柔軟に行える</li>
        </ul>

        <p className="mb-2">高度な資格や専門性を持つバングラデシュの人材にとって、日本でキャリアを築く大きなチャンスとなっています。</p>
      </div>
    </div>
  );
};

export const TITP = () => {
  return (
    <div className="container mx-auto px-4 py-2">
      <h1 className="text-xl font-bold text-gray-800">プログラム概要</h1>

      <div className="text-justify leading-relaxed text-gray-700">
        <ul className="list-disc pl-6 mb-2">
          <li>種別：実践的な職業訓練（通常の就労ビザではありません）</li>
          <li>期間：1～5年間（技能試験や企業の要件により異なる）</li>
          <li>受入れ先：OTIT（外国人技能実習機構）に認定された日本企業</li>
          <li>送出し：バングラデシュ政府に認可された送出し機関を通じてのみ可能</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-800 mt-4">応募条件</h2>

        <h3 className="text-lg font-bold text-gray-800 mt-2">実習生の条件</h3>
        <ul className="list-disc pl-6 mb-2">
          <li>年齢：一般的に18歳～35歳程度</li>
          <li>最低学歴：高校卒業程度が一般的</li>
          <li>健康状態：心身ともに健康</li>
          <li>日本語能力：初級レベル（N5～N4推奨）</li>
          <li>修了後は必ず帰国し、習得技能を活かす意欲があること</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-800 mt-2">送出し機関の条件</h3>
        <ul className="list-disc pl-6 mb-2">
          <li>OTIT/JITCOの規定に基づき認可・登録されていること</li>
          <li>
            出国前研修の実施：
            <ul className="list-disc pl-6 mb-2">
              <li>日本語教育</li>
              <li>日本の労働文化・マナー</li>
              <li>基本的な技能教育</li>
            </ul>
          </li>
          <li>派遣後のフォローアップ・報告義務を遵守</li>
        </ul>
      </div>
    </div>
  );
};
