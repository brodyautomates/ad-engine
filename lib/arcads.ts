const BASE_URL = "https://external-api.arcads.ai";

function getAuthHeader(): string {
  const token = process.env.ARCADS_AUTH_TOKEN;
  if (!token) throw new Error("ARCADS_AUTH_TOKEN not set");
  return token;
}

async function arcadsFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Arcads API error ${res.status}: ${text}`);
  }

  return res.json();
}

export interface ArcadsActor {
  id: string;
  name: string;
  gender: string;
  age: string;
  skinTone: string;
  thumbnailUrl: string;
  freeSpeech: boolean;
}

export interface ArcadsSituation {
  id: string;
  name: string;
  thumbnailUrl: string;
  actorId: string;
  actorName: string;
  isPro: boolean;
}

export interface ArcadsVoice {
  id: string;
  name: string;
  gender: string;
  age: string;
  accent: string;
  language: string;
  descriptive: string;
  audioUrl: string;
}

export async function listActors(filters?: {
  gender?: string[];
  age?: string[];
}) {
  const params = new URLSearchParams();
  if (filters?.gender) {
    filters.gender.forEach((g) => params.append("gender[]", g));
  }
  if (filters?.age) {
    filters.age.forEach((a) => params.append("age[]", a));
  }
  const query = params.toString();
  return arcadsFetch(`/v1/actors${query ? `?${query}` : ""}`);
}

export async function listSituations(actorId?: string) {
  if (actorId) {
    return arcadsFetch(`/v1/actors/${actorId}/situations`);
  }
  return arcadsFetch("/v1/situations?actorFreeSpeech=true");
}

export async function listVoices() {
  return arcadsFetch("/v1/voices");
}

export async function createProduct(name: string, description: string) {
  return arcadsFetch("/v1/products", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

export async function createFolder(productId: string, name: string) {
  return arcadsFetch("/v1/folders", {
    method: "POST",
    body: JSON.stringify({ productId, name }),
  });
}

export async function createScript(
  folderId: string,
  name: string,
  text: string,
  situationId: string,
  voiceId?: string
) {
  const videoConfig: Record<string, string> = { situationId };
  if (voiceId) videoConfig.voiceId = voiceId;

  return arcadsFetch("/v1/scripts", {
    method: "POST",
    body: JSON.stringify({
      folderId,
      name,
      text,
      videos: [videoConfig],
    }),
  });
}

export async function generateScript(scriptId: string) {
  return arcadsFetch(`/v1/scripts/${scriptId}/generate`, {
    method: "POST",
  });
}

export async function getScriptVideos(scriptId: string) {
  return arcadsFetch(`/v1/scripts/${scriptId}/videos`);
}

export async function getVideoDownload(videoId: string) {
  return arcadsFetch(`/v1/videos/${videoId}/watch`);
}

export async function getVideo(videoId: string) {
  return arcadsFetch(`/v1/videos/${videoId}`);
}
