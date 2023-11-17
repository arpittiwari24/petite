import React, { useState } from 'react';
import CopyIcon from "./copy-svgrepo-com.svg"
import Reload from "./refresh-svgrepo-com.svg"

const App: React.FC = () => {
  const [origUrl, setOrigUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const [rateLimitExceeded, setRateLimitExceeded] = useState<boolean>(false);
const [rateLimitMessage, setRateLimitMessage] = useState<string>('');


  const isValidUrl = (url: string) => {
    const pattern = /^(http|https):\/\/[^ "]+$/;
    return pattern.test(url);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrigUrl(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
  
    if (!isValidUrl(origUrl)) {
      console.error('Invalid URL format');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('https://petite.onrender.com/api/short', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origUrl }),
      });
  
      if (response.status === 429) {
        // Rate limit exceeded
        const rateLimitMessage = await response.text();
      setRateLimitExceeded(true);
      setRateLimitMessage(rateLimitMessage);
        setLoading(false)
      } else if (response.ok) {
        const data = await response.json();
        setShortUrl(data.shortUrl);
        setLoading(false);
      } else {
        console.error('Failed to shorten URL');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-white">
    <h1 className="text-4xl md:text-7xl text-center mb-4">URL Shortener</h1>
    <form onSubmit={handleSubmit} className="w-full max-sm:w-2/3 max-w-sm">
    <div className="flex flex-col mb-4 pt-10">
      <input
        type="text"
        id="original-url"
        value={origUrl}
        onChange={handleInputChange}
        placeholder="Enter the URL"
        className="mt-1 p-2 rounded border border-gray-300 focus:ring focus:ring-blue-300 focus:outline-none"
      />
    </div>
    <button type="submit" className="btn btn-success w-full py-2">Shorten URL</button>
  </form>
    {loading && <div className="mt-4 text-lg">Loading...</div>}
    {rateLimitExceeded && (
      <>
     <div className="mt-4 max-sm:text-lg lg:text-xl">
       {rateLimitMessage}
     </div>
     <div className=' max-sm:w-72'>
      <img src="https://media.tenor.com/JZJ7ukQTO24AAAAC/come-back-tomorrow-were-closed.gif" alt="Come back Tomorrow" />
     </div>
     </>
    )}
    {shortUrl && (
     <div className="mt-4 flex flex-col md:flex-row md:items-center">
     <p className="text-lg font-medium">Shortened URL:</p>
     <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 bg-slate-300 underline mt-2 md:mt-0 md:ml-2">
       {shortUrl}
     </a>
     <button
       onClick={() => navigator.clipboard.writeText(shortUrl)}
       className="btn btn-secondary mt-2 md:mt-0 md:ml-2 flex items-center justify-center p-1 w-20"
     >  <img src={CopyIcon} className='w-16 h-8' alt="copy"/>
     </button>
    <div className='px-2'><button className='btn btn-info' onClick={() => window.location.reload()}><img src={Reload} className='w-16 h-8' alt="copy"/></button></div>
   </div>
   
    
    )}
  </div>
  
  );
};

export default App;
