import React, { useState } from 'react';
import { Save, Shield, Globe, Bell, Key } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useApp } from '../../context/AppContext';

export const Settings: React.FC = () => {
  const { settings, setSettings, showToast } = useApp();
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    setSettings(formData);
    showToast('Settings saved successfully!', 'success');
  };

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Hindi', label: 'Hindi' },
    { value: 'Spanish', label: 'Spanish' },
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'IST', label: 'Asia/Kolkata' },
    { value: 'PST', label: 'America/Los_Angeles' },
  ];

  const propertyTypeOptions = [
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Plot', label: 'Plot' },
    { value: 'Commercial', label: 'Commercial' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your application settings</p>
        </div>
        <Button variant="primary" icon={Save} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-white">General</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Site Name"
              value={formData.general.siteName}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                general: { ...prev.general, siteName: value }
              }))}
            />
            <Select
              label="Language"
              options={languageOptions}
              value={formData.general.language}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                general: { ...prev.general, language: value }
              }))}
            />
            <Select
              label="Timezone"
              options={timezoneOptions}
              value={formData.general.timezone}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                general: { ...prev.general, timezone: value }
              }))}
            />
          </div>
        </Card>

        {/* Preferences */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-white">Preferences</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={formData.preferences.theme === 'dark'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, theme: e.target.value as 'dark' | 'light' }
                    }))}
                    className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700 focus:ring-red-500"
                  />
                  <span className="text-gray-300">Dark</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={formData.preferences.theme === 'light'}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, theme: e.target.value as 'dark' | 'light' }
                    }))}
                    className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700 focus:ring-red-500"
                  />
                  <span className="text-gray-300">Light</span>
                </label>
              </div>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.preferences.notifications}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, notifications: e.target.checked }
                  }))}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700 rounded focus:ring-red-500"
                />
                <span className="text-gray-300">Enable notifications</span>
              </label>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-white">Security</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.security.twoFA}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    security: { ...prev.security, twoFA: e.target.checked }
                  }))}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-700 rounded focus:ring-red-500"
                />
                <span className="text-gray-300">Enable Two-Factor Authentication</span>
              </label>
            </div>
            <Input
              label="Session Timeout (minutes)"
              type="number"
              value={formData.security.sessionTimeout.toString()}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                security: { ...prev.security, sessionTimeout: parseInt(value) || 30 }
              }))}
            />
          </div>
        </Card>

        {/* Property Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Key className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-white">Property Settings</h2>
          </div>
          <div className="space-y-6">
            <Select
              label="Default Property Type"
              options={propertyTypeOptions}
              value={formData.properties.defaultType}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                properties: { ...prev.properties, defaultType: value }
              }))}
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status Types</label>
              <div className="space-y-2">
                {formData.properties.statusTypes.map((status, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={status}
                      onChange={(e) => {
                        const newStatusTypes = [...formData.properties.statusTypes];
                        newStatusTypes[index] = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          properties: { ...prev.properties, statusTypes: newStatusTypes }
                        }));
                      }}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Integrations */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Key className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold text-white">Integrations</h2>
          </div>
          <div className="space-y-6">
            <Input
              label="API Key"
              type="password"
              value={formData.integrations.apiKey}
              onChange={(value) => setFormData(prev => ({
                ...prev,
                integrations: { ...prev.integrations, apiKey: value }
              }))}
              placeholder="Enter your API key"
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Webhook URLs</label>
              <p className="text-sm text-gray-400 mb-3">Configure webhook endpoints for external integrations</p>
              <Button variant="ghost" size="sm">
                Add Webhook
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};