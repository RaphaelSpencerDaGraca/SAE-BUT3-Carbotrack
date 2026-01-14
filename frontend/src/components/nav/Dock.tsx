// frontend/src/components/nav/Dock.tsx
"use client";

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/language/useTranslation";

function Dock() {
    const { t } = useTranslation();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/dashboard" && location.pathname === "/dashboard") return true;
        return location.pathname.startsWith(path) && path !== "/dashboard";
    };

    const getLinkClass = (active: boolean) =>
        [
            "group flex flex-col items-center justify-center gap-1",
            "min-w-[3.6rem] px-2 py-2",
            "rounded-2xl transition-all duration-200",
            active
                ? "bg-white/[0.06] ring-1 ring-emerald-500/25 text-emerald-200"
                : "text-white/55 hover:text-white/80 hover:bg-white/[0.04]",
        ].join(" ");

    const iconProps = (active: boolean) => ({
        xmlns: "http://www.w3.org/2000/svg",
        width: "22",
        height: "22",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: active ? "2.4" : "2",
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        className: [
            "transition-transform duration-200",
            active ? "-translate-y-0.5" : "group-hover:-translate-y-0.5",
        ].join(" "),
    });

    const labelClass = (active: boolean) =>
        [
            "text-[10px] font-medium leading-none",
            active ? "text-emerald-200" : "text-white/55 group-hover:text-white/70",
        ].join(" ");

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50">
            {/* halo léger au-dessus */}
            <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-emerald-500/10 to-transparent" />

            {/* barre glass */}
            <div className="border-t border-white/10 bg-gray-950/70 backdrop-blur-xl shadow-[0_-10px_30px_-20px_rgba(0,0,0,0.8)]">
                <div className="mx-auto flex max-w-5xl justify-between gap-1 px-2 pb-safe pt-2">

                    {/* DASHBOARD */}
                    <Link to="/dashboard" className={getLinkClass(isActive("/dashboard"))}>
                        <svg {...iconProps(isActive("/dashboard"))}>
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                        <span className={labelClass(isActive("/dashboard"))}>
                            {String(t("nav.dashboard"))}
                        </span>
                    </Link>

                    {/* VEHICLES */}
                    <Link to="/vehicles" className={getLinkClass(isActive("/vehicles"))}>
                        <svg {...iconProps(isActive("/vehicles"))}>
                            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                            <circle cx="7" cy="17" r="2" />
                            <path d="M9 17h6" />
                            <circle cx="17" cy="17" r="2" />
                        </svg>
                        <span className={labelClass(isActive("/vehicles"))}>
                            {String(t("nav.vehicles"))}
                        </span>
                    </Link>

                    {/* TRIPS */}
                    <Link to="/trips" className={getLinkClass(isActive("/trips"))}>
                        <svg {...iconProps(isActive("/trips"))}>
                            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                            <line x1="9" x2="9" y1="3" y2="18" />
                            <line x1="15" x2="15" y1="6" y2="21" />
                        </svg>
                        <span className={labelClass(isActive("/trips"))}>
                            {String(t("nav.trips"))}
                        </span>
                    </Link>

                    {/* LOGEMENTS */}
                    <Link to="/logements" className={getLinkClass(isActive("/logements"))}>
                        <svg {...iconProps(isActive("/logements"))}>
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span className={labelClass(isActive("/logements"))}>
                            {String(t("nav.logement"))}
                        </span>
                    </Link>

                    {/* CARBOBOT */}
                    <Link to="/carbobot" className={getLinkClass(isActive("/carbobot"))}>
                        <svg {...iconProps(isActive("/carbobot"))}>
                            <path d="M12 8V4H8" />
                            <rect width="16" height="12" x="4" y="8" rx="2" />
                            <path d="M2 14h2" />
                            <path d="M20 14h2" />
                            <path d="M15 13v2" />
                            <path d="M9 13v2" />
                        </svg>
                        <span className={labelClass(isActive("/carbobot"))}>
                            {String(t("nav.carbobot"))}
                        </span>
                    </Link>

                    {/* MODE DE VIE */}
                    <Link to="/mode2vie" className={getLinkClass(isActive("/mode2vie"))}>
                        <svg {...iconProps(isActive("/mode2vie"))}>
                            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                        </svg>
                        <span className={labelClass(isActive("/mode2vie"))}>
                            {String(t("nav.lifestyle"))}
                        </span>
                    </Link>

                    {/* PROFILE */}
                    <Link to="/profile" className={getLinkClass(isActive("/profile"))}>
                        <svg {...iconProps(isActive("/profile"))}>
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span className={labelClass(isActive("/profile"))}>
                            {String(t("nav.profile"))}
                        </span>
                    </Link>
                </div>

                {/* ligne shine subtile */}
                <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </nav>
    );
}

export default Dock;
