import fetch from 'node-fetch';

export default defineEventHandler(async (event) => {
  const url = 'https://res.cloudinary.com/dkx1f5edp/any/list/v1748888470/wvb.json';
  const response = await fetch(url);

  if (!response.ok) {
    return { error: 'Failed to fetch images', status: response.status };
  }

  const data = await response.json();
  return data;
});