import { useEffect, useRef } from 'react';

/**
 * AdBanner Component
 * Handles dynamic loading of ad scripts for container-based or config-based ads.
 * 
 * @param {Object} props
 * @param {string} props.id - The container ID (e.g., 'container-...')
 * @param {string} props.scriptUrl - The URL of the invoke.js script
 * @param {Object} props.atOptions - Optional configuration for atOptions ads
 * @param {string} props.className - Optional CSS class for styling
 */
const AdBanner = ({ id, scriptUrl, atOptions, className = '' }) => {
    const bannerRef = useRef(null);

    useEffect(() => {
        if (!bannerRef.current) return;

        // For ads that use atOptions
        if (atOptions) {
            window.atOptions = atOptions;
        }

        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;

        // Some ad networks require data-cfasync="false"
        script.setAttribute('data-cfasync', 'false');

        // Append script to the bannerRef element
        bannerRef.current.appendChild(script);

        return () => {
            // Cleanup: remove the script if necessary, though these scripts often 
            // inject iframes that might stay.
            if (bannerRef.current) {
                bannerRef.current.innerHTML = '';
            }
        };
    }, [scriptUrl, atOptions]);

    return (
        <div className={`ad-banner-container ${className}`} style={{ margin: '16px 0', textAlign: 'center' }}>
            {id && <div id={id} ref={bannerRef}></div>}
            {!id && <div ref={bannerRef}></div>}
        </div>
    );
};

export default AdBanner;
