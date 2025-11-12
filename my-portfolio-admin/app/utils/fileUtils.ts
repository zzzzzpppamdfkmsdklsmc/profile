import fs from "fs";
import path from "path";

/* =========================================================
 * 경로 보장
 * ======================================================= */
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

/* =========================================================
 * Project 타입 (신/구 혼용 호환)
 *  - 구: title/summary/content (옵션)
 *  - 신: name/topic/startDate/endDate/intro/role/detail
 *  - createdAt/updatedAt/image/tags 공통
 * ======================================================= */
export type Project = {
  id: string | number;

  // 구 스키마(옵션으로 둬서 기존 코드 에러 방지)
  title?: string;
  summary?: string;
  content?: string;

  // 신 스키마
  name?: string;
  topic?: string;
  startDate?: string;
  endDate?: string;
  intro?: string;
  role?: string;
  detail?: string;

  createdAt: string;      // YYYY-MM-DD
  updatedAt?: string;
  image?: string;         // 대표 파일(이미지/문서 경로 등)
  tags?: string[];
};

const PROJECTS_JSON = path.join(DATA_DIR, "projects.json");

/* 파일 보장 */
function ensureProjectsFile() {
  if (!fs.existsSync(PROJECTS_JSON)) {
    fs.writeFileSync(PROJECTS_JSON, "[]", "utf-8");
    return;
  }
  const raw = fs.readFileSync(PROJECTS_JSON, "utf-8");
  if (!raw || raw.trim() === "") fs.writeFileSync(PROJECTS_JSON, "[]", "utf-8");
}

/* 한 객체를 신/구 필드 동기화된 형태로 정규화 */
function normalizeProject(p: any): Project {
  const createdAt =
    p?.createdAt ??
    (p?.created_at ? String(p.created_at) : new Date().toISOString().slice(0, 10));

  // 신/구 매핑
  const name   = p?.name   ?? p?.title   ?? "(제목 없음)";
  const intro  = p?.intro  ?? p?.summary ?? "";
  const detail = p?.detail ?? p?.content ?? "";

  return {
    id: p?.id ?? String(Date.now()),

    // 구 스키마(옵션) ↔ 신 스키마 값 동기화
    title: name,
    summary: intro,
    content: detail,

    name,
    topic: p?.topic ?? "",
    startDate: p?.startDate ?? "",
    endDate: p?.endDate ?? "",
    intro,
    role: p?.role ?? "",
    detail,

    image: p?.image ?? "",
    tags: Array.isArray(p?.tags) ? p.tags : [],

    createdAt: String(createdAt),
    updatedAt: p?.updatedAt ?? p?.updated_at ?? undefined,
  };
}

/* =========================================================
 * CRUD
 * ======================================================= */
export function readProjects(): Project[] {
  try {
    ensureProjectsFile();
    const txt = fs.readFileSync(PROJECTS_JSON, "utf-8");
    const arr = JSON.parse(txt) as any[];
    return arr.map(normalizeProject);
  } catch (e) {
    console.error("[readProjects]", e);
    return [];
  }
}

export function writeProjects(arr: Project[]) {
  ensureProjectsFile();
  // 저장 시에도 신/구 필드 동기화가 유지되도록 정규화 후 저장
  const synced = arr.map(normalizeProject);
  fs.writeFileSync(PROJECTS_JSON, JSON.stringify(synced, null, 2), "utf-8");
}

/** 추가: name 또는 title 중 하나만 있어도 OK */
export function addProject(
  input: Partial<Project> & { name?: string; title?: string }
): Project {
  ensureProjectsFile();

  let list: Project[] = [];
  try {
    list = readProjects();
  } catch {
    list = [];
  }

  const nowIso = new Date().toISOString();
  const id = String(Date.now());

  const raw = {
    ...input,
    id,
    // 최소 보정
    name: input.name ?? input.title ?? "(제목 없음)",
    intro: input.intro ?? input.summary ?? "",
    detail: input.detail ?? input.content ?? "",
    createdAt: input.createdAt ?? nowIso.slice(0, 10),
    updatedAt: nowIso,
  };

  const normalized = normalizeProject(raw);
  list.push(normalized);
  writeProjects(list);
  return normalized;
}

