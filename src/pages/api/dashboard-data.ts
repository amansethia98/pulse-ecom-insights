
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { google } from 'googleapis';

const auth = google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/spreadsheets/readonly'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userRestaurants = session.user.restaurant.split(',').map((r: string) => r.trim());
    const isAdmin = session.user.role === 'admin';

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Fetch main data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: process.env.GOOGLE_SHEET_RANGE || 'Sheet6!A:Z',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(200).json({ restaurants: [], branches: [], data: [] });
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Filter data based on user access
    const filteredData = dataRows.filter(row => {
      const restaurant = row[0]; // Assuming first column is Restaurant
      return isAdmin || userRestaurants.includes(restaurant);
    });

    // Extract unique restaurants and branches from filtered data
    const restaurants = isAdmin 
      ? [...new Set(dataRows.map(row => row[0]))]
      : userRestaurants;
    
    const branches = [...new Set(filteredData.map(row => row[1]))] // Assuming second column is Branch
      .filter(Boolean);

    res.status(200).json({
      restaurants,
      branches,
      data: filteredData,
      headers
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
