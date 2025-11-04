export type Speaker = {
    id: number;
    slug: string;
    link: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
        protected: boolean;
    };
    featured_media: number;
    avatar_urls: {
        "24": string;
        "48": string;
        "96": string;
        "128": string;
        "256": string;
        "512": string;
    };
}
