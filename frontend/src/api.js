import axios from 'axios';

export const fetchOpenAIResponse = async (msg) => {
  try {
    const response = await axios.post("http://localhost:8080/fetch-openai-response", {
      msg
    });
    console.log(response.data)
    return response.data; // The assistant's response
  } catch (error) {
    console.error("Error fetching response from server:", error);
    throw error;
  }
};
