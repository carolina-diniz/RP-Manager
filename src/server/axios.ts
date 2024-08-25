/**
import axios from "axios";

async function getPublicIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } 
  catch (error) {
    console.error("Erro ao obter o IP público:", error);
    return null; 
  }
}
 */