// frontend/src/components/nav/Dock.tsx
"use client";

import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/language/useTranslation";

function Dock() {
    const { t } = useTranslation();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        return location.pathname.startsWith(path) && path !== '/dashboard';
    };
    const getLinkClass = (active: boolean) =>
        `flex flex-col items-center justify-center gap-1 rounded-lg min-w-[3.5rem] py-2 transition-all duration-200 ${
            active 
            ? "text-emerald-400" 
            : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
        }`;

    const iconProps = (active: boolean) => ({
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: active ? "2.5" : "2",
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        className: `transition-transform duration-200 ${active ? '-translate-y-0.5' : ''}`
    });

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 w-full border-t border-slate-800 bg-slate-950 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
            <div className="mx-auto flex max-w-lg justify-between px-2 pb-safe pt-2">

                {/* 1. DASHBOARD */}
                <Link to="/dashboard" className={getLinkClass(isActive('/dashboard'))}>
                    <svg {...iconProps(isActive('/dashboard'))}>
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                    <span className="text-[10px] font-medium leading-none mt-1">
                        {String(t('nav.dashboard'))}
                    </span>
                </Link>

                {/* 2. VÉHICULES */}
                <Link to="/vehicles" className={getLinkClass(isActive('/vehicles'))}>
                    <svg {...iconProps(isActive('/vehicles'))}>
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                    </svg>
                    <span className="text-[10px] font-medium leading-none mt-1">
                        {String(t('nav.vehicles'))}
                    </span>
                </Link>

                {/* 3. TRAJETS */}
                <Link to="/trips" className={getLinkClass(isActive('/trips'))}>
                    <svg {...iconProps(isActive('/trips'))}>
                        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                        <line x1="9" x2="9" y1="3" y2="18" />
                        <line x1="15" x2="15" y1="6" y2="21" />
                    </svg>
                    <span className="text-[10px] font-medium leading-none mt-1">
                        {String(t('nav.trips'))}
                    </span>
                </Link>

                {/* 4. LOGEMENT */}
                <Link to="/logements" className={getLinkClass(isActive('/logements'))}>
                    <svg {...iconProps(isActive('/logements'))}>
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span className="text-[10px] font-medium leading-none mt-1">
                        {String(t('nav.logement'))}
                    </span>
                </Link>

                {/* 5. CARBOBOT */}
                <Link to="/carbobot" className={getLinkClass(isActive('/carbobot'))}>
                    <svg {...iconProps(isActive('/carbobot'))}>
                        <path d="M12 8V4H8" />
                        <rect width="16" height="12" x="4" y="8" rx="2" />
                        <path d="M2 14h2" />
                        <path d="M20 14h2" />
                        <path d="M15 13v2" />
                        <path d="M9 13v2" />
                    </svg>
                    <span className="text-[10px] font-medium leading-none mt-1">
                        {String(t('nav.carbobot'))}
                    </span>
                </Link>

                {/* 6. MODE DE VIE */}
                <Link to="/mode2vie" className={getLinkClass(isActive('/mode2vie'))}>
                    <svg {...iconProps(isActive('/mode2vie'))}>
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                    </svg>
                    <span className="text-[10px] font-medium leading-none mt-1">
                        {String(t('nav.lifestyle'))}
                    </span>
                </Link>

                {/* 7. PROFIL */}
                <Link to="/profile" className={getLinkClass(isActive('/profile'))}>
                    <svg {...iconProps(isActive('/profile'))}>
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[10px] font-medium leading-none mt-1">
                        {String(t('nav.profile'))}
                    </span>
                </Link>

            </div>
        </nav>
    );
}

export default Dock;