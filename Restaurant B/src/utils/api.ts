const API_BASE_URL = ''; //API base URL goes here
const AUTH_TOKEN = ''; //Auth_Token goes here

export interface ApiVote {
  created: string;
  studyid: string;
  votetarget: 'lunch' | 'weigh' | 'grill';
  vote: string;
  comment: string | null;
}

export const submitVote = async (
  votetarget: 'lunch' | 'deli' | 'grill',
  vote: string,
  comment: string | null = null
): Promise<void> => {
  // Map deli to weigh for API
  const apiVotetarget = votetarget === 'deli' ? 'weigh' : votetarget;
  
  const voteData: ApiVote = {
    created: new Date().toISOString(),
    studyid: 'restaurant-b',
    votetarget: apiVotetarget as 'lunch' | 'weigh' | 'grill',
    vote,
    comment
  };

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(voteData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to submit vote:', error);
    // Don't throw the error to prevent UI from breaking
    // The app should continue to work even if API is down
  }
};

export const fetchTodaysVotes = async (): Promise<ApiVote[]> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiVote[] = await response.json();
    
    // Filter for today's votes with studyid 'restaurant-a'
    const today = new Date().toISOString().split('T')[0];
    
    return data.filter(vote => 
      vote.studyid === 'restaurant-b' && 
      vote.created.startsWith(today)
    );
  } catch (error) {
    console.error('Failed to fetch votes:', error);
    return []; // Return empty array if API fails
  }
};