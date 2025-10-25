import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Region } from '../types';
import { REGION_VIEWBOXES } from '../constants';
import { MapPaths } from './MapPaths';

interface WorldMapProps {
    region: Region | 'All Regions';
    onCountryDrop: (countryCode: string) => void;
    isDropTarget: boolean;
    isAnswering: boolean;
    correctCountry: string | null;
    incorrectCountry: string | null;
}

const MIN_ZOOM_WIDTH = 100;
const MAX_ZOOM_WIDTH = 2000;

type ViewBox = { x: number; y: number; width: number; height: number };

const parseViewBox = (viewBoxStr: string): ViewBox => {
    const [x, y, width, height] = viewBoxStr.split(' ').map(Number);
    return { x, y, width, height };
};

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
    </svg>
);

const WorldMap: React.FC<WorldMapProps> = ({ region, onCountryDrop, isDropTarget, isAnswering, correctCountry, incorrectCountry }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [viewBox, setViewBox] = useState<ViewBox>(() => parseViewBox(REGION_VIEWBOXES[region]));
    const [isPanning, setIsPanning] = useState(false);
    const panStartPoint = useRef({ x: 0, y: 0 });
    const animationFrameId = useRef<number | null>(null);
    const timeoutIdRef = useRef<number | null>(null);

    useEffect(() => {
        setViewBox(parseViewBox(REGION_VIEWBOXES[region]));
    }, [region]);

    const getSVGPoint = useCallback((clientX: number, clientY: number): { x: number, y: number } => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const pt = svgRef.current.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const screenCTM = svgRef.current.getScreenCTM();
        if (screenCTM) {
            return pt.matrixTransform(screenCTM.inverse());
        }
        return { x: 0, y: 0 };
    }, []);
    
    const handleManualZoom = useCallback((direction: 'in' | 'out') => {
        if (!svgRef.current) return;
        
        const zoomFactor = 1.5;
        const { x, y, width, height } = viewBox;
        const clientRect = svgRef.current.getBoundingClientRect();
        
        // Center of the current view
        const centerX = clientRect.left + clientRect.width / 2;
        const centerY = clientRect.top + clientRect.height / 2;
        const mousePoint = getSVGPoint(centerX, centerY);

        let newWidth;
        if (direction === 'in') {
            newWidth = width / zoomFactor;
        } else { // 'out'
            newWidth = width * zoomFactor;
        }

        newWidth = Math.max(MIN_ZOOM_WIDTH, Math.min(newWidth, MAX_ZOOM_WIDTH));
        const newHeight = height * (newWidth / width);

        const newX = mousePoint.x - (mousePoint.x - x) * (newWidth / width);
        const newY = mousePoint.y - (mousePoint.y - y) * (newHeight / height);

        setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
    }, [viewBox, getSVGPoint]);

    const animateViewBox = useCallback((startVb: ViewBox, endVb: ViewBox, duration: number, onEnd?: () => void) => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        let startTime: number | null = null;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = 0.5 - 0.5 * Math.cos(Math.PI * progress); // Ease-in-out

            const newX = startVb.x + (endVb.x - startVb.x) * easedProgress;
            const newY = startVb.y + (endVb.y - startVb.y) * easedProgress;
            const newWidth = startVb.width + (endVb.width - startVb.width) * easedProgress;
            const newHeight = startVb.height + (endVb.height - startVb.height) * easedProgress;

            setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });

            if (progress < 1) {
                animationFrameId.current = requestAnimationFrame(step);
            } else {
                animationFrameId.current = null;
                if (onEnd) onEnd();
            }
        };
        animationFrameId.current = requestAnimationFrame(step);
    }, []);

    useEffect(() => {
        const cleanup = () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null;
            }
        };

        if (correctCountry && !incorrectCountry && svgRef.current) {
            const countryEl = svgRef.current.querySelector(`#${correctCountry}`);
            const svgEl = svgRef.current;
            if (!countryEl || !svgEl) return cleanup;

            const countryBBox = (countryEl as SVGGraphicsElement).getBBox();
            const svgRect = svgEl.getBoundingClientRect();
            
            if (countryBBox.width === 0 || countryBBox.height === 0 || svgRect.width === 0 || svgRect.height === 0) return cleanup;

            const svgAspectRatio = svgRect.width / svgRect.height;
            const zoomMargin = 1 / 0.75; 

            let targetWidth: number, targetHeight: number;

            if ((countryBBox.width / countryBBox.height) > svgAspectRatio) {
                targetWidth = countryBBox.width * zoomMargin;
                targetHeight = targetWidth / svgAspectRatio;
            } else {
                targetHeight = countryBBox.height * zoomMargin;
                targetWidth = targetHeight * svgAspectRatio;
            }

            targetWidth = Math.max(MIN_ZOOM_WIDTH, Math.min(targetWidth, MAX_ZOOM_WIDTH));
            targetHeight = targetWidth / svgAspectRatio;

            const countryCenterX = countryBBox.x + countryBBox.width / 2;
            const countryCenterY = countryBBox.y + countryBBox.height / 2;

            const zoomInTargetVb: ViewBox = {
                x: countryCenterX - targetWidth / 2,
                y: countryCenterY - targetHeight / 2,
                width: targetWidth,
                height: targetHeight,
            };

            const regionalVb = parseViewBox(REGION_VIEWBOXES[region]);
            const currentVb = { ...viewBox };

            const zoomInDuration = 800;
            const pauseDuration = 1200;
            const zoomOutDuration = 600;

            animateViewBox(currentVb, zoomInTargetVb, zoomInDuration, () => {
                timeoutIdRef.current = window.setTimeout(() => {
                    animateViewBox(zoomInTargetVb, regionalVb, zoomOutDuration, () => {
                        setViewBox(regionalVb); // Final reset
                    });
                }, pauseDuration);
            });
        }
        
        return cleanup;
    }, [correctCountry, incorrectCountry, region, animateViewBox, viewBox]);

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (isAnswering) return;
        panStartPoint.current = { x: e.clientX, y: e.clientY };
        setIsPanning(true);
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isPanning || !svgRef.current || isAnswering) return;
        e.preventDefault();
        const clientRect = svgRef.current.getBoundingClientRect();
        if (clientRect.width === 0) return;

        const scale = viewBox.width / clientRect.width;
        const dx = (e.clientX - panStartPoint.current.x) * scale;
        const dy = (e.clientY - panStartPoint.current.y) * scale;

        setViewBox(prev => ({
            ...prev,
            x: prev.x - dx,
            y: prev.y - dy,
        }));
        panStartPoint.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUpOrLeave = () => {
        setIsPanning(false);
    };

    const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
        if (isAnswering || !svgRef.current) return;
        e.preventDefault();

        const zoomFactor = 1.1;
        const { x, y, width, height } = viewBox;
        const mousePoint = getSVGPoint(e.clientX, e.clientY);

        let newWidth;
        if (e.deltaY < 0) { // Zoom in
            newWidth = width / zoomFactor;
        } else { // Zoom out
            newWidth = width * zoomFactor;
        }

        newWidth = Math.max(MIN_ZOOM_WIDTH, Math.min(newWidth, MAX_ZOOM_WIDTH));
        const newHeight = height * (newWidth / width);

        const newX = mousePoint.x - (mousePoint.x - x) * (newWidth / width);
        const newY = mousePoint.y - (mousePoint.y - y) * (newHeight / height);

        setViewBox({ x: newX, y: newY, width: newWidth, height: newHeight });
    };

    const handleDragOver = (e: React.DragEvent<SVGSVGElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<SVGSVGElement>) => {
        e.preventDefault();
        if (isAnswering) return;

        const target = e.target as SVGPathElement;
        if (target && target.tagName === 'path' && target.id && target.id.length === 2) {
            onCountryDrop(target.id);
        }
    };

    const containerClasses = `relative w-full h-full p-2 bg-slate-200/50 dark:bg-gray-800/50 rounded-2xl transition-all duration-300 overflow-hidden ${isDropTarget ? 'scale-105 shadow-2xl ring-4 ring-accent' : 'shadow-lg'}`;

    return (
        <div className={containerClasses}>
            <svg
                version="1.1"
                id="world-map"
                xmlns="http://www.w3.org/2000/svg"
                ref={svgRef}
                viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
                className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'} ${isAnswering ? 'pointer-events-none' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onWheel={handleWheel}
            >
                <style>
                    {`
                        .country {
                            stroke: #6b7280; /* gray-500 */
                            stroke-width: 0.5;
                            fill: #f3f4f6; /* gray-100 */
                            transition: fill 0.3s ease;
                        }
                        .dark .country {
                            stroke: #d1d5db; /* gray-300 */
                            fill: #4b5563; /* gray-600 */
                        }
                        .country:hover {
                            fill: ${isAnswering ? 'currentColor' : 'rgb(var(--color-secondary))'};
                        }
                        .correct {
                            fill: #22c55e !important; /* green-500 */
                        }
                        .incorrect {
                            fill: #ef4444 !important; /* red-500 */
                        }
                    `}
                </style>
                <MapPaths correctCountry={correctCountry} incorrectCountry={incorrectCountry} />
            </svg>
            
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={() => handleManualZoom('in')}
                    disabled={isAnswering}
                    className="w-12 h-12 rounded-full bg-slate-200/50 dark:bg-gray-700/50 text-slate-800 dark:text-gray-200 flex items-center justify-center shadow-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Zoom in"
                >
                    <PlusIcon />
                </button>
                <button
                    onClick={() => handleManualZoom('out')}
                    disabled={isAnswering}
                    className="w-12 h-12 rounded-full bg-slate-200/50 dark:bg-gray-700/50 text-slate-800 dark:text-gray-200 flex items-center justify-center shadow-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Zoom out"
                >
                    <MinusIcon />
                </button>
            </div>
        </div>
    );
};

export default WorldMap;