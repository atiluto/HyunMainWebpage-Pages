export const CATEGORIES = [
  { id: "games", label: "게임" },
  { id: "anime", label: "애니" },
  { id: "comics", label: "웹툰" },
  { id: "fashion", label: "패션" },
  { id: "idols", label: "아이돌" },
  { id: "ai", label: "AI" },
  { id: "stocks", label: "주식" },
  { id: "crypto", label: "코인" },
  { id: "world", label: "세계뉴스" },
];

export const SOURCES = [
  { title: "Steam 뉴스", category: "games", url: "https://store.steampowered.com/news/", description: "게임별 개발사 공지와 출시·업데이트 소식" },
  { title: "INDIE Live Expo", category: "games", url: "https://indie.live-expo.games/news/", description: "일본 인디게임 쇼케이스와 참가작 발표" },
  { title: "Aniplex", category: "anime", url: "https://www.aniplex.co.jp/news/index.html", description: "일본 애니 신작과 방영·이벤트 공지" },
  { title: "AnimeJapan", category: "anime", url: "https://anime-japan.jp/news", description: "애니메이션 행사 공식 발표" },
  { title: "네이버웹툰", category: "comics", url: "https://comic.naver.com/index", description: "요일별 연재와 이달의 신작" },
  { title: "카카오페이지", category: "comics", url: "https://page.kakao.com/menu/10011/screen/101?subcategory_uid=120", description: "웹소설 신작과 플랫폼 소식" },
  { title: "Rakuten Fashion Week TOKYO", category: "fashion", url: "https://rakutenfashionweektokyo.com/jp/", description: "도쿄 패션위크 일정과 브랜드·런웨이 소식" },
  { title: "KBS WORLD Radio 연예 RSS", category: "idols", url: "https://world.kbs.co.kr/rss/rss_enternews.htm?lang=k", description: "K-팝 아티스트와 공연 소식" },
  { title: "Soompi 음악", category: "idols", url: "https://www.soompi.com/category/music", description: "K-팝 신곡과 아티스트 소식" },
  { title: "Weverse 공지 · SEVENTEEN", category: "idols", url: "https://weverse.io/seventeen/notice/", description: "소속사 공식 공연 공지의 예시" },
  { title: "OpenAI 뉴스", category: "ai", url: "https://openai.com/news/", description: "AI 모델과 창작 도구의 공식 변경 사항" },
  { title: "Google Gemini 블로그", category: "ai", url: "https://blog.google/products-and-platforms/products/gemini/", description: "Gemini 기능과 창작 워크플로 업데이트" },
  { title: "KRX 정보데이터시스템", category: "stocks", url: "https://data.krx.co.kr/", description: "한국 거래소 종목 시세와 시장 통계" },
  { title: "금융감독원 DART", category: "stocks", url: "https://dart.fss.or.kr/", description: "국내 기업 공시 원문" },
  { title: "업비트 시세 문서", category: "crypto", url: "https://docs.upbit.com/kr/reference/list-quote-tickers", description: "거래쌍과 시세 응답의 기준 확인" },
  { title: "Kraken 블로그", category: "crypto", url: "https://blog.kraken.com/", description: "거래소 소식과 서비스 공지" },
  { title: "이더리움 재단 블로그", category: "crypto", url: "https://blog.ethereum.org/", description: "이더리움 네트워크와 개발 공지" },
  { title: "UN News", category: "world", url: "https://news.un.org/en/", description: "유엔 공식 국제 뉴스와 현안" },
  { title: "WHO 뉴스룸", category: "world", url: "https://www.who.int/news-room", description: "세계보건기구 공식 발표와 브리핑" },
];

