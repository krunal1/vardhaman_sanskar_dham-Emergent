import React from 'react';
import { X, Download } from 'lucide-react';
import { Button } from './ui/button';

const MediaModal = ({ isOpen, onClose, media, type = 'image' }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white border-none z-10"
        size="icon"
      >
        <X className="w-6 h-6" />
      </Button>

      <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
        {type === 'video' ? (
          <div className="w-full max-w-5xl">
            {media?.includes('youtube.com') || media?.includes('youtu.be') ? (() => {
              let videoId = '';
              if (media.includes('watch?v=')) videoId = media.split('watch?v=')[1]?.split('&')[0];
              else if (media.includes('youtu.be/')) videoId = media.split('youtu.be/')[1]?.split('?')[0];
              else if (media.includes('embed/')) videoId = media.split('embed/')[1]?.split('?')[0];
              return (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  className="w-full aspect-video rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              );
            })() : (
              <video
                src={media}
                controls
                autoPlay
                className="w-full max-h-[80vh] rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ) : (
          <img
            src={media}
            alt="Zoomed view"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default MediaModal;
