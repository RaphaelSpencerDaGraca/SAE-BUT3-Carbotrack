//frontend\src\components\nav\Dock.tsx
'use client';

import { NavLink } from "react-router-dom";

const dockItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/vehicles", label: "Véhicules" },
    { to: "/trips", label: "Trajets" },
    {to:"/lifestyle",label: "Mode de vie"},
    { to: "/profile", label: "Profil" },
];

function Dock() {
    return (
        <nav className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2">
            <div className="flex gap-2 rounded-full border border-slate-800/80 bg-slate-900/90 px-3 py-2 shadow-lg shadow-black/40 backdrop-blur-sm">
                {dockItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            [
                                "px-4 py-2 text-xs font-medium rounded-full transition-colors",
                                "focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:ring-offset-2 focus:ring-offset-slate-950",
                                isActive
                                    ? "bg-emerald-500 text-slate-950 shadow"
                                    : "text-slate-300 hover:bg-slate-800/80",
                            ].join(" ")
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default Dock;

/*
// src/components/nav/Dock.tsx

const Dock = () => {
    return (
        <div className="fixed inset-x-0 bottom-0 flex justify-center pb-4">
            <div className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur">
                <button className="text-sm text-slate-100">Dashboard</button>
                <button className="text-sm text-slate-400">Trajets</button>
                <button className="text-sm text-slate-400">Véhicules</button>
                <button className="text-sm text-slate-400">Profil</button>
            </div>
        </div>
    );
};

export default Dock;


 /*
import {
    motion,
    MotionValue,
    useMotionValue,
    useSpring,
    useTransform,
    type SpringOptions,
    AnimatePresence
} from 'motion/react';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

export type DockItemData = {
    icon: React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
    className?: string;
};

export type DockProps = {
    items: DockItemData[];
    className?: string;
    distance?: number;
    panelHeight?: number;
    baseItemSize?: number;
    dockHeight?: number;
    magnification?: number;
    spring?: SpringOptions;
};

type DockItemProps = {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    mouseX: MotionValue<number>;
    spring: SpringOptions;
    distance: number;
    baseItemSize: number;
    magnification: number;
};

function DockItem({
                      children,
                      className = '',
                      onClick,
                      mouseX,
                      spring,
                      distance,
                      magnification,
                      baseItemSize
                  }: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, val => {
        const rect = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: baseItemSize
        };
        return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
            ref={ref}
            style={{
                width: size,
                height: size
            }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`relative inline-flex items-center justify-center rounded-full bg-[#060010] border-neutral-700 border-2 shadow-md ${className}`}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            {Children.map(children, child =>
                React.isValidElement(child)
                    ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
                    : child
            )}
        </motion.div>
    );
}

type DockLabelProps = {
    className?: string;
    children: React.ReactNode;
    isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isHovered) return;
        const unsubscribe = isHovered.on('change', latest => {
            setIsVisible(latest === 1);
        });
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: -10 }}
                    exit={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#060010] px-2 py-0.5 text-xs text-white`}
                    role="tooltip"
                    style={{ x: '-50%' }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

type DockIconProps = {
    className?: string;
    children: React.ReactNode;
    isHovered?: MotionValue<number>;
};

function DockIcon({ children, className = '' }: DockIconProps) {
    return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({
                                 items,
                                 className = '',
                                 spring = { mass: 0.1, stiffness: 150, damping: 12 },
                                 magnification = 70,
                                 distance = 200,
                                 panelHeight = 64,
                                 dockHeight = 256,
                                 baseItemSize = 50
                             }: DockProps) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    const maxHeight = useMemo(() => Math.max(dockHeight, magnification + magnification / 2 + 4), [magnification]);
    const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
    const height = useSpring(heightRow, spring);

    return (
        <motion.div style={{ height, scrollbarWidth: 'none' }} className="mx-2 flex max-w-full items-center">
            <motion.div
                onMouseMove={(event: React.MouseEvent<HTMLDivElement>) => {
                    isHovered.set(1);
                    mouseX.set(event.pageX);
                }}
                onMouseLeave={() => {
                    isHovered.set(0);
                    mouseX.set(Infinity);
                }}
                className={`${className} fixed bottom-2 left-1/2 -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-neutral-700 border-2 pb-2 px-4 z-50`}
                style={{ height: panelHeight }}
                role="toolbar"
                aria-label="Application dock"
            >
                {items.map((item, index) => (
                    <DockItem
                        key={index}
                        onClick={item.onClick}
                        className={item.className}
                        mouseX={mouseX}
                        spring={spring}
                        distance={distance}
                        magnification={magnification}
                        baseItemSize={baseItemSize}
                    >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel>{item.label}</DockLabel>
                    </DockItem>
                ))}
            </motion.div>
        </motion.div>
    );
}
*/