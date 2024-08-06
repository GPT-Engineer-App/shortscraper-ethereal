import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download } from "lucide-react";
import axios from 'axios';
import * as XLSX from 'xlsx';
import ytdl from 'ytdl-core';

const Index = () => {
  const [channelUrl, setChannelUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleScrape = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // This is a mock implementation. In a real scenario, you'd need a backend service to handle YouTube API requests and file downloads.
      const response = await axios.get(`https://api.example.com/scrape?channelUrl=${encodeURIComponent(channelUrl)}`);
      const { shorts, metadata } = response.data;

      // Download MP4 files
      shorts.forEach((short, index) => {
        ytdl(short.url, { filter: 'audioandvideo' })
          .pipe(fs.createWriteStream(`short_${index + 1}.mp4`));
      });

      // Generate Excel file
      const ws = XLSX.utils.json_to_sheet(metadata);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Metadata");
      XLSX.writeFile(wb, "shorts_metadata.xlsx");

      setSuccess('Scraping completed successfully!');
    } catch (err) {
      setError('An error occurred while scraping. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">YouTube Shorts Scraper</h1>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter YouTube Channel URL"
            value={channelUrl}
            onChange={(e) => setChannelUrl(e.target.value)}
          />
          <Button
            onClick={handleScrape}
            disabled={isLoading || !channelUrl}
            className="w-full"
          >
            {isLoading ? 'Scraping...' : 'Scrape Shorts'}
            {!isLoading && <Download className="ml-2 h-4 w-4" />}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
