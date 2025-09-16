import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Download = () => {
  const { shareableLink } = useParams<{ shareableLink: string }>();
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(true);

  useEffect(() => {
    if (!shareableLink) {
      setError('Invalid download link');
      setDownloading(false);
      return;
    }

    // Since your backend sets Content-Disposition: attachment, 
    // we can simply redirect to trigger the download
    window.location.href = `${API_URL}/file/${shareableLink}`;
    
    // Give a moment for the download to start, then show success
    setTimeout(() => {
      setDownloading(false);
    }, 2000);
  }, [shareableLink]);

  if (downloading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <h2 className="text-2xl font-semibold text-foreground">Preparing your download...</h2>
          <p className="text-muted-foreground">This should start automatically</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Download Failed</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Return to Upload
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Download Complete</h2>
          <p className="text-muted-foreground">Your file should have started downloading</p>
        </div>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Upload Another File
        </a>
      </div>
    </div>
  );
};

export default Download;