const categoryIds = new Set(CATEGORIES.map(({ id }) => id));
const previousCategoryIds = { idols: "fashion", stocks: "markets", crypto: "markets" };
const cryptoTerms = /암호화폐|가상\s*(?:자산|화폐)|코인|이더리움|블록체인|\b(?:crypto(?:currency|currencies)?|bitcoin|ethereum|solana|altcoin|stablecoin|btc|coinbase|binance|upbit|bithumb)\b/i;
const idolTerms = /아이돌|컴백|팬미팅|팬사인회|위버스|アイドル|\b(?:k[\s-]?pop|idols?|weverse)\b/i;
const fashionTerms = /패션|의상|라텍스|가죽|착장|컬렉션|런웨이|ファッション|衣装|コレクション|\b(?:fashion|runway|outfits?)\b/i;
const categoryLabels = [
  ["games", /^(?:일본\s*)?(?:인디\s*)?게임(?:\s*·\s*제작)?$/i],
  ["anime", /^(?:일본\s*)?(?:애니(?:메이션)?(?:\s*[·/&]\s*서브컬처)?|서브컬처)$/i],
  ["comics", /^(?:웹툰|웹소설|웹툰\s*[·/&]\s*웹소설|웹소설\s*[·/&]\s*웹툰)$/i],
  ["idols", /^(?:아이돌|K[\s-]?POP)(?:\s*[·/&]\s*(?:공연|컴백))?$/i],
  ["fashion", /^(?:패션|아이돌|가죽|라텍스)(?:\s*[·/&]\s*(?:패션|아이돌|가죽|라텍스|무대 의상))*$/i],
  ["ai", /^AI(?:\s*[·/&]\s*(?:창작|순애|도구))?$/i],
  ["crypto", /^(?:암호화폐|가상\s*자산|비트코인|코인|크립토)(?:\s*[·/&]\s*(?:암호화폐|가상\s*자산|비트코인|코인))*$/i],
  ["markets", /^(?:세계\s*[·/&]\s*)?(?:시장|주식|투자|금융|비트코인|코인)(?:\s*[·/&]\s*(?:시장|주식|투자|비트코인|코인))*$/i],
  ["world", /^세계\s*뉴스$|^국제\s*(?:뉴스|정세)$/i],
];
const fields = /^(?:점수|선정 점수|검토 점수|공지일(?:·사건일)?|발표일|사건일|대상 지역(?:과 플랫폼)?|(?:대상 )?플랫폼|지역|요약|내용|바뀐 사실|확인된 사실|독자에게 중요한 점|원문(?: 링크)?|출처|권리(?: 상태)?|영상 자료 권리 상태|확인할 점|자료 권리|편집 포인트)$/;
const markdownLinks = /\[([^\]\r\n]+)\]\(<?(https?:\/\/[^\s)>]+)>?\)/gi;
const looseLinks = /https?:\/\/[^\s<>\[\]()]+/gi;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTitle(value) {
  return text(value).replace(/\s+/g, " ").slice(0, 200);
}

function safeUrl(value) {
  try {
    const url = new URL(text(value));
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
  } catch {
    return "";
  }
}

function validDate(value) {
  const date = text(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const instant = new Date(`${date}T00:00:00Z`);
  return !Number.isNaN(instant.getTime()) && instant.toISOString().slice(0, 10) === date ? date : "";
}

function validTimestamp(value) {
  const stamp = text(value);
  if (!/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,6})?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(stamp)
    || !validDate(stamp.slice(0, 10))) return "";
  const instant = new Date(stamp);
  return Number.isNaN(instant.getTime()) ? "" : instant.toISOString();
}

function recordId({ category, kind, title, sources }) {
  const url = sources[0] ? new URL(sources[0].url) : null;
  if (url) {
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^(?:utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
    }
    url.searchParams.sort();
  }
  // Use the original category namespace so channel splits keep old bookmarks.
  const categoryKey = previousCategoryIds[category] ?? category;
  const key = [kind, categoryKey, title.normalize("NFKC").toLowerCase().replace(/[\s\p{P}]/gu, ""), url?.href].join("\n");
  let hash = 2166136261;
  for (const character of key) {
    hash = Math.imul(hash ^ character.codePointAt(0), 16777619);
  }
  return `${kind}-${(hash >>> 0).toString(36)}`;
}

