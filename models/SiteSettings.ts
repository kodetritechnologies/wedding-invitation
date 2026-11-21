import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSettings extends Document {
  siteName: string;
  siteTagline: string;
  logoUrl?: string;
  logoText?: string;
  faviconUrl?: string;
  address: {
    formattedAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    workingHours: string;
  };
  socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  footer: {
    copyrightText: string;
    tagline: string;
  };
  announcementBar: {
    enabled: boolean;
    text: string;
  };
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: {
      type: String,
      default: "VivahVaani",
      trim: true,
    },
    siteTagline: {
      type: String,
      default: "Royal Digital Wedding Patrika & Multi-Client SaaS",
      trim: true,
    },
    logoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    logoText: {
      type: String,
      default: "VivahVaani",
      trim: true,
    },
    faviconUrl: {
      type: String,
      default: "/favicon.ico",
      trim: true,
    },
    address: {
      formattedAddress: {
        type: String,
        default: "Vijay Nagar, Indore, Madhya Pradesh • 452010",
        trim: true,
      },
      city: {
        type: String,
        default: "Indore",
        trim: true,
      },
      state: {
        type: String,
        default: "Madhya Pradesh",
        trim: true,
      },
      pincode: {
        type: String,
        default: "452010",
        trim: true,
      },
      country: {
        type: String,
        default: "India",
        trim: true,
      },
    },
    contact: {
      email: {
        type: String,
        default: "namaste@vivahvaani.kodetri.com",
        trim: true,
      },
      phone: {
        type: String,
        default: "+91 98260 12345",
        trim: true,
      },
      whatsapp: {
        type: String,
        default: "919826012345",
        trim: true,
      },
      workingHours: {
        type: String,
        default: "Mon - Sun: 10:00 AM - 7:00 PM IST",
        trim: true,
      },
    },
    socialLinks: {
      instagram: { type: String, default: "", trim: true },
      facebook: { type: String, default: "", trim: true },
      youtube: { type: String, default: "", trim: true },
      twitter: { type: String, default: "", trim: true },
    },
    footer: {
      copyrightText: {
        type: String,
        default: "© 2026 VivahVaani. Partner by Kodetri Technologies.",
        trim: true,
      },
      tagline: {
        type: String,
        default: "“Kalyanam, Mangalyam, Shubham.” Reimagining Indian wedding invitations into timeless, interactive digital patrika experiences.",
        trim: true,
      },
    },
    announcementBar: {
      enabled: { type: Boolean, default: true },
      text: {
        type: String,
        default: "✦ शुभ विवाह • Royal Digital Wedding Patrika & Guest Management ✦",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
