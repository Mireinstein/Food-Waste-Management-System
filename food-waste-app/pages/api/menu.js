// pages/api/menu.js
export default async function handler(req, res) {
    const apiUrl = 'https://amherst.api.nutrislice.com/menu/api/weeks/school/valentine-hall/menu-type/dinner/2025/03/29/';

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
