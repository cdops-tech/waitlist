import React, { useState } from 'react';
import Hero from './components/Hero';
import WaitlistForm from './components/WaitlistForm';
import ThankYou from './components/ThankYou';

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSuccess = (email) => {
    setSubmittedEmail(email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <Hero />
          
          <div className="mt-16">
            {!isSubmitted ? (
              <WaitlistForm onSuccess={handleSuccess} />
            ) : (
              <ThankYou email={submittedEmail} />
            )}
          </div>

          {/* Footer */}
          <footer className="mt-20 text-center text-dark-textMuted text-sm">
            <p>© 2025 DevOps Compass. Built for the DevOps community in the Philippines.</p>
            <p className="mt-2">
              Questions? Reach out to{' '}
              <a href="mailto:contact@cdops.tech" className="text-accent-primary hover:underline">
                contact@cdops.tech
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
