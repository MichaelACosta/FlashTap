"use client";

import Script from "next/script";
import { useAnalyticsConsent } from "@/application";
import { CookieConsentBanner } from "@/presentation/components";

// US-24: o script do Clarity só carrega com projeto configurado E consentimento
// explícito aceito (LGPD); sem NEXT_PUBLIC_CLARITY_PROJECT_ID, nunca carrega.
export function AnalyticsGate() {
  const { consent, acceptAnalytics, declineAnalytics } = useAnalyticsConsent();
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <>
      {consent === "accepted" && clarityProjectId && (
        <Script id="clarity-analytics" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityProjectId}");`}
        </Script>
      )}
      {consent === null && (
        <CookieConsentBanner onAccept={acceptAnalytics} onDecline={declineAnalytics} />
      )}
    </>
  );
}
