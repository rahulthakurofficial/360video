import { useEffect, useRef, useState } from "react";

const Video360Viewer = ({ videoUrl }) => {
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const viewerRef = useRef(null);
  const panoramaRef = useRef(null);

  useEffect(() => {
    
    if (!window.PANOLENS && typeof PANOLENS !== 'undefined') {
      window.PANOLENS = PANOLENS;
    }

    return () => {
      
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
      if (panoramaRef.current && panoramaRef.current.dispose) {
        panoramaRef.current.dispose();
        panoramaRef.current = null;
      }
    };
  }, []);

  const start360Video = async () => {
    setLoading(true);
    setError(null);

    try {
      
      if (!window.PANOLENS || !window.THREE) {
        throw new Error('Required libraries not loaded');
      }

     
      if (!viewerRef.current) {
        viewerRef.current = new window.PANOLENS.Viewer({
          container: containerRef.current,
          autoRotate: false,
          controlBar: true,
          autoHideInfospot: false,
          cameraFov: 75,
          output: 'console'
        });
      }

     
      panoramaRef.current = new window.PANOLENS.VideoPanorama(videoUrl, {
        autoplay: true,
        muted: true,
        loop: true,
        crossOrigin: 'anonymous'
      });

  
      panoramaRef.current.addEventListener('error', (err) => {
        throw new Error(`Video error: ${err.message}`);
      });

     
      viewerRef.current.add(panoramaRef.current);
      setStarted(true);

    } catch (err) {
      setError(`Failed to load 360° video: ${err.message}`);
      console.error("360 Viewer Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: started ? 1 : 0.5
        }} 
      />
      
      {!started && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 10
        }}>
          {loading ? (
            <div>Loading 360° viewer...</div>
          ) : error ? (
            <div>
              <p style={{ color: 'red' }}>{error}</p>
              <button 
                onClick={start360Video}
                style={{
                  padding: '10px 20px',
                  background: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Try Again
              </button>
            </div>
          ) : (
            <button 
              onClick={start360Video}
              style={{
                padding: '10px 20px',
                background: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Start 360° Experience
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Video360Viewer;