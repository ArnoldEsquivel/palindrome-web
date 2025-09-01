"use client";

import { useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

/**
 * Configuration for different confetti effects
 */
interface ConfettiConfig {
  /** Number of confetti particles */
  particleCount: number;
  /** Spread angle in degrees */
  spread: number;
  /** Origin point for confetti */
  origin: { x: number; y: number };
  /** Colors for confetti particles */
  colors: string[];
  /** Particle shapes */
  shapes?: confetti.Shape[];
  /** Size scalar for particles */
  scalar?: number;
  /** Drift amount for particles */
  drift?: number;
  /** Gravity effect */
  gravity?: number;
  /** Decay rate */
  decay?: number;
  /** Start velocity */
  startVelocity?: number;
}

/**
 * Predefined confetti configurations using Acueducto corporate colors
 */
const CONFETTI_CONFIGS = {
  palindrome: {
    particleCount: 150,
    spread: 60,
    origin: { x: 0.5, y: 0.4 },
    colors: [
      '#1A4CE0', // Acueducto Primary Blue
      '#F4F4F4', // Acueducto Light
      '#FFD700', // Gold for special offers
      '#00FF7F', // Spring green for success
      '#FF6B6B', // Coral for excitement
      '#4ECDC4'  // Turquoise for freshness
    ],
    shapes: ['circle', 'square'] as confetti.Shape[],
    scalar: 0.8,
    drift: 0.1,
    gravity: 0.6,
    decay: 0.94,
    startVelocity: 30
  } as ConfettiConfig,

  celebration: {
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.6 },
    colors: [
      '#1A4CE0', // Acueducto Primary
      '#1B5AE4', // Acueducto Accent
      '#FFD700', // Gold
      '#FF69B4'  // Hot pink
    ],
    shapes: ['circle'] as confetti.Shape[],
    scalar: 1.0,
    startVelocity: 25
  } as ConfettiConfig,

  subtle: {
    particleCount: 50,
    spread: 45,
    origin: { x: 0.5, y: 0.3 },
    colors: [
      '#1A4CE0', // Acueducto Primary
      '#F4F4F4'  // Acueducto Light
    ],
    scalar: 0.6,
    startVelocity: 20
  } as ConfettiConfig
};

/**
 * Return type for useConfetti hook
 */
export interface UseConfettiReturn {
  /** Trigger palindrome discovery confetti */
  triggerPalindromeConfetti: () => void;
  /** Trigger celebration confetti */
  triggerCelebrationConfetti: () => void;
  /** Trigger subtle confetti */
  triggerSubtleConfetti: () => void;
  /** Trigger custom confetti with specific config */
  triggerCustomConfetti: (config: Partial<ConfettiConfig>) => void;
  /** Clear all confetti from canvas */
  clearConfetti: () => void;
  /** Check if user prefers reduced motion */
  prefersReducedMotion: boolean;
}

/**
 * Custom hook for confetti effects with accessibility and performance considerations
 * 
 * Features:
 * - Predefined corporate-themed confetti configurations
 * - Respect for user's motion preferences (prefers-reduced-motion)
 * - Performance optimization with request deduplication
 * - Accessible confetti that doesn't interfere with screen readers
 * - Corporate color scheme integration
 * 
 * @example
 * ```tsx
 * function SearchResults({ isPalindrome }) {
 *   const { triggerPalindromeConfetti, prefersReducedMotion } = useConfetti();
 * 
 *   useEffect(() => {
 *     if (isPalindrome && !prefersReducedMotion) {
 *       triggerPalindromeConfetti();
 *     }
 *   }, [isPalindrome, triggerPalindromeConfetti, prefersReducedMotion]);
 * 
 *   return <div>Search results...</div>;
 * }
 * ```
 */
