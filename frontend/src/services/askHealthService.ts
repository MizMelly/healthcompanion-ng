const API_URL = "https://healthcompanion-ng.onrender.com";

export interface HealthSource {
  id: number;
  slug: string;
  title: string;
  topic: string;
}

export interface HealthAnswer {
  answer: string;
  sources: HealthSource[];
}

interface AskHealthResponse {
  success: boolean;
  data: HealthAnswer;
}

export async function askHealth(
  question: string
): Promise<HealthAnswer> {
  const response = await fetch(`${API_URL}/api/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get health answer");
  }

  const result: AskHealthResponse = await response.json();

  return result.data;
}