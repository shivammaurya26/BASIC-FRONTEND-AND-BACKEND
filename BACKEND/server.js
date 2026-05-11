require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

// Supabase Connection using URL and Anon Key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test Connection (Supabase SDK doesn't have a simple "connect" check like pg, 
// so we do a quick fetch to verify)
const testConnection = async () => {
    const { data, error } = await supabase.from('complaints').select('count', { count: 'exact', head: true });
    if (error) {
        console.error('❌ Supabase connection error:', error.message);
    } else {
        console.log('✅ Supabase connected successfully via API');
    }
};
testConnection();

app.use(cors());
app.use(express.json());

// GET route to check if server is running
app.get('/', (req, res) => {
    res.send('Complaint API with Supabase SDK is running...');
});

// POST route to submit a complaint
app.post('/api/complaints', async (req, res) => {
    const { name, city, mobile, complaint } = req.body;

    if (!name || !city || !mobile || !complaint) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const { data, error } = await supabase
            .from('complaints')
            .insert([{ name, city, mobile, complaint }])
            .select();

        if (error) throw error;

        const newComplaint = data[0];
        console.log('Complaint saved to Supabase:', newComplaint);
        
        res.status(201).json({ 
            message: 'Complaint submitted successfully and saved to Supabase', 
            data: newComplaint 
        });
    } catch (error) {
        console.error('Error saving to Supabase:', error.message);
        res.status(500).json({ error: 'Failed to save complaint to database' });
    }
});

// GET route to retrieve all complaints
app.get('/api/complaints', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error fetching from Supabase:', error.message);
        res.status(500).json({ error: 'Failed to fetch complaints' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
