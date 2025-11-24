import { useEffect } from 'react';

const LiveChat = () => {
  useEffect(() => {
    // Tawk.to Live Chat Widget
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    
    (function(){
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      
      // Using a demo Tawk.to ID - replace with your actual ID from tawk.to dashboard
      s1.async = true;
      s1.src = 'https://embed.tawk.to/5f5e8c4df0e7167d0014e5e1/default';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();

    return () => {
      // Cleanup
      const tawkScript = document.querySelector('script[src*="tawk.to"]');
      if (tawkScript) {
        tawkScript.remove();
      }
      // Remove Tawk widget
      const tawkWidget = document.getElementById('tawkchat-container');
      if (tawkWidget) {
        tawkWidget.remove();
      }
    };
  }, []);

  return null;
};

export default LiveChat;
