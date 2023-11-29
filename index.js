const express = require('express');
const request = require('request-promise-native');

const app = express();
const PORT = process.env.PORT || 3000; // Vercel will set the PORT

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('URL parameter is required');
    }

    try {
        const options = {
            uri: targetUrl,
            headers: {
                'Referer': 'https://1stream.eu',
            },
            encoding: null, // Important for binary data like images, videos, etc.
            resolveWithFullResponse: true // To get the full response instead of just the body
        };

        const response = await request(options);

        // Check if the headers and the content-type are defined
        const contentType = response.headers && response.headers['content-type'] ? response.headers['content-type'] : 'text/plain';

        res.setHeader('Content-Type', contentType);
        res.send(response.body); // Send the body of the response
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Proxy error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
