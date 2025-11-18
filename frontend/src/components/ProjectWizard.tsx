import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import type { CreateProjectFormData, ProjectTemplate, DatabaseConfig, AuthProvider, Feature, IntegrationType } from '../types';

interface ProjectWizardProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  onSubmit: (data: CreateProjectFormData) => void;
  isSubmitting: boolean;
}

const templates: Array<{ value: ProjectTemplate; label: string; description: string; icon: string }> = [
  {
    value: 'SAAS' as ProjectTemplate,
    label: 'SaaS Application',
    description: 'Complete SaaS with authentication, subscriptions, and admin panel',
    icon: '🚀',
  },
  {
    value: 'ECOMMERCE' as ProjectTemplate,
    label: 'E-Commerce Store',
    description: 'Online store with products, cart, checkout, and payment processing',
    icon: '🛍️',
  },
  {
    value: 'BLOG' as ProjectTemplate,
    label: 'Blog/CMS',
    description: 'Content management system with markdown support and SEO optimization',
    icon: '📝',
  },
  {
    value: 'API' as ProjectTemplate,
    label: 'REST API',
    description: 'Backend API with documentation, authentication, and rate limiting',
    icon: '⚡',
  },
];

const databases: Array<{ value: DatabaseConfig['type']; label: string; icon: string }> = [
  { value: 'postgresql', label: 'PostgreSQL', icon: '🐘' },
  { value: 'mysql', label: 'MySQL', icon: '🐬' },
  { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
  { value: 'sqlite', label: 'SQLite', icon: '💾' },
];

const authProviders: Array<{ value: AuthProvider; label: string; icon: string }> = [
  { value: 'EMAIL' as AuthProvider, label: 'Email/Password', icon: '📧' },
  { value: 'GOOGLE' as AuthProvider, label: 'Google OAuth', icon: '🔵' },
  { value: 'GITHUB' as AuthProvider, label: 'GitHub OAuth', icon: '⚫' },
  { value: 'FACEBOOK' as AuthProvider, label: 'Facebook Login', icon: '🔷' },
];

const features: Array<{ name: string; description: string; icon: string }> = [
  { name: 'User Management', description: 'Complete user CRUD with profiles', icon: '👥' },
  { name: 'File Upload', description: 'AWS S3 integration for file storage', icon: '📁' },
  { name: 'Email Notifications', description: 'SendGrid email service', icon: '📬' },
  { name: 'Real-time Updates', description: 'WebSocket support', icon: '⚡' },
  { name: 'API Documentation', description: 'Auto-generated Swagger docs', icon: '📖' },
  { name: 'Rate Limiting', description: 'Request throttling', icon: '🛡️' },
  { name: 'Logging', description: 'Structured logging with Winston', icon: '📊' },
  { name: 'Testing', description: 'Unit and integration tests', icon: '🧪' },
];

export function ProjectWizard({ currentStep, onStepChange, onSubmit, isSubmitting }: ProjectWizardProps) {
  const [formData, setFormData] = useState<CreateProjectFormData>({
    name: '',
    description: '',
    template: 'SAAS' as ProjectTemplate,
    database: { type: 'postgresql' },
    auth: {
      providers: ['EMAIL' as AuthProvider],
      features: {
        emailVerification: true,
        passwordReset: true,
        mfa: false,
        socialLogin: false,
      },
    },
    features: [],
    integrations: [],
    deployment: { platform: 'vercel' },
  });

  const handleNext = () => {
    if (currentStep < 4) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const updateFormData = (updates: Partial<CreateProjectFormData>) => {
    setFormData({ ...formData, ...updates });
  };

  const toggleFeature = (featureName: string) => {
    const exists = formData.features.find((f) => f.name === featureName);
    if (exists) {
      updateFormData({
        features: formData.features.filter((f) => f.name !== featureName),
      });
    } else {
      updateFormData({
        features: [...formData.features, { name: featureName, enabled: true }],
      });
    }
  };

  const toggleAuthProvider = (provider: AuthProvider) => {
    const providers = formData.auth?.providers || [];
    if (providers.includes(provider)) {
      updateFormData({
        auth: {
          ...formData.auth!,
          providers: providers.filter((p) => p !== provider),
        },
      });
    } else {
      updateFormData({
        auth: {
          ...formData.auth!,
          providers: [...providers, provider],
        },
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Template Selection */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
            <p className="text-gray-600">Select the type of application you want to build</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.value}
                onClick={() => updateFormData({ template: template.value })}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  formData.template === template.value
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="text-4xl mb-3">{template.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{template.label}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
                {formData.template === template.value && (
                  <div className="mt-3 flex items-center gap-2 text-blue-600 font-semibold">
                    <Check className="w-4 h-4" />
                    Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Features Selection */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Features</h2>
            <p className="text-gray-600">Choose the features you want in your application</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => {
              const isSelected = formData.features.some((f) => f.name === feature.name);
              return (
                <button
                  key={feature.name}
                  onClick={() => toggleFeature(feature.name)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{feature.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{feature.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-blue-600 mt-1" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Configuration */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Your Project</h2>
            <p className="text-gray-600">Set up database and authentication</p>
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Project Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="my-awesome-app"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Describe your project..."
              />
            </div>
          </div>

          {/* Database Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Database</label>
            <div className="grid grid-cols-4 gap-3">
              {databases.map((db) => (
                <button
                  key={db.value}
                  onClick={() => updateFormData({ database: { type: db.value } })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.database.type === db.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{db.icon}</div>
                  <div className="text-sm font-semibold text-gray-900">{db.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Auth Providers */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Authentication</label>
            <div className="grid grid-cols-2 gap-3">
              {authProviders.map((provider) => {
                const isSelected = formData.auth?.providers.includes(provider.value);
                return (
                  <button
                    key={provider.value}
                    onClick={() => toggleAuthProvider(provider.value)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl">{provider.icon}</div>
                    <div className="text-sm font-semibold text-gray-900 flex-1 text-left">
                      {provider.label}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Configuration</h2>
            <p className="text-gray-600">Make sure everything looks good before creating</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 space-y-4">
            <div>
              <span className="text-sm font-semibold text-gray-600">Project Name:</span>
              <div className="text-lg font-bold text-gray-900">{formData.name || 'Not set'}</div>
            </div>

            <div>
              <span className="text-sm font-semibold text-gray-600">Template:</span>
              <div className="text-lg font-bold text-gray-900">
                {templates.find((t) => t.value === formData.template)?.label}
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold text-gray-600">Database:</span>
              <div className="text-lg font-bold text-gray-900 capitalize">
                {formData.database.type}
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold text-gray-600">Authentication:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.auth?.providers.map((provider) => (
                  <span
                    key={provider}
                    className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 border border-gray-200"
                  >
                    {authProviders.find((p) => p.value === provider)?.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold text-gray-600">Features:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.features.map((feature) => (
                  <span
                    key={feature.name}
                    className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 border border-gray-200"
                  >
                    {feature.name}
                  </span>
                ))}
                {formData.features.length === 0 && (
                  <span className="text-gray-500">No features selected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
              isSubmitting || !formData.name
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg'
            }`}
          >
            <Check className="w-5 h-5" />
            Create Project
          </button>
        )}
      </div>
    </div>
  );
}
