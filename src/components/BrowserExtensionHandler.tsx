"use client";

import { useEffect } from "react";

export default function BrowserExtensionHandler() {
  useEffect(() => {
    // This component only runs on the client side
    // Browser extensions will add their attributes after this component mounts
    // This prevents hydration mismatches
  }, []);

  return null;
}
