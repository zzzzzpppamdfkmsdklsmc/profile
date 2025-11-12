// app/components/ProfileCard.tsx
import Image from "next/image";
import { readProfile } from "../utils/fileUtils";

type RowProps = { label: string; value?: string };

function InfoRow({ label, value }: RowProps) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 border-b border-dotted border-gray-300 pb-2">
      <span className="shrink-0 w-24 font-semibold text-gray-800">• {label}</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}

// 강조어(대상/은상/동상/최우수상/장려상/입상/우수상) 볼드 처리
function highlightBold(text: string) {
  return text.replace(/(대상|은상|동상|최우수상|장려상|입상|우수상)/g, "<strong>$1</strong>");
}

export default async function ProfileCard({
  showEdit = false,
}: {
  showEdit?: boolean;
}) {
  const p = readProfile();

  return (
    <section className="mb-10">
      {/* 전체 카드 */}
      <div className="rounded-2xl border border-gray-300 bg-white p-6 text-zinc-900 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-extrabold">My Profile~</h2>

        {/* 상단 영역: 좌측 이미지 / 우측 정보박스 */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* 프로필 이미지 */}
          <div className="flex items-center justify-center md:w-1/3">
            <div className="relative h-72 w-60 overflow-hidden rounded-xl border border-gray-300 shadow-sm">
              <Image
                src={p.image && p.image !== "" ? p.image : "/profile.jpg"}
                alt="profile"
                fill
                sizes="250px"
                className="object-cover"
              />
            </div>
          </div>

          {/* 정보 박스 */}
          <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-inner">
            <div className="space-y-3">
              <InfoRow label="이름" value={p.name} />
              <InfoRow label="생년월일" value={p.birth} />
              <InfoRow label="좌우명" value={p.motto} />
              <InfoRow label="학교" value={p.school} />
              <InfoRow label="학점" value={p.gpa} />
              <InfoRow label="자격증" value={p.certs} />
              <InfoRow label="대외활동" value={p.activities} />
            </div>

            {/* 액션 */}
            <div className="mt-4 flex gap-2">
              {p.email && (
                <a
                  href={`mailto:${p.email}`}
                  className="rounded-md bg-black px-4 py-2 text-white shadow-sm hover:bg-gray-800"
                >
                  Email
                </a>
              )}
              {showEdit && (
                <a
                  href="/admin/profile"
                  className="rounded-md border px-4 py-2 text-sm shadow-sm hover:bg-gray-100"
                >
                  관리자 편집
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 수상 내역 섹션 */}
        {p.awards && p.awards.length > 0 && (
          <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-inner">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">수상</h3>
            <ul className="list-disc space-y-1 pl-6 text-gray-700">
              {p.awards.map((a, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: highlightBold(a) }} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
