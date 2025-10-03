import React, { useState } from 'react';

const WaitlistForm = ({ onSuccess }) => {
  // API URL for production deployment
  const API_URL = import.meta.env.VITE_API_URL || '';

  const [formData, setFormData] = useState({
    email: '',
    preferredName: '',
    linkedinProfile: '',
    yearsOfExperience: '',
    employmentStatus: '',
    cloudPlatforms: [],
    devopsTools: [],
    programmingLanguages: [],
    monitoringTools: [],
    databases: [],
    experienceLevel: '',
    roleFocus: '',
    location: '',
    currentSalaryRange: '',
    desiredSalaryRange: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Validation constants
  const MAX_ARRAY_ITEMS = 20;
  const MAX_NAME_LENGTH = 100;
  const MAX_LINKEDIN_LENGTH = 200;

  // Dropdown options (must match backend validation)
  const employmentStatuses = ['Employed', 'Looking', 'Freelancing'];
  const experienceLevels = ['Junior (0-2 years)', 'Mid-level (3-5 years)', 'Senior (6-8 years)', 'Lead/Principal (9+ years)', 'Engineering Manager', 'Director/VP'];
  const roleFocuses = ['DevOps Engineer', 'Cloud Engineer', 'SRE', 'Platform Engineer', 'Infrastructure Engineer', 'Security Engineer'];
  const locations = ['Metro Manila', 'Cebu', 'Davao', 'Remote - Philippines', 'Remote - International', 'Other'];
  const salaryRanges = ['Below 50,000', '50,000 - 80,000', '80,000 - 120,000', '120,000 - 160,000', '160,000 - 200,000', '200,000 - 250,000', '250,000 - 300,000', 'Above 300,000'];

  // Skill arrays (synced with backend VALID_* constants)
  const cloudPlatforms = ['AWS', 'Google Cloud Platform (GCP)', 'Microsoft Azure', 'Alibaba Cloud', 'DigitalOcean', 'Oracle Cloud', 'IBM Cloud'];
  const devopsTools = ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'CircleCI', 'ArgoCD', 'Helm', 'Vagrant', 'Puppet', 'Chef'];
  const programmingLanguages = ['Python', 'JavaScript', 'Go', 'Java', 'Ruby', 'Bash/Shell', 'PowerShell', 'TypeScript', 'C#', 'PHP', 'Rust'];
  const monitoringTools = ['Prometheus', 'Grafana', 'Datadog', 'New Relic', 'ELK Stack', 'Splunk', 'Nagios', 'Zabbix', 'CloudWatch', 'PagerDuty'];
  const databases = ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra', 'Microsoft SQL Server', 'Oracle Database', 'MariaDB'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleMultiSelect = (category, value) => {
    setFormData(prev => {
      const isSelected = prev[category].includes(value);
      
      // If trying to select and already at max limit
      if (!isSelected && prev[category].length >= MAX_ARRAY_ITEMS) {
        const categoryName = category
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .toLowerCase();
        setError(`Maximum ${MAX_ARRAY_ITEMS} ${categoryName} can be selected`);
        return prev;
      }
      
      // Clear error when deselecting or successful selection
      if (error) setError('');
      
      return {
        ...prev,
        [category]: isSelected
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      };
    });
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.email || !formData.email.includes('@')) return 'Please enter a valid email address';
      if (!formData.yearsOfExperience || parseFloat(formData.yearsOfExperience) < 0) return 'Please enter your years of experience';
      if (!formData.employmentStatus) return 'Please select your employment status';
      return null;
    }
    if (step === 2) {
      const totalSkills = formData.cloudPlatforms.length + formData.devopsTools.length + formData.programmingLanguages.length + formData.monitoringTools.length + formData.databases.length;
      if (totalSkills === 0) return 'Please select at least one skill';
      return null;
    }
    if (step === 3) {
      if (!formData.experienceLevel) return 'Please select your experience level';
      if (!formData.roleFocus) return 'Please select your role focus';
      if (!formData.location) return 'Please select your location';
      if (!formData.currentSalaryRange) return 'Please select your current salary range';
      return null;
    }
    return null;
  };

  const nextStep = () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          yearsOfExperience: parseFloat(formData.yearsOfExperience) // Ensure it's a number
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit form');
      }

      onSuccess(formData.email);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSkillSelector = (title, options, category) => {
    const selectionCount = formData[category].length;
    const isNearLimit = selectionCount >= 15;
    const isAtLimit = selectionCount >= MAX_ARRAY_ITEMS;
    
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-dark-text mb-3">{title}</label>
        <div className="flex flex-wrap gap-2">
          {options.map(option => {
            const isSelected = formData[category].includes(option);
            const isDisabled = !isSelected && isAtLimit;
            
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleMultiSelect(category, option)}
                disabled={isDisabled}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-accent-primary text-white'
                    : isDisabled
                    ? 'bg-dark-bg text-dark-textMuted border border-dark-border opacity-50 cursor-not-allowed'
                    : 'bg-dark-bg text-dark-textMuted border border-dark-border hover:border-accent-primary/50'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {selectionCount > 0 && (
          <p className={`mt-2 text-xs ${isNearLimit ? 'text-amber-400 font-medium' : 'text-accent-secondary'}`}>
            {selectionCount} selected
            {isNearLimit && ` (max ${MAX_ARRAY_ITEMS})`}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto bg-dark-card border border-dark-border rounded-2xl p-8 md:p-10 shadow-2xl">
      <h3 className="text-3xl font-bold text-dark-text mb-2 text-center">
        Join the Waitlist & Contribute Anonymously
      </h3>
      <p className="text-center text-dark-textMuted mb-8">Step {currentStep} of 3</p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex gap-2">
          {[1, 2, 3].map(step => (
            <div key={step} className={`h-2 flex-1 rounded-full transition-all ${step <= currentStep ? 'bg-accent-primary' : 'bg-dark-border'}`} />
          ))}
        </div>
      </div>

      <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-dark-text mb-4">Personal Information</h4>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="preferredName" className="block text-sm font-medium text-dark-text mb-2">
                Preferred Name/Nickname <span className="text-dark-textMuted text-xs">(optional)</span>
              </label>
              <input
                type="text"
                id="preferredName"
                name="preferredName"
                value={formData.preferredName}
                onChange={handleChange}
                maxLength={MAX_NAME_LENGTH}
                placeholder="e.g., John"
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
              />
              {formData.preferredName.length > 80 && (
                <p className="mt-1 text-xs text-amber-400">
                  {MAX_NAME_LENGTH - formData.preferredName.length} characters remaining
                </p>
              )}
            </div>

            <div>
              <label htmlFor="linkedinProfile" className="block text-sm font-medium text-dark-text mb-2">
                LinkedIn Profile <span className="text-dark-textMuted text-xs">(optional)</span>
              </label>
              <input
                type="url"
                id="linkedinProfile"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleChange}
                maxLength={MAX_LINKEDIN_LENGTH}
                pattern="https?://(www\.)?linkedin\.com/in/.+"
                title="Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)"
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
              />
              {formData.linkedinProfile.length > 0 && (
                <p className="mt-1 text-xs text-dark-textMuted">
                  {formData.linkedinProfile.length > 180 && (
                    <span className="text-amber-400">{MAX_LINKEDIN_LENGTH - formData.linkedinProfile.length} characters remaining • </span>
                  )}
                  <span>Must be a LinkedIn profile URL</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-dark-text mb-2">
                Years of Experience in Tech <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="0"
                step="0.5"
                placeholder="e.g., 5"
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="employmentStatus" className="block text-sm font-medium text-dark-text mb-2">
                Current Employment Status <span className="text-red-500">*</span>
              </label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
                required
              >
                <option value="">Select status</option>
                {employmentStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Technical Skills */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-dark-text mb-4">Technical Skills</h4>
            <p className="text-sm text-dark-textMuted mb-6">Select all that apply (at least one required)</p>
            
            {renderSkillSelector('Cloud Platforms', cloudPlatforms, 'cloudPlatforms')}
            {renderSkillSelector('DevOps Tools', devopsTools, 'devopsTools')}
            {renderSkillSelector('Programming Languages', programmingLanguages, 'programmingLanguages')}
            {renderSkillSelector('Monitoring & Observability', monitoringTools, 'monitoringTools')}
            {renderSkillSelector('Databases', databases, 'databases')}
          </div>
        )}

        {/* STEP 3: Experience & Compensation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-dark-text mb-4">Experience & Compensation</h4>

            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-dark-text mb-2">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
                required
              >
                <option value="">Select level</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="roleFocus" className="block text-sm font-medium text-dark-text mb-2">
                Role Focus <span className="text-red-500">*</span>
              </label>
              <select
                id="roleFocus"
                name="roleFocus"
                value={formData.roleFocus}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
                required
              >
                <option value="">Select role</option>
                {roleFocuses.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-dark-text mb-2">
                Current Location <span className="text-red-500">*</span>
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
                required
              >
                <option value="">Select location</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="currentSalaryRange" className="block text-sm font-medium text-dark-text mb-2">
                Current Monthly Salary Range (PHP) <span className="text-red-500">*</span>
              </label>
              <select
                id="currentSalaryRange"
                name="currentSalaryRange"
                value={formData.currentSalaryRange}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
                required
              >
                <option value="">Select range</option>
                {salaryRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="desiredSalaryRange" className="block text-sm font-medium text-dark-text mb-2">
                Desired Monthly Salary Range (PHP) <span className="text-dark-textMuted text-xs">(optional)</span>
              </label>
              <select
                id="desiredSalaryRange"
                name="desiredSalaryRange"
                value={formData.desiredSalaryRange}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all outline-none"
              >
                <option value="">Select range</option>
                {salaryRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div className="bg-dark-bg border border-accent-primary/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-secondary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-dark-textMuted leading-relaxed">
                  Your salary data is <span className="text-accent-secondary font-semibold">100% anonymous</span> and will only be used in aggregated public reports. 
                  Your email will be kept private and used only to notify you of our launch.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 bg-dark-bg border border-dark-border text-dark-text font-semibold py-4 px-6 rounded-lg transition-all hover:border-accent-primary/50"
            >
              Back
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primaryHover hover:to-accent-secondary text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-accent-primary/20"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              currentStep === 3 ? 'Join the Waitlist' : 'Next'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WaitlistForm;
