/**
 * useGoogleAuth — Real Google Identity Services (GIS) sign-in hook.
 *
 * Flow:
 *  1. On mount, initialize GIS with VITE_GOOGLE_CLIENT_ID and render
 *     Google's official button into a hidden off-screen div.
 *  2. When `signIn()` is called (by our custom button), we programmatically
 *     click that hidden official button, which triggers Google's real
 *     account-picker popup — no fake form, no typed email.
 *  3. When the user selects an account, Google calls our `callback` with a
 *     cryptographically-signed ID token.
 *  4. We POST that token to /api/auth/google. The backend verifies it
 *     against oauth2.googleapis.com/tokeninfo, checks the audience,
 *     then finds-or-creates the user and returns our app JWT.
 */
import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../features/auth";
import { toast } from "react-toastify";
import { API_BASE } from "../utils/api";

// ── Type declarations for the GIS SDK loaded via index.html script tag ──
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GISInitConfig) => void;
          renderButton: (parent: HTMLElement, config: GISButtonConfig) => void;
          prompt: (callback?: (n: GISPromptNotification) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GISInitConfig {
  client_id: string;
  callback: (response: { credential: string }) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GISButtonConfig {
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  width?: number;
}

interface GISPromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
}

// ── Hook ────────────────────────────────────────────────────────────────────
export function useGoogleAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // This div is placed off-screen in the DOM. GIS renders its own button
  // inside it; we click that button programmatically when our custom
  // styled button is pressed. This is the only reliable way to trigger
  // the real Google popup with a custom-styled button.
  const hiddenDivRef = useRef<HTMLDivElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  // Called by GIS when the user successfully picks an account
  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Google authentication failed. Please try again.");
          return;
        }
        dispatch(setCredentials({ token: data.token, user: data.user }));
        toast.success(`Welcome, ${data.user.name}! Signed in with Google 🍰`);
        navigate(data.user.role === "admin" ? "/admin" : "/");
      } catch {
        setError("Could not reach the server. Please check your connection.");
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigate],
  );

  // Initialize GIS once the SDK script is ready
  useEffect(() => {
    if (!CLIENT_ID) return;

    const init = () => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render GIS's official button into the hidden div so it's ready to click
      if (hiddenDivRef.current) {
        window.google.accounts.id.renderButton(hiddenDivRef.current, {
          theme: "outline",
          size: "large",
        });
      }

      setInitialized(true);
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      // Script might still be loading — poll until ready
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          init();
        }
      }, 150);
      return () => clearInterval(timer);
    }
  }, [CLIENT_ID, handleCredentialResponse]);

  // Called when the user clicks our styled "Sign in with Google" button
  const signIn = useCallback(() => {
    setError(null);

    if (!CLIENT_ID) {
      setError(
        "Google Sign-In is not configured. Add VITE_GOOGLE_CLIENT_ID to frontend/.env and restart the dev server.",
      );
      return;
    }

    if (!initialized || !window.google?.accounts?.id) {
      setError("Google Sign-In is still loading — please try again in a moment.");
      return;
    }

    // Click the hidden official Google button to open the real account picker
    const gisButton = hiddenDivRef.current?.querySelector<HTMLElement>(
      'div[role="button"], button',
    );
    if (gisButton) {
      gisButton.click();
    } else {
      // Fallback: use One-Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setError(
            "Google Sign-In could not open. Make sure popups are allowed for this site.",
          );
        }
      });
    }
  }, [CLIENT_ID, initialized]);

  return {
    signIn,
    error,
    setError,
    loading,
    hiddenDivRef,
    isConfigured: Boolean(CLIENT_ID),
  };
}