function normalizeSources(sources) {
  if (!Array.isArray(sources)) return [];
  const seen = new Set();
  return sources.flatMap((source) => {
    const url = safeUrl(source?.url);
    if (!url || seen.has(url)) return [];
    seen.add(url);
    return [{ label: text(source.label).slice(0, 160) || new URL(url).hostname, url }];
  });
}

function normalizeCategory(category, kind, title, summary, sources) {
  if (category !== "markets" && category !== "fashion") return category;
  const evidence = [title, summary, ...sources.map(({ label, url }) => `${label} ${url}`)].join(" ");
  if (category === "markets") return cryptoTerms.test(evidence) ? "crypto" : "stocks";
  return kind !== "manual" && idolTerms.test(evidence) && !fashionTerms.test(evidence) ? "idols" : "fashion";
}

export function normalizeRecords(data) {
  const records = Array.isArray(data) ? data : data?.records;
  if (!Array.isArray(records)) return [];
  return records.flatMap((entry) => {
    const title = normalizeTitle(entry?.title);
    const date = validDate(entry?.date);
    if (!title || !date) return [];
    const summary = text(entry.summary).slice(0, 20000);
    const sources = normalizeSources(entry.sources);
    const kind = entry.kind === "manual" ? "manual" : "brief";
    const category = normalizeCategory(entry.category, kind, title, summary, sources);
    if (!categoryIds.has(category)) return [];
    const record = { title, category, summary, date, sources, kind };
    const titleKo = normalizeTitle(entry.titleKo);
    const summaryKo = text(entry.summaryKo).slice(0, 360);
    if (titleKo && summaryKo) {
      record.titleKo = titleKo;
      record.summaryKo = summaryKo;
    }
    const publishedAt = validTimestamp(entry.publishedAt);
    const changedAt = validTimestamp(entry.changedAt);
    if (publishedAt) record.publishedAt = publishedAt;
    if (changedAt) record.changedAt = changedAt;
    const platform = text(entry.platform).slice(0, 160);
    if (platform) record.platform = platform;
    if (Number.isInteger(entry.score) && entry.score >= 0 && entry.score <= 10) record.score = entry.score;
    const identityTitle = normalizeTitle(entry.identityTitle) || title;
    const id = text(entry.id).slice(0, 200) || recordId({ ...record, title: identityTitle });
    return [{ id, ...record }];
  });
}

export function compareRecordDates(a, b) {
  return a.date.localeCompare(b.date) || (a.publishedAt || "").localeCompare(b.publishedAt || "");
}

export function mergeRecords(...arrays) {
  const merged = new Map();
  for (const array of arrays) {
    for (const record of normalizeRecords(array)) {
      const previous = merged.get(record.id);
      if (!previous || record.date >= previous.date) merged.set(record.id, { ...previous, ...record });
    }
  }
  return [...merged.values()].sort((a, b) => compareRecordDates(b, a));
}

function dateIn(value) {
  const iso = /\b(\d{4}-\d{2}-\d{2})\b/.exec(value);
  if (iso) return validDate(iso[1]);
  const korean = /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/.exec(value);
  if (!korean) return "";
  return validDate(`${korean[1]}-${korean[2].padStart(2, "0")}-${korean[3].padStart(2, "0")}`);
}

function findLinks(value) {
  const links = [...value.matchAll(markdownLinks)].map((match) => ({ label: match[1], url: match[2] }));
  const remainder = value.replace(markdownLinks, "");
  for (const match of remainder.matchAll(looseLinks)) {
    links.push({ url: match[0].replace(/[.,;:!?。]+$/, "") });
  }
  return normalizeSources(links);
}

