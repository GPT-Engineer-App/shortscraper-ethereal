import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Download } from "lucide-react"

const Index = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // TODO: Implement actual API call to scrape YouTube Shorts
      // This is a mock response for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult({
        title: "Mock YouTube Short Title",
        views: 1000000,
        likes: 50000,
        duration: "30 seconds",
        downloadUrl: "https://example.com/mock-video.mp4" // Mock download URL
      });
    } catch (err) {
      setError('Failed to scrape YouTube Short. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result && result.downloadUrl) {
      // In a real implementation, this would trigger the actual download
      // For now, we'll just show an alert
      alert("Download started! (This is a mock download)");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>YouTube Shorts Scraper</CardTitle>
          <CardDescription>Enter a YouTube Shorts URL to scrape its data</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              placeholder="https://www.youtube.com/shorts/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scraping...</> : 'Scrape'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Scraping Result</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Title:</strong> {result.title}</p>
                <p><strong>Views:</strong> {result.views.toLocaleString()}</p>
                <p><strong>Likes:</strong> {result.likes.toLocaleString()}</p>
                <p><strong>Duration:</strong> {result.duration}</p>
                <Button onClick={handleDownload} className="mt-4 w-full">
                  <Download className="mr-2 h-4 w-4" /> Download Video
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
