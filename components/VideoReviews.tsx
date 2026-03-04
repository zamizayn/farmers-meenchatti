
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { VideoReview } from '../types';

// Extract YouTube video ID from URL
const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const VideoReviews: React.FC = () => {
  const [videos, setVideos] = useState<VideoReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only the latest 3-6 videos for the home page
    const q = query(collection(db, 'video_reviews'), orderBy('createdAt', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoReview[];
      setVideos(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="video-reviews" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <span className="text-sky-600 font-bold uppercase tracking-[0.3em] text-sm">Visual Stories</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">Video Reviews</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            See why food vloggers and seafood lovers can't get enough of our traditional clay pot preparations.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-[2.5rem] bg-slate-100 aspect-video animate-pulse"></div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            <p>No video reviews available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((video) => {
              const videoId = getYoutubeId(video.youtubeLink);
              if (!videoId) return null; // Skip invalid URLs
              const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

              return (
                <div key={video.id} className="group relative">
                  <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-xl border border-sky-100 bg-slate-100">
                    <img
                      src={thumbnailUrl}
                      alt={video.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <a
                        href={video.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-sky-600 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white"
                      >
                        <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </a>
                    </div>

                    {/* Tag */}
                    <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest">
                      Customer Review
                    </div>
                  </div>

                  <div className="mt-6 px-4 space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                      {video.name}
                    </h3>
                    <p className="text-sky-600 font-medium text-sm flex items-center gap-2">
                      <span className="w-4 h-px bg-sky-200"></span>
                      Watch on YouTube
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-20 text-center">
          <a
            href="https://www.youtube.com/@farmersmeenchatti"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:bg-sky-950 transition-all shadow-xl hover:shadow-sky-900/20"
          >
            <svg className="w-6 h-6 fill-[#FF0000]" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z" />
            </svg>
            Subscribe on YouTube
          </a>
        </div>
      </div>
    </section>
  );
};

export default VideoReviews;
