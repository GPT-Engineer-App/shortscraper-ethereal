import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Download } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const Index = () => {
  const [channelUrl, setChannelUrl] = useState('');
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShorts([]);

    try {
      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data for demonstration
      const mockShorts = [
        { id: '1', title: 'Funny Cat Video', views: 1000000, likes: 50000, duration: '0:30', downloadUrl: 'https://example.com/video1' },
        { id: '2', title: 'Amazing Dance Moves', views: 500000, likes: 25000, duration: '0:45', downloadUrl: 'https://example.com/video2' },
        { id: '3', title: 'Quick Cooking Tip', views: 750000, likes: 35000, duration: '0:20', downloadUrl: 'https://example.com/video3' },
      ];

      setShorts(mockShorts);
    } catch (err) {
      setError('Failed to fetch YouTube Shorts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (downloadUrl) => {
    // In a real application, this would initiate the download
    console.log('Downloading:', downloadUrl);
    alert('Download started! (This is a mock action)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>YouTube Shorts Channel Scraper</CardTitle>
          <CardDescription>Enter a YouTube channel URL to scrape all Shorts</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="https://www.youtube.com/@ChannelName"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scraping...</> : 'Scrape Channel'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {shorts.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Scraping Results</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  {shorts.map((short) => (
                    <div key={short.id} className="mb-4 p-4 border rounded">
                      <h3 className="font-bold">{short.title}</h3>
                      <p><strong>Views:</strong> {short.views.toLocaleString()}</p>
                      <p><strong>Likes:</strong> {short.likes.toLocaleString()}</p>
                      <p><strong>Duration:</strong> {short.duration}</p>
                      <Button onClick={() => handleDownload(short.downloadUrl)} className="mt-2">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