function stripMarkup(value) {
  return value.replace(/\*\*|__|`/g, "").trim();
}

function briefText(value) {
  return stripMarkup(value.replace(markdownLinks, "").replace(looseLinks, "").replace(/<>/g, ""))
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*+]\s+|\d+[.)]\s+)/, "").replace(/(?:\s*[·|—-])+\s*$/, "").trim())
    .filter((line) => line && !/^(?:원문(?: 링크)?|출처)\s*[:：]?\s*$/.test(line))
    .join("\n");
}

function categoryFromLabel(label) {
  const cleaned = label.replace(/^[\[(]|[\])]$/g, "").trim();
  return categoryLabels.find(([, pattern]) => pattern.test(cleaned))?.[0];
}

function inferCategory(value) {
  if (cryptoTerms.test(value)) return "crypto";
  if (/주가|거래소|기준금리|금융|은행|국채|주식/.test(value)) return "stocks";
  if (fashionTerms.test(value)) return "fashion";
  if (idolTerms.test(value)) return "idols";
  if (/웹소설|웹툰|카카오페이지/.test(value)) return "comics";
  if (/AI\b|인공지능|모델|프롬프트/.test(value)) return "ai";
  if (/애니|서브컬처|방영|예고편|Netflix/i.test(value)) return "anime";
  return "world";
}

function titleAndScore(value) {
  const scoreFirst = /^(\d{1,2})\s*(?:점|\/\s*10)\s*[·|:：—-]\s*/.exec(value);
  if (scoreFirst) return { title: value.slice(scoreFirst[0].length), score: Number(scoreFirst[1]) };
  const scoreLast = /\s*[([]?(\d{1,2})\s*(?:점|\/\s*10)[)\]]?\s*$/.exec(value);
  return scoreLast ? { title: value.slice(0, scoreLast.index).trim(), score: Number(scoreLast[1]) } : { title: value };
}

function entryHeader(line, depth) {
  const heading = /^(#{1,6})\s+(.+)$/.exec(line);
  if (heading && heading[1].length > depth) {
    return { label: stripMarkup(heading[2]).replace(/^\d+[.)]\s+/, ""), remainder: "" };
  }
  const bold = /^(?:(?:[-*+]\s+|\d+[.)]\s+))?\*\*(.+?)\*\*\s*[.:：]?\s*(.*)$/.exec(line);
  if (bold) return { label: bold[1].replace(/\s*[:：]\s*$/, "").trim(), remainder: bold[2] };
  const labeled = /^(?:(?:[-*+]\s+|\d+[.)]\s+))?([^:：]{1,50})\s*[:：]\s+(.+)$/.exec(line);
  if (labeled && (fields.test(labeled[1].trim()) || labeled[1].trim() === "제목" || categoryFromLabel(labeled[1]))) {
    return { label: labeled[1].trim(), remainder: labeled[2] };
  }
  return null;
}

function summaryTitle(summary) {
  return summary
    .split(/\n|[。!?]|\.\s+/)[0]
    .replace(/^\s*(?:\d{4}년\s*)?\d{1,2}월\s*\d{1,2}일\s*/, "")
    .replace(/[.]$/, "")
    .slice(0, 110);
}

export function parseBrief(value, filename = "") {
  const lines = text(value).split(/\r?\n/);
  const date = dateIn(text(filename)) || dateIn(lines.slice(0, 5).join(" "));
  if (!date) return [];

  const entries = [];
  let section = "";
  let depth = 0;
  let sectionCategory = "";
  let current;
  function finishEntry() {
    if (!current) return;
    const body = current.lines.join("\n");
    const sources = findLinks(body);
    const summary = briefText(body);
    const title = current.title || summaryTitle(summary);
    if (sources.length && title && !/^검증된 새 소식 없음/.test(title)) {
      const score = current.score ?? Number(/(?:점수|평가)\s*[:：]?\s*(\d{1,2})/.exec(stripMarkup(body))?.[1]);
      const platform = /(?:^|\n)\s*(?:플랫폼|대상 플랫폼)\s*[:：]?\s*([^\n]+)/.exec(summary)?.[1];
      entries.push({
        title,
        category: current.category || inferCategory(`${title} ${summary}`),
        summary,
        date,
        sources,
        platform,
        score,
      });
    }
    current = undefined;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const heading = /^(#{1,6})\s+/.exec(line);
    const outline = stripMarkup(line.replace(/^#{1,6}\s+/, "")).replace(/^(?:\d+[.)]|[-*+])\s+/, "");
    const sectionName = /^(공개\s*후보|개인\s*레이더|오늘의?\s*초안|오늘\s*할\s*일|주간\s*(?:리뷰|요약))(?=$|[\s:：(])/u.exec(outline)?.[1];
    if (sectionName || (heading && heading[1].length <= depth)) {
      finishEntry();
      section = sectionName?.replace(/\s/g, "") || "";
      depth = heading?.[1].length ?? 0;
      sectionCategory = section === "공개후보" ? "games" : "";
      continue;
    }
    if (section !== "공개후보" && section !== "개인레이더") continue;
    const header = entryHeader(line, depth);
    if (header && !fields.test(header.label)) {
      const category = section === "개인레이더" ? categoryFromLabel(header.label) : "";
      if (category) {
        finishEntry();
        sectionCategory = category;
        current = { category, lines: [header.remainder] };
      } else {
        finishEntry();
        const labeledTitle = header.label === "제목";
        current = {
          ...titleAndScore(labeledTitle ? header.remainder : header.label),
          category: sectionCategory,
          lines: labeledTitle ? [] : [header.remainder],
        };
      }
      continue;
    }
    current ??= { category: sectionCategory, lines: [] };
    current.lines.push(line);
  }
  finishEntry();
  return mergeRecords(entries);
}

export const SEED = normalizeRecords([
  {
    title: "Eternal Palace Sakura",
    titleKo: "《이터널 팰리스 사쿠라》 출시와 한국어 지원",
    summaryKo: "스팀에서 체험판을 받을 수 있고, 본편은 한국어 메뉴와 자막을 지원한다고 표시됩니다. 스위치 버전과 체험판의 한국어 지원은 별도 확인이 필요합니다.",
    category: "games",
    summary: "일본 배급사 Shochiku Games는 11월 5일 출시로 안내하고 Steam 상점의 출시일 표시는 11월 4일이다. Steam에서 데모 다운로드와 한국어 인터페이스·자막 지원 표기를 확인했다. Switch 한국어 지원과 데모 자체의 언어는 별도 확인이 필요하다.",
    date: "2026-11-06",
    platform: "Steam · Nintendo Switch",
    score: 9,
    sources: [
      { label: "일본 배급사", url: "https://game.shochiku.co.jp/ja/games/eternal-palace-sakura/" },
      { label: "Steam 상점", url: "https://store.steampowered.com/app/2991310/Eternal_Palace_Sakura/" },
    ],
  },
  {
    title: "Fish Them All!",
    titleKo: "《피시 뎀 올!》 체험판과 한국어 지원 소식",
    summaryKo: "스팀에 체험판이 올라왔고, 본편은 한국어 메뉴와 자막을 지원한다고 표시됩니다. 개발사 공지와 스팀의 일정 표기가 달라 본편의 정확한 출시일은 확인이 필요합니다.",
    category: "games",
    summary: "일본 개발사 Piisu가 11월 5일 출시 계획을 공지했다. Steam에 데모와 한국어 인터페이스·자막 지원이 표시된다. 본편은 출시 예정이며, 개발사 공지와 Steam의 12월 날짜 표기가 달라 정확한 출시일은 확인이 필요하다.",
    date: "2026-11-06",
    platform: "Steam",
    score: 8,
    sources: [
      { label: "개발사 보도자료", url: "https://prtimes.jp/main/html/rd/p/000000007.000030011.html" },
      { label: "Steam 상점", url: "https://store.steampowered.com/app/5004930/Fish_Them_All/" },
      { label: "공식 프레스킷", url: "https://zentsuru.com/presskit/" },
    ],
  },
]);
