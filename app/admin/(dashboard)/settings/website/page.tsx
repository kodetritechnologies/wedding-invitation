"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Save,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface SiteSettingsState {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  logoText: string;
  faviconUrl: string;
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
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  footer: {
    copyrightText: string;
    tagline: string;
  };
  announcementBar: {
    enabled: boolean;
    text: string;
  };
}

export default function WebsiteSettingsPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettingsState>({
    siteName: "VivahVaani",
    siteTagline: "Har Shaadi Ki Shuruaat, Ek Khoobsurat Nimantran",
    logoUrl: "/logo.png",
    logoText: "VivahVaani",
    faviconUrl: "/favicon.ico",
    address: {
      formattedAddress: "Vijay Nagar, Indore, Madhya Pradesh • 452010",
      city: "Indore",
      state: "Madhya Pradesh",
      pincode: "452010",
      country: "India",
    },
    contact: {
      email: "namaste@vivahvaani.com",
      phone: "+91 98260 12345",
      whatsapp: "919826012345",
      workingHours: "10 AM - 7 PM IST",
    },
    socialLinks: {
      instagram: "",
      facebook: "",
      youtube: "",
      twitter: "",
    },
    footer: {
      copyrightText: "© 2026 VivahVaani. All rights reserved.",
      tagline: "हर शादी की शुरुआत, एक खूबसूरत निमंत्रण",
    },
    announcementBar: {
      enabled: true,
      text: "✦ विवाहवाणी • हर शादी की शुरुआत, एक खूबसूरत निमंत्रण ✦",
    },
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("shaadi_super_admin_token")
            : null;

        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch("/api/super-admin/settings", {
          headers,
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            setSiteSettings((prev) => ({
              ...prev,
              ...data.settings,
              address: {
                ...prev.address,
                ...(data.settings.address || {}),
              },
              contact: {
                ...prev.contact,
                ...(data.settings.contact || {}),
              },
              socialLinks: {
                ...prev.socialLinks,
                ...(data.settings.socialLinks || {}),
              },
              footer: {
                ...prev.footer,
                ...(data.settings.footer || {}),
              },
              announcementBar: {
                ...prev.announcementBar,
                ...(data.settings.announcementBar || {}),
              },
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    setSettingsError("");

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("shaadi_super_admin_token")
          : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/super-admin/settings", {
        method: "PUT",
        headers,
        credentials: "include",
        body: JSON.stringify(siteSettings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save website settings");
      }

      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setSettingsError(msg);
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white">Website Settings</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure website name, logo, address, contact numbers, and footer notes. Updates Header and Footer dynamically.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition cursor-pointer w-fit"
        >
          <span>Open Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {settingsSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Website settings saved successfully! Header and Footer updated.</span>
        </div>
      )}

      {settingsError && (
        <div className="p-3 rounded-lg bg-red-950 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{settingsError}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Name & Logo */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Website Name &amp; Logo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Website Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={siteSettings.siteName}
                onChange={(e) =>
                  setSiteSettings({ ...siteSettings, siteName: e.target.value })
                }
                placeholder="VivahVaani"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={siteSettings.siteTagline}
                onChange={(e) =>
                  setSiteSettings({ ...siteSettings, siteTagline: e.target.value })
                }
                placeholder="Har Shaadi Ki Shuruaat, Ek Khoobsurat Nimantran"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-zinc-300 mb-1">
                Logo Image URL
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={siteSettings.logoUrl}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, logoUrl: e.target.value })
                  }
                  placeholder="https://example.com/logo.png (Leave blank to use default text logo)"
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
                {siteSettings.logoUrl && (
                  <div className="h-9 px-2 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={siteSettings.logoUrl}
                      alt="Logo"
                      className="h-6 w-auto object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Address */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Website Address (Dynamic in Footer &amp; Contact)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-medium text-zinc-300 mb-1">
                Full Formatted Address (Footer) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={siteSettings.address.formattedAddress}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    address: { ...siteSettings.address, formattedAddress: e.target.value },
                  })
                }
                placeholder="Vijay Nagar, Indore, Madhya Pradesh • 452010"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">City</label>
              <input
                type="text"
                value={siteSettings.address.city}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    address: { ...siteSettings.address, city: e.target.value },
                  })
                }
                placeholder="Indore"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">State</label>
              <input
                type="text"
                value={siteSettings.address.state}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    address: { ...siteSettings.address, state: e.target.value },
                  })
                }
                placeholder="Madhya Pradesh"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Pincode</label>
              <input
                type="text"
                value={siteSettings.address.pincode}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    address: { ...siteSettings.address, pincode: e.target.value },
                  })
                }
                placeholder="452010"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">Country</label>
              <input
                type="text"
                value={siteSettings.address.country}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    address: { ...siteSettings.address, country: e.target.value },
                  })
                }
                placeholder="India"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Contact & Helplines */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Contact &amp; Helplines
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Support Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={siteSettings.contact.email}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, email: e.target.value },
                    })
                  }
                  placeholder="namaste@vivahvaani.kodetri.com"
                  className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Helpline Phone <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={siteSettings.contact.phone}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, phone: e.target.value },
                    })
                  }
                  placeholder="+91 98260 12345"
                  className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                WhatsApp Number (digits only)
              </label>
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/whatsapp.png"
                  alt="WhatsApp"
                  className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 object-contain"
                />
                <input
                  type="text"
                  value={siteSettings.contact.whatsapp}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      contact: { ...siteSettings.contact, whatsapp: e.target.value },
                    })
                  }
                  placeholder="919826012345"
                  className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Working Hours
              </label>
              <input
                type="text"
                value={siteSettings.contact.workingHours}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    contact: { ...siteSettings.contact, workingHours: e.target.value },
                  })
                }
                placeholder="10 AM - 7 PM IST"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Top Banner & Footer text */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Announcement Banner &amp; Footer Text
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-medium text-zinc-300">
                  Top Auspicious Strip Text
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={siteSettings.announcementBar.enabled}
                    onChange={(e) =>
                      setSiteSettings({
                        ...siteSettings,
                        announcementBar: {
                          ...siteSettings.announcementBar,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="rounded bg-zinc-950 border-zinc-700 text-amber-500"
                  />
                  <span>Enabled</span>
                </label>
              </div>
              <input
                type="text"
                value={siteSettings.announcementBar.text}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    announcementBar: {
                      ...siteSettings.announcementBar,
                      text: e.target.value,
                    },
                  })
                }
                placeholder="✦ शुभ विवाह • Royal Digital Wedding Patrika & Guest Management ✦"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Footer Motto / Shloka
              </label>
              <input
                type="text"
                value={siteSettings.footer.tagline}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    footer: { ...siteSettings.footer, tagline: e.target.value },
                  })
                }
                placeholder="“Kalyanam, Mangalyam, Shubham.” Reimagining Indian wedding invitations..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-300 mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={siteSettings.footer.copyrightText}
                onChange={(e) =>
                  setSiteSettings({
                    ...siteSettings,
                    footer: { ...siteSettings.footer, copyrightText: e.target.value },
                  })
                }
                placeholder="© 2026 VivahVaani. All rights reserved."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 rounded-lg font-bold text-xs text-zinc-950 uppercase tracking-wider bg-amber-500 hover:bg-amber-400 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {savingSettings ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : settingsSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Website Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
