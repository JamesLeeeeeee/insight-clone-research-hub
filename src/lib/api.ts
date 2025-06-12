const API_BASE_URL = 'http://localhost:5001';

export const researchAPI = {
  setupResearch: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/research/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};