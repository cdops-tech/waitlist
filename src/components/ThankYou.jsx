import React from 'react';

const ThankYou = ({ email }) => {
  const shareUrl = encodeURIComponent('https://devopscompass.ph');
  const shareText = encodeURIComponent('Join me on the DevOps Compass waitlist - the anonymous salary platform for Cloud & DevOps professionals in the Philippines!');

  const handleShare = (platform) => {
    let url = '';
    
    if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center animate-fade-in">
      {/* Success Icon */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-secondary to-accent-primary rounded-full mb-4 animate-bounce-slow">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Thank You Message */}
      <h2 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">
        Thank You! You're on the list.
      </h2>

      <p className="text-lg md:text-xl text-dark-textMuted mb-4">
        We'll notify you at{' '}
        <span className="text-accent-primary font-semibold">{email}</span>{' '}
        as soon as DevOps Compass is live.
      </p>

      <p className="text-lg md:text-xl text-dark-textMuted mb-10">
        Help the community grow by sharing with your colleagues!
      </p>

      {/* Social Sharing Buttons */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 md:p-10 shadow-2xl">
        <h3 className="text-xl font-semibold text-dark-text mb-6">
          Share the waitlist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* LinkedIn Button */}
          <button
            onClick={() => handleShare('linkedin')}
            className="flex flex-col items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#006399] text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 min-h-[100px]"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
            </svg>
            <span className="text-base">Share on</span>
            <span className="text-lg font-bold">LinkedIn</span>
          </button>

          {/* Facebook Button */}
          <button
            onClick={() => handleShare('facebook')}
            className="flex flex-col items-center justify-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 min-h-[100px]"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"/>
            </svg>
            <span className="text-base">Share on</span>
            <span className="text-lg font-bold">Facebook</span>
          </button>

          {/* Twitter/X Button */}
          <button
            onClick={() => handleShare('twitter')}
            className="flex flex-col items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 border border-gray-800 min-h-[100px]"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-base">Share on</span>
            <span className="text-lg font-bold">X</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-dark-border">
          <p className="text-sm text-dark-textMuted">
            Your data has been securely saved and will help build the most comprehensive 
            salary database for DevOps professionals in the Philippines.
          </p>
        </div>
      </div>

      {/* Back to Home Option (Optional) */}
      <div className="mt-8">
        <button
          onClick={() => window.location.reload()}
          className="text-accent-primary hover:text-accent-primaryHover underline transition-colors"
        >
          Submit another response
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
