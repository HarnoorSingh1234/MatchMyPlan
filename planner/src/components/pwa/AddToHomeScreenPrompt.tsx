"use client";
import React, { useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';
import { X, MoreVertical, Plus, Share } from 'lucide-react';

const COOKIE_NAME = 'addToHomeScreenPrompt';
const PROMPT_DELAY = 50; // 5 seconds delay before showing prompt

// Define the type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export default function AddToHomeScreenPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isMacOS, setIsMacOS] = useState(false);
    const [browserType, setBrowserType] = useState<string>('');
    
    // Handle the native Chrome install prompt
    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // If no deferredPrompt is available, show manual instructions
            setShowInstructions(true);
            return;
        }
        
        try {
            // Show the native install prompt
            await deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            
            console.log(`User ${outcome} the install prompt`);
        } catch (error) {
            console.error('Error showing install prompt:', error);
            // Fallback to manual instructions if prompt fails
            setShowInstructions(true);
        } finally {
            // Clear the deferred prompt
            setDeferredPrompt(null);
            setShowInstallButton(false);
        }
    };
    
    const closePrompt = () => {
        setShowInstructions(false);
    };

    const doNotShowAgain = () => {
        // Create date 1 year from now
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        setCookie(COOKIE_NAME, 'dontShow', { expires: date }); // Set cookie for a year
        setShowInstructions(false);
        setShowInstallButton(false);
    };

    // This function runs when we detect it's time to show manual instructions for iOS
    const showIOSInstructions = () => {
        // Don't show if user has opted out
        const addToHomeScreenPromptCookie = getCookie(COOKIE_NAME);
        if (addToHomeScreenPromptCookie === 'dontShow') return;
        
        setShowInstructions(true);
    };

    // This function runs when we detect it's time to show manual instructions for macOS Safari
    const showMacOSSafariInstructions = () => {
        // Don't show if user has opted out
        const addToHomeScreenPromptCookie = getCookie(COOKIE_NAME);
        if (addToHomeScreenPromptCookie === 'dontShow') return;
        
        setShowInstructions(true);
    };

    useEffect(() => {
        // Check if it's running in browser environment
        if (typeof window === 'undefined') return;
        
        // Check if app is already installed as PWA
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isIOSStandalone = 
            (window.navigator as any).standalone === true || 
            (window.navigator as any).standalone === 'true';
            
        setIsInstalled(isStandalone || isIOSStandalone);
        
        // Detect device and browser
        const ua = window.navigator.userAgent;
        const isIOSDevice = /iPhone|iPad|iPod/i.test(ua);
        const isMacOSDevice = /Macintosh/.test(ua) && !/Windows/.test(ua) && !isIOSDevice;
        const isAndroid = /Android/i.test(ua);
        const isMobileDevice = isIOSDevice || isAndroid;
        
        setIsMobile(isMobileDevice);
        setIsIOS(isIOSDevice);
        setIsMacOS(isMacOSDevice);
        
        // Detect browser type for specific instructions
        if (ua.includes('CriOS')) {
            setBrowserType('chrome-ios');
        } else if (ua.includes('FxiOS')) {
            setBrowserType('firefox-ios');
        } else if (ua.includes('Safari') && isIOSDevice) {
            setBrowserType('safari-ios');
        } else if (ua.includes('Safari') && isMacOSDevice && !ua.includes('Chrome')) {
            // Safari on macOS (and not Chrome which also includes Safari in UA)
            setBrowserType('safari-macos');
        } else if (ua.includes('Chrome') && isAndroid) {
            setBrowserType('chrome-android');
        } else if (ua.includes('Firefox') && isAndroid) {
            setBrowserType('firefox-android');
        } else if (ua.includes('SamsungBrowser')) {
            setBrowserType('samsung');
        } else {
            setBrowserType('other');
        }
        
        // Don't continue if already installed
        if (isStandalone || isIOSStandalone) return;
        
        // Check if user doesn't want to see the prompt
        const addToHomeScreenPromptCookie = getCookie(COOKIE_NAME);
        if (addToHomeScreenPromptCookie === 'dontShow') return;
        
        // For iOS Safari, show instructions after a delay
        if (isIOSDevice && browserType === 'safari-ios') {
            setTimeout(() => {
                showIOSInstructions();
            }, PROMPT_DELAY * 2); // Longer delay for iOS
            return;
        }
        
        // For macOS Safari, show different instructions after a delay
        if (isMacOSDevice && browserType === 'safari-macos') {
            setTimeout(() => {
                showMacOSSafariInstructions();
            }, PROMPT_DELAY * 2);
            return;
        }
        
        let promptTimer: NodeJS.Timeout | null = null;

        // Listen for the beforeinstallprompt event (Chrome/Edge/Android)
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67+ from automatically showing the prompt
            e.preventDefault();
            
            // Store the event for later use
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            
            // Show install button after a delay
            promptTimer = setTimeout(() => {
                setShowInstallButton(true);
            }, PROMPT_DELAY);
            
            console.log('beforeinstallprompt event captured');
        };

        // Listen for successful installation
        const handleAppInstalled = () => {
            console.log('PWA was successfully installed');
            setIsInstalled(true);
            setShowInstallButton(false);
            setShowInstructions(false);
        };

        // Add event listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Clean up
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            if (promptTimer) clearTimeout(promptTimer);
        };
    }, [browserType]);

    // If app is already installed, don't show anything
    if (isInstalled) return null;

    // Installation instructions based on browser/platform
    const renderInstructions = () => {
        if (browserType === 'safari-ios') {
            return (
                <div className="relative bg-blue-600 p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
                    <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
                        <X className="text-2xl" />
                    </button>
                    <p className="text-lg">For the best experience, install MatchMyPlan to your home screen!</p>
                    <div className="flex gap-2 items-center text-lg">
                        <p>Tap the</p>
                        <Share className="text-4xl" />
                        <p>share button</p>
                    </div>
                    <div className="flex flex-col gap-2 items-center text-lg w-full px-4">
                        <p>Then scroll down and tap:</p>
                        <div className="bg-zinc-50 flex justify-between items-center w-full px-4 py-2 rounded-lg text-zinc-900">
                            <Plus className="text-2xl" />
                            <p>Add to Home Screen</p>
                        </div>
                    </div>
                    <button className="border-2 p-1" onClick={doNotShowAgain}>Don&apos;t show again</button>
                </div>
            );
        }
        
        if (browserType === 'safari-macos') {
            return (
                <div className="relative bg-blue-600 p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
                    <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
                        <X className="text-2xl" />
                    </button>
                    <p className="text-lg">For the best experience, install MatchMyPlan to your dock!</p>
                    <div className="flex flex-col gap-2 items-center text-lg">
                        <p>From the Safari menu, select:</p>
                        <div className="bg-zinc-50 flex justify-center items-center w-full px-4 py-2 rounded-lg text-zinc-900">
                            <p>File → Add to Dock...</p>
                        </div>
                    </div>
                    <p className="text-md">Or use the keyboard shortcut:</p>
                    <div className="bg-zinc-50 px-4 py-2 rounded-lg text-zinc-900">
                        <p className="font-mono">⇧⌘D (Shift+Command+D)</p>
                    </div>
                    <p className="text-md">Then click 'Add' in the dialog that appears</p>
                    <button className="border-2 p-1" onClick={doNotShowAgain}>Don&apos;t show again</button>
                </div>
            );
        }
        
        if (browserType === 'chrome-ios' || browserType === 'firefox-ios') {
            return (
                <div className="relative bg-blue-600 p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
                    <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
                        <X className="text-2xl" />
                    </button>
                    <p className="text-lg">For the best experience, open this website in Safari first!</p>
                    <p className="text-lg">Safari is required to install web apps on iOS devices.</p>
                    <div className="flex flex-col gap-2 items-center text-lg w-full px-4">
                        <p>Copy this URL and open it in Safari:</p>
                        <div className="bg-zinc-50 p-2 rounded-lg text-zinc-900 w-full break-all">
                            {typeof window !== 'undefined' ? window.location.href : ''}
                        </div>
                    </div>
                    <button className="border-2 p-1" onClick={doNotShowAgain}>Don&apos;t show again</button>
                </div>
            );
        }
        
        // Default instructions for Android/other browsers
        return (
            <div className="relative bg-blue-600 p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
                <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
                    <X className="text-2xl" />
                </button>
                <p className="text-lg">For the best experience, we recommend installing MatchMyPlan to your home screen!</p>
                <div className="flex gap-2 items-center text-lg">
                    <p>Click the</p>
                    <MoreVertical className="text-4xl" />
                    <p>menu button</p>
                </div>
                <div className="flex flex-col gap-2 items-center text-lg w-full px-4">
                    <p>Then select:</p>
                    <div className="bg-zinc-50 flex justify-between items-center w-full px-4 py-2 rounded-lg text-zinc-900">
                        <Plus className="text-2xl" />
                        <p>Add to Home Screen</p>
                    </div>
                </div>
                <button className="border-2 p-1" onClick={doNotShowAgain}>Don&apos;t show again</button>
            </div>
        );
    };

    return (
        <>
            {/* Install button (appears when beforeinstallprompt fires on Android) */}
            {showInstallButton && (
                <div className="fixed bottom-4 right-4 z-50">
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                        <div>
                            <p className="font-semibold">Install MatchMyPlan</p>
                            <p className="text-sm opacity-90">Add to your home screen for quick access</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition-colors"
                            >
                                Install
                            </button>
                            <button
                                onClick={doNotShowAgain}
                                className="text-white/80 hover:text-white px-2"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Manual instructions */}
            {showInstructions && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-50" onClick={closePrompt}>
                    <div className="fixed top-0 left-0 right-0 h-[60%] z-50 pt-12 px-4 text-white" onClick={e => e.stopPropagation()}>
                        {renderInstructions()}
                    </div>
                </div>
            )}
        </>
    );
}