/** 업데이트: 허용 필드 병합 + 신/구 동시 보정 */
export function updateProject(
  id: string | number,
  patch: Partial<Project> & { title?: string; summary?: string; content?: string }
): Project | undefined {
  ensureProjectsFile();

  const list = readProjects();
  const idx = list.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return undefined;

  const allowed: (keyof Project)[] = [
    "title", "summary", "content",       // 구
    "name", "topic", "startDate", "endDate", "intro", "role", "detail", // 신
    "image", "tags", "createdAt",
  ];

  const safe: Partial<Project> = {};
  for (const k of Object.keys(patch) as (keyof Project)[]) {
    if (allowed.includes(k)) {
      // @ts-ignore
      safe[k] = patch[k];
    }
  }

  // 신/구 필드 동기화 규칙 적용
  const mergedRaw = {
    ...list[idx],
    ...safe,
    // name/title 동기화
    name:  (safe.name  ?? safe.title)   ?? list[idx].name  ?? list[idx].title,
    title: (safe.title ?? safe.name)    ?? list[idx].title ?? list[idx].name,
    // intro/summary 동기화
    intro:   (safe.intro   ?? safe.summary) ?? list[idx].intro   ?? list[idx].summary,
    summary: (safe.summary ?? safe.intro)   ?? list[idx].summary ?? list[idx].intro,
    // detail/content 동기화
    detail:  (safe.detail  ?? safe.content) ?? list[idx].detail  ?? list[idx].content,
    content: (safe.content ?? safe.detail)  ?? list[idx].content ?? list[idx].detail,

    updatedAt: new Date().toISOString(),
  };

  const normalized = normalizeProject(mergedRaw);
  list[idx] = normalized;
  writeProjects(list);
  return normalized;
}

export function deleteProject(id: string | number): boolean {
  ensureProjectsFile();

  const list = readProjects();
  const next = list.filter((p) => String(p.id) !== String(id));
  if (next.length === list.length) return false;

  writeProjects(next);
  return true;
}

/* =========================================================
 * Profile (변경 없음)
 * ======================================================= */
export type Profile = {
  name?: string;
  birth?: string;
  motto?: string;
  school?: string;
  gpa?: string;
  certs?: string;
  activities?: string;
  email?: string;
  image?: string;     // /uploads/xxx.png
  awards?: string[];  // 줄바꿈 → 배열
};

const PROFILE_JSON = path.join(DATA_DIR, "profile.json");

// 전부 빈칸/빈배열 기본값
const EMPTY_PROFILE: Profile = {
  name: "",
  birth: "",
  motto: "",
  school: "",
  gpa: "",
  certs: "",
  activities: "",
  email: "",
  image: "",
  awards: [],
};

// profile.json 보장
function ensureProfileFile() {
  if (!fs.existsSync(PROFILE_JSON)) {
    fs.writeFileSync(PROFILE_JSON, JSON.stringify(EMPTY_PROFILE, null, 2), "utf-8");
    return;
  }
  const raw = fs.readFileSync(PROFILE_JSON, "utf-8");
  if (!raw || raw.trim() === "") {
    fs.writeFileSync(PROFILE_JSON, JSON.stringify(EMPTY_PROFILE, null, 2), "utf-8");
  }
}

export function readProfile(): Profile {
  try {
    ensureProfileFile();
    const txt = fs.readFileSync(PROFILE_JSON, "utf-8");
    const obj = JSON.parse(txt) as Profile;
    return { ...EMPTY_PROFILE, ...obj }; // 누락 키 보정
  } catch (e) {
    console.error("[readProfile]", e);
    return { ...EMPTY_PROFILE };
  }
}

export function writeProfile(p: Profile) {
  ensureProfileFile();
  fs.writeFileSync(PROFILE_JSON, JSON.stringify({ ...EMPTY_PROFILE, ...p }, null, 2), "utf-8");
}
