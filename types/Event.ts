export type Event = {
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
    author: number;
    featured_media: number;
    template: string;
    class_list: string[];
    "Start Date (YYYY-mm-dd)": string;
    "End Date (YYYY-mm-dd)": string;
    "Event Timezone": string;
    "Location": string;
    "URL": string;
    "Twitter": string;
    "WordCamp Hashtag": string;
    "Number of Anticipated Attendees": string;
    "Organizer Name": string;
    "WordPress.org Username": string;
    "A/V Wrangler Name": string;
    "Virtual event only": string;
    "Host region": string;
    "Venue Name": string;
    "Physical Address": string;
    "Maximum Capacity": string;
    "Available Rooms": string;
    "Website URL": string;
    "Exhibition Space Available": string;
    "Hide from Event Feeds": string;
    "_venue_coordinates": string;
    "_venue_street_name": string;
    "_venue_street_number": string;
    "_venue_city": string;
    "_venue_state": string;
    "_venue_country_code": string;
    "_venue_country_name": string;
    "_venue_zip": string;
    "_host_coordinates": string;
    "_host_street_name": string;
    "_host_street_number": string;
    "_host_city": string;
    "_host_state": string;
    "_host_country_code": string;
    "_host_country_name": string;
    "_host_zip": string;
    session_start_time: number;
    jetpack_sharing_enabled: boolean;
    _links: {
        self: Array<{
            href: string;
            targetHints?: {
                allow: string[];
            };
        }>;
        collection: Array<{
            href: string;
        }>;
        about: Array<{
            href: string;
        }>;
        author: Array<{
            embeddable: boolean;
            href: string;
        }>;
        "version-history": Array<{
            count: number;
            href: string;
        }>;
        "predecessor-version": Array<{
            id: number;
            href: string;
        }>;
        "wp:featuredmedia": Array<{
            embeddable: boolean;
            href: string;
        }>;
        "wp:attachment": Array<{
            href: string;
        }>;
        curies: Array<{
            name: string;
            href: string;
            templated: boolean;
        }>;
    };
};

export type EventDetails = {
    id: number;
    name: string;
    description: string;
    url: string;
    gmt_offset: number;
    timezone_string: string;
};

export type SelectedEvent = {
    id: number;
    title: {
        rendered: string;
    };
    featured_media: number;
    URL: string;
    _venue_country_name: string;
    'Start Date (YYYY-mm-dd)': string;
    'End Date (YYYY-mm-dd)': string;
};
