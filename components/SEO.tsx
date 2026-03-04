import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image = "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1200",
    url = "https://farmersmeenchatti.com",
    type = "website"
}) => {
    const siteTitle = "Farmers Meenchatti";
    const defaultDescription = "Experience the soul of Kerala seafood with Farmers Meenchatti. Wild-caught fish curries cooked in traditional clay pots (Meenchatti) for authentic flavor.";

    const displayTitle = title ? `${title} | ${siteTitle}` : `Farmers Meenchatti | Authentic Kerala Seafood`;
    const displayDescription = description || defaultDescription;

    // Structured Data (JSON-LD) for a Restaurant/Food Business
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Farmers Meenchatti",
        "image": [
            image
        ],
        "description": displayDescription,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kottayam Coastal Hwy",
            "addressLocality": "Kottayam",
            "addressRegion": "Kerala",
            "postalCode": "686001",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 9.5916,
            "longitude": 76.5222
        },
        "url": url,
        "telephone": "+919876543210",
        "servesCuisine": "Kerala Seafood",
        "priceRange": "₹₹",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ],
                "opens": "11:00",
                "closes": "23:00"
            }
        ]
    };

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{displayTitle}</title>
            <meta name="description" content={displayDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={displayTitle} />
            <meta property="og:description" content={displayDescription} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={displayTitle} />
            <meta name="twitter:description" content={displayDescription} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
};

export default SEO;
