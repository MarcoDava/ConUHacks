const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/repo/:username', async (req, res) => {
  const { username } = req.params;
  const token = process.env.GITHUB_TOKEN;

  try {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const repositories = response.data.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
    }));

    res.json(repositories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching repositories.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
