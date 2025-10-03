import React from 'react';

const Hero = () => {
  return (
    <div className="text-center mb-16 animate-fade-in">
      {/* Logo/Brand */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center mb-4">
          <img 
            src="/compass-logo.png" 
            alt="DevOps Compass Logo" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-dark-text to-dark-textMuted bg-clip-text text-transparent mb-2">
          DevOps Compass
        </h1>
      </div>

      {/* Hero Headline */}
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-dark-text mb-8 leading-tight max-w-5xl mx-auto">
        Finally, Know Your True Worth in the PH Tech Market
      </h2>

      {/* Sub-headline */}
      <p className="text-lg md:text-xl text-dark-textMuted max-w-4xl mx-auto leading-relaxed mb-10">
        DevOps Compass is the <span className="text-accent-secondary font-semibold">anonymous career intelligence platform</span> built for Cloud & DevOps professionals in the Philippines. 
        <br className="hidden md:block" />
        Stop guessing and start making data-driven career decisions.
      </p>

      {/* Key Benefits */}
      <div className="max-w-4xl mx-auto mt-12 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
          {/* Benefit 1 */}
          <div className="bg-dark-card/50 border border-dark-border/50 rounded-xl p-6 hover:border-accent-primary/30 transition-all">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-dark-text mb-2">
                  Benchmark Your Salary
                </h3>
                <p className="text-sm md:text-base text-dark-textMuted leading-relaxed">
                  Anonymously compare your pay against real, local market data.
                </p>
              </div>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="bg-dark-card/50 border border-dark-border/50 rounded-xl p-6 hover:border-accent-secondary/30 transition-all">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-accent-secondary to-accent-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-dark-text mb-2">
                  Get Hired Privately
                </h3>
                <p className="text-sm md:text-base text-dark-textMuted leading-relaxed">
                  Let top companies apply to you, with salary details upfront.
                </p>
              </div>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="bg-dark-card/50 border border-dark-border/50 rounded-xl p-6 hover:border-accent-primary/30 transition-all">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-dark-text mb-2">
                  Solve Tough Problems
                </h3>
                <p className="text-sm md:text-base text-dark-textMuted leading-relaxed">
                  Join a dedicated community of the best DevOps experts in the country.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual accent */}
      <div className="mt-10 flex justify-center gap-2">
        <div className="h-1 w-16 bg-accent-primary rounded-full"></div>
        <div className="h-1 w-16 bg-accent-secondary rounded-full"></div>
        <div className="h-1 w-16 bg-accent-primary rounded-full"></div>
      </div>
    </div>
  );
};

export default Hero;