export function useConfetti(): UseConfettiReturn {
  
  // Ref to track if confetti is currently running to prevent spam
  const isRunningRef = useRef(false);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /**
   * Generic confetti trigger with configuration
   */
  const triggerConfetti = useCallback((config: ConfettiConfig) => {
    // Respect user's motion preferences
    if (prefersReducedMotion) {
      console.log('🎊 [useConfetti] Confetti skipped due to prefers-reduced-motion');
      return;
    }

    // Prevent multiple confetti from running simultaneously
    if (isRunningRef.current) {
      console.log('🎊 [useConfetti] Confetti already running, skipping');
      return;
    }

    isRunningRef.current = true;
    console.log('🎊 [useConfetti] Triggering confetti with config:', config);

    try {
      confetti({
        particleCount: config.particleCount,
        spread: config.spread,
        origin: config.origin,
        colors: config.colors,
        shapes: config.shapes,
        scalar: config.scalar,
        drift: config.drift,
        gravity: config.gravity,
        decay: config.decay,
        startVelocity: config.startVelocity,
        // Add accessibility considerations
        disableForReducedMotion: true
      });

      // Reset running flag after a short delay
      setTimeout(() => {
        isRunningRef.current = false;
      }, 1000);

    } catch (error) {
      console.error('🎊 [useConfetti] Error triggering confetti:', error);
      isRunningRef.current = false;
    }
  }, [prefersReducedMotion]);

  /**
   * Trigger palindrome discovery confetti
   * Special effect for when a palindrome is detected
   */
  const triggerPalindromeConfetti = useCallback(() => {
    console.log('🎊 [useConfetti] Palindrome confetti requested');
    triggerConfetti(CONFETTI_CONFIGS.palindrome);
  }, [triggerConfetti]);

  /**
   * Trigger celebration confetti
   * General celebration effect
   */
  const triggerCelebrationConfetti = useCallback(() => {
    console.log('🎊 [useConfetti] Celebration confetti requested');
    triggerConfetti(CONFETTI_CONFIGS.celebration);
  }, [triggerConfetti]);

  /**
   * Trigger subtle confetti
   * Minimal effect for subtle celebrations
   */
  const triggerSubtleConfetti = useCallback(() => {
    console.log('🎊 [useConfetti] Subtle confetti requested');
    triggerConfetti(CONFETTI_CONFIGS.subtle);
  }, [triggerConfetti]);

  /**
   * Trigger custom confetti with user-provided configuration
   */
  const triggerCustomConfetti = useCallback((customConfig: Partial<ConfettiConfig>) => {
    console.log('🎊 [useConfetti] Custom confetti requested:', customConfig);
    
    const mergedConfig: ConfettiConfig = {
      ...CONFETTI_CONFIGS.palindrome,
      ...customConfig
    };
    
    triggerConfetti(mergedConfig);
  }, [triggerConfetti]);

  /**
   * Clear all confetti from the canvas
   */
  const clearConfetti = useCallback(() => {
    console.log('🎊 [useConfetti] Clearing all confetti');
    try {
      confetti.reset();
      isRunningRef.current = false;
    } catch (error) {
      console.error('🎊 [useConfetti] Error clearing confetti:', error);
    }
  }, []);

  return {
    triggerPalindromeConfetti,
    triggerCelebrationConfetti,
    triggerSubtleConfetti,
    triggerCustomConfetti,
    clearConfetti,
    prefersReducedMotion
  };
}

/**
 * Simple confetti trigger function for one-off use
 * @param type - Type of confetti effect
 */
export function fireConfetti(type: keyof typeof CONFETTI_CONFIGS = 'palindrome') {
  // Check for reduced motion preference
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const config = CONFETTI_CONFIGS[type];
  
  try {
    confetti({
      particleCount: config.particleCount,
      spread: config.spread,
      origin: config.origin,
      colors: config.colors,
      shapes: config.shapes,
      scalar: config.scalar,
      drift: config.drift,
      gravity: config.gravity,
      decay: config.decay,
      startVelocity: config.startVelocity,
      disableForReducedMotion: true
    });
  } catch (error) {
    console.error('🎊 [fireConfetti] Error:', error);
  }
}
