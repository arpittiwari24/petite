import React, { useState } from 'react';

const App: React.FC = () => {
  const [origUrl, setOrigUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)

  const isValidUrl = (url: string) => {
    const pattern = /^(http|https):\/\/[^ "]+$/;
    return pattern.test(url);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrigUrl(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true)

    if (!isValidUrl(origUrl)) {
      console.error('Invalid URL format');
      return;
    }

    try {
      const response = await fetch('http://localhost:3333/api/short', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setShortUrl(data.shortUrl);
        setLoading(false)
      } else {
        console.error('Failed to shorten URL');
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Original URL:
          <input type="text" value={origUrl} onChange={handleInputChange} />
        </label>
        <button type="submit">Shorten URL</button>
      </form>
      {loading && <div>Loading...</div>}
      {shortUrl && (
        <div>
          Shortened URL:
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
