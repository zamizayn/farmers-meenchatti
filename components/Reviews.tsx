
import React from 'react';
import { REVIEWS } from '../constants';
import { db } from '../firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = React.useState(REVIEWS);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), limit(6));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const fetchedReviews = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as any[];
          setReviews(fetchedReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="py-24 bg-sky-950 text-white relative overflow-hidden">
      {/* Abstract Water Ripples */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-900/20 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <span className="text-sky-400 font-bold uppercase tracking-[0.3em] text-sm">Customer Stories</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">Voices of Our Patrons</h2>
          <div className="flex justify-center gap-1 text-sky-300 text-xl">
            {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading reviews...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2.5rem] flex flex-col justify-between hover:bg-white/10 transition-all group">
                <div className="space-y-6">
                  <div className="flex gap-1 text-sky-400">
                    {Array.from({ length: review.rating || 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-lg text-slate-300 italic leading-relaxed">"{review.text}"</p>
                  <div className="pt-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Loved the:</span>
                    <p className="text-slate-100 font-bold">{review.dish}</p>
                  </div>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0 transition-all border border-white/20" />
                  <div>
                    <h4 className="font-bold text-white">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <button className="bg-transparent border border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white px-10 py-4 rounded-2xl font-bold transition-all">
            Read All 1,200+ Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
