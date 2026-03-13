/**
 * Performance Monitoring Utilities
 * Tracks Core Web Vitals and other performance metrics
 */

export interface PerformanceMetrics {
  cls: number;
  fid: number;
  lcp: number;
  ttfb: number;
  fcp: number;
}

/**
 * Measure Core Web Vitals
 */
export function measureCoreWebVitals(): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    const metrics: PerformanceMetrics = {
      cls: 0,
      fid: 0,
      lcp: 0,
      ttfb: 0,
      fcp: 0,
    };

    // Measure LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.startTime;
        lcpObserver.disconnect();
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        metrics.fcp = firstEntry.startTime;
        fcpObserver.disconnect();
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Measure FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.fid += entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Measure CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Measure TTFB (Time to First Byte)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      }

      // Resolve after a short delay to collect all metrics
      setTimeout(() => {
        resolve(metrics);
      }, 3000);
    } else {
      resolve(metrics);
    }
  });
}

/**
 * Log performance metrics to console
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics) {
  console.group('📊 Performance Metrics');
  console.log(`LCP: ${metrics.lcp.toFixed(0)}ms`, getPerformanceRating(metrics.lcp, 'lcp'));
  console.log(`FID: ${metrics.fid.toFixed(0)}ms`, getPerformanceRating(metrics.fid, 'fid'));
  console.log(`CLS: ${metrics.cls.toFixed(3)}`, getPerformanceRating(metrics.cls, 'cls'));
  console.log(`FCP: ${metrics.fcp.toFixed(0)}ms`, getPerformanceRating(metrics.fcp, 'fcp'));
  console.log(`TTFB: ${metrics.ttfb.toFixed(0)}ms`, getPerformanceRating(metrics.ttfb, 'ttfb'));
  console.groupEnd();
}

/**
 * Get performance rating based on Google's thresholds
 */
function getPerformanceRating(value: number, metric: string): string {
  const thresholds = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
    fcp: { good: 1800, poor: 3000 },
    ttfb: { good: 800, poor: 1800 },
  };

  const threshold = thresholds[metric as keyof typeof thresholds];
  if (!threshold) return '';

  if (value <= threshold.good) return '✅ Good';
  if (value <= threshold.poor) return '⚠️ Needs Improvement';
  return '❌ Poor';
}

/**
 * Track image loading performance
 */
export function trackImageLoading() {
  if ('PerformanceObserver' in window) {
    const imageObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'resource' && entry.name.includes('image')) {
          console.log(`🖼️ Image loaded: ${entry.name} in ${entry.duration.toFixed(0)}ms`);
        }
      });
    });
    imageObserver.observe({ entryTypes: ['resource'] });
  }
}

/**
 * Monitor bundle size and loading
 */
export function monitorBundleLoading() {
  if ('PerformanceObserver' in window) {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const jsEntries = entries.filter(entry => entry.name.includes('.js'));
      const cssEntries = entries.filter(entry => entry.name.includes('.css'));
      
      console.group('📦 Bundle Loading');
      console.log(`JS files: ${jsEntries.length}, Total size: ${jsEntries.reduce((acc, entry) => acc + (entry as any).transferSize, 0)} bytes`);
      console.log(`CSS files: ${cssEntries.length}, Total size: ${cssEntries.reduce((acc, entry) => acc + (entry as any).transferSize, 0)} bytes`);
      console.groupEnd();
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
  }
}

/**
 * Initialize all performance monitoring
 */
export function initPerformanceMonitoring() {
  // Track image loading
  trackImageLoading();
  
  // Monitor bundle loading
  monitorBundleLoading();
  
  // Measure Core Web Vitals after page load
  if (document.readyState === 'complete') {
    measureCoreWebVitals().then(logPerformanceMetrics);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        measureCoreWebVitals().then(logPerformanceMetrics);
      }, 1000);
    });
  }
}