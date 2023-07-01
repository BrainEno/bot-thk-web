import { Window } from '../../global';
export const GA_TRACKING_ID = process.env.GA_TRACKING_ID;

let window: Window;
// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (window && window.gtag) {
    window.gtag('config' as any, GA_TRACKING_ID as string, {
      page_path: url
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: any) => {
  if (window && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};
