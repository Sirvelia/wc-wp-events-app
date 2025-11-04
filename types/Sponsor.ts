export type Sponsor = {
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
    meta: {
        _wcpt_sponsor_website: string;
    };
}; 