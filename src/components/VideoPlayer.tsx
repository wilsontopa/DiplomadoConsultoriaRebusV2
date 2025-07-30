import React from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div className="embed-responsive embed-responsive-16by9">
          <video controls className="embed-responsive-item w-100">
            <source src={src} type="video/mp4" />
            Tu navegador no soporta la etiqueta de video.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
