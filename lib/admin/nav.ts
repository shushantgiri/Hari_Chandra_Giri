export interface NavLink {
  label: string;
  href: string;
}

export interface NavSection {
  label: string;
  icon: "home" | "content" | "media" | "messages" | "more";
  href?: string;
  items?: NavLink[];
}

// The full structure from the brief. Records, Photos and Messages are fully
// built; everything else routes to a real page that explains it follows the
// same pattern — never a broken link.
export const NAV_SECTIONS: NavSection[] = [
  { label: "Home", icon: "home", href: "/admin" },
  {
    label: "Content",
    icon: "content",
    items: [
      { label: "World Records", href: "/admin/records" },
      { label: "Achievements", href: "/admin/achievements" },
      { label: "Timeline", href: "/admin/timeline" },
      { label: "Events", href: "/admin/events" },
      { label: "Awards", href: "/admin/awards" },
      { label: "Athlete Profile", href: "/admin/profile" },
    ],
  },
  {
    label: "Media",
    icon: "media",
    items: [
      { label: "Photos", href: "/admin/photos" },
      { label: "Galleries", href: "/admin/galleries" },
      { label: "Videos", href: "/admin/videos" },
    ],
  },
  { label: "Messages", icon: "messages", href: "/admin/messages" },
  {
    label: "More",
    icon: "more",
    items: [
      { label: "Site Settings", href: "/admin/settings" },
      { label: "SEO", href: "/admin/seo" },
      { label: "Social Links", href: "/admin/social" },
      { label: "Admin Users", href: "/admin/admins" },
      { label: "Activity Log", href: "/admin/activity" },
    ],
  },
];
