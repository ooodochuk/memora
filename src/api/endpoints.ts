/**
 * Central registry of API paths.
 * Components and hooks must never hardcode URLs — use these builders only.
 */
export const endpoints = {
  auth: {
    me: () => "/me",
    register: () => "/auth/register",
    profile: () => "/me/profile",
    login: () => "/auth/login",
    logout: () => "/auth/logout",
    refresh: () => "/auth/refresh",
  },
  public: {
    profile: (username: string) => `/public/profiles/${username}`,
    adventure: (username: string, slug: string) =>
      `/public/profiles/${username}/adventures/${slug}`,
  },
  reference: {
    adventureStatuses: () => "/reference/adventure-statuses",
    adventureVisibilities: () => "/reference/adventure-visibilities",
    dayActivityTypes: () => "/reference/day-activity-types",
    momentTypes: () => "/reference/moment-types",
    equipmentCategories: () => "/reference/equipment-categories",
    cloudLinkProviders: () => "/reference/cloud-link-providers",
  },
  adventures: {
    list: () => "/adventures",
    detail: (id: string) => `/adventures/${id}`,
    dashboard: () => "/adventures/dashboard",
    summaries: () => "/adventures/summaries",
    create: () => "/adventures",
    update: (id: string) => `/adventures/${id}`,
    delete: (id: string) => `/adventures/${id}`,
    updateStatus: (id: string) => `/adventures/${id}/status`,
    archive: (id: string) => `/adventures/${id}/archive`,
  },
  days: {
    byAdventure: (adventureId: string) => `/adventures/${adventureId}/days`,
    detail: (dayId: string) => `/days/${dayId}`,
    create: (adventureId: string) => `/adventures/${adventureId}/days`,
    update: (dayId: string) => `/days/${dayId}`,
    delete: (dayId: string) => `/days/${dayId}`,
  },
  moments: {
    byDay: (dayId: string) => `/days/${dayId}/moments`,
    byAdventure: (adventureId: string) => `/adventures/${adventureId}/moments`,
    detail: (momentId: string) => `/moments/${momentId}`,
    create: (dayId: string) => `/days/${dayId}/moments`,
    update: (momentId: string) => `/moments/${momentId}`,
    delete: (momentId: string) => `/moments/${momentId}`,
  },
  cloudLinks: {
    create: (momentId: string) => `/moments/${momentId}/cloud-links`,
    update: (linkId: string) => `/cloud-links/${linkId}`,
    delete: (linkId: string) => `/cloud-links/${linkId}`,
  },
  equipment: {
    inventory: () => "/equipment/inventory",
    list: () => "/equipment",
    categories: () => "/equipment/categories",
    detail: (id: string) => `/equipment/${id}`,
    create: () => "/equipment",
    update: (id: string) => `/equipment/${id}`,
    delete: (id: string) => `/equipment/${id}`,
    setActive: (id: string) => `/equipment/${id}/active`,
    byAdventure: (adventureId: string) => `/adventures/${adventureId}/equipment`,
    attach: (adventureId: string) => `/adventures/${adventureId}/equipment`,
    detach: (adventureId: string, equipmentId: string) =>
      `/adventures/${adventureId}/equipment/${equipmentId}`,
  },
} as const;
