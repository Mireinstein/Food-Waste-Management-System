// pages/api/menu.js
export default async function handler(req, res) {
    const apiUrl = process.env.NEXT_PUBLIC_MENU_API_URL
    console.log('API URL:', apiUrl);

    try {
        const response = await fetch(apiUrl,{
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
