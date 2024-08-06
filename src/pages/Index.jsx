import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Download } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import ytdl from 'ytdl-core';

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
      if (!ytdl.validateURL(channelUrl)) {
        throw new Error('Invalid YouTube URL');
      }

      const info = await ytdl.getInfo(channelUrl);
      const shortsVideos = info.related_videos.filter(video => video.isShort);

      const formattedShorts = shortsVideos.map(video => ({
        id: video.id,
        title: video.title,
        views: video.view_count,
        likes: video.likes,
        duration: `${Math.floor(video.length_seconds / 60)}:${(video.length_seconds % 60).toString().padStart(2, '0')}`,
        downloadUrl: video.video_url
      }));

      setShorts(formattedShorts);
    } catch (err) {
      setError(err.message || 'Failed to scrape YouTube Shorts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl) => {
    try {
      const info = await ytdl.getInfo(downloadUrl);
      const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
      const url = format.url;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${info.videoDetails.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download the video. Please try again.');
    }
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
