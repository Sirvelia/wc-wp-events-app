export type Session = {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
        rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: {
        rendered: string;
    };
    content: {
        rendered: string;
        protected: boolean;
    };
    excerpt: {
        rendered: string;
        protected: boolean;
    };
    author: number;
    featured_media: number;
    template: string;
    meta: {
        jetpack_post_was_ever_published: boolean;
        _wcpt_session_time: number;
        _wcpt_session_duration: number;
        _wcpt_session_type: string;
        _wcpt_session_slides: string;
        _wcpt_session_video: string;
        _wcpt_speaker_id: number[];
        footnotes: string;
    };
    session_track: number[];
    session_category: number[];
    class_list: string[];
    jetpack_sharing_enabled: boolean;
    session_date_time: {
        date: string;
        time: string;
    };
    session_speakers: {
        id: string;
        name: string;
        slug: string;
        link: string;
    }[];
    session_cats_rendered: string | null;
}

export type Track = {
    id: number;
    name: string;
    slug: string;
}

export type Category = {
    id: number;
    name: string;
    slug: string;
}