import fetch from 'node-fetch';

export async function getAddressByCep(cep) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) throw new Error('Failed to fetch address');
  return response.json();
}
