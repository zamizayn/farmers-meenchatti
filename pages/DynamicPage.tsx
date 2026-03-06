import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MenuCard from '../components/MenuCard';

interface PageData {
    title: string;
    description: string;
    content: string;
    slug: string;
}

const DynamicPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPage = async () => {
            if (!slug) return;

            setLoading(true);
            try {
                const q = query(
                    collection(db, 'pages'),
                    where('slug', '==', slug),
                    limit(1)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data() as PageData;
                    setPageData(data);
                } else {
                    // Page not found
                    setPageData(null);
                }
            } catch (error) {
                console.error("Error fetching dynamic page:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">404 - Page Not Found</h1>
                <p className="text-slate-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title={pageData.title}
                description={pageData.description}
                url={`https://farmersmeenchatti.com/p/${slug}`}
            />
            <Navbar onMenuClick={() => setIsMenuOpen(true)} />

            <main className="pt-32 pb-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-12 border-b border-slate-100 pb-8">
                        {pageData.title}
                    </h1>

                    <div
                        className="prose prose-slate prose-lg max-w-none 
                        prose-headings:font-serif prose-headings:text-slate-900
                        prose-p:text-slate-600 prose-p:leading-relaxed
                        prose-strong:text-slate-900 prose-strong:font-bold
                        prose-img:rounded-3xl prose-img:shadow-xl"
                        dangerouslySetInnerHTML={{ __html: pageData.content }}
                    />
                </div>
            </main>

            <MenuCard isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <Footer />
        </div>
    );
};

export default DynamicPage;
