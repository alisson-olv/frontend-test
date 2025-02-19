export async function getStateFromZip(zipCode) {
  try {
    const response = await fetch(`http://localhost:5000/api/cep/${zipCode}`);
    const data = await response.json();
    return data.estado;
  } catch (error) {
    console.error('Error fetching state:', error);
    throw error;
  }
}
