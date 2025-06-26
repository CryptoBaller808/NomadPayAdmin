import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface SystemSettings {
  systemName: string;
  primaryColor: string;
  secondaryColor: string;
  minTransactionLimit: number;
  maxTransactionLimit: number;
  dailyTransactionLimit: number;
  apiKey: string;
  webhookEndpoint: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  twoFactorRequired: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

interface NotificationState {
  show: boolean;
  type: 'success' | 'error' | 'warning';
  message: string;
}

const SystemSettings: React.FC = () => {
  const context = useContext(AuthContext);
  const user = context?.user;
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: 'NomadPay',
    primaryColor: '#FFD700',
    secondaryColor: '#1a1a2e',
    minTransactionLimit: 1,
    maxTransactionLimit: 10000,
    dailyTransactionLimit: 50000,
    apiKey: 'np_live_sk_1234567890abcdef',
    webhookEndpoint: 'https://api.nomadpay.com/webhooks',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorRequired: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });

  const [originalSettings, setOriginalSettings] = useState<SystemSettings>(settings);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    message: ''
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<SystemSettings>>({});

  // Check if user has permission to access settings
  const hasSettingsAccess = user?.role === 'Super Admin' || user?.role === 'Admin';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call to load settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would fetch from backend
      setOriginalSettings(settings);
      showNotification('success', 'Settings loaded successfully');
    } catch (error) {
      showNotification('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleInputChange = (field: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalSettings(settings);
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setIsEditing(false);
    showNotification('warning', 'Changes cancelled');
  };

  const handleSave = () => {
    const changes = getChangedFields();
    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      showNotification('warning', 'No changes to save');
      return;
    }

    // Check for critical changes that require confirmation
    const criticalFields = ['maintenanceMode', 'twoFactorRequired', 'maxLoginAttempts'];
    const hasCriticalChanges = Object.keys(changes).some(field => criticalFields.includes(field));

    if (hasCriticalChanges) {
      setPendingChanges(changes);
      setShowConfirmModal(true);
    } else {
      saveSettings(changes);
    }
  };

  const getChangedFields = (): Partial<SystemSettings> => {
    const changes: Partial<SystemSettings> = {};
    (Object.keys(settings) as Array<keyof SystemSettings>).forEach(key => {
      if (settings[key] !== originalSettings[key]) {
        (changes as any)[key] = settings[key];
      }
    });
    return changes;
  };

  const saveSettings = async (changes: Partial<SystemSettings>) => {
    setLoading(true);
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would send to backend
      console.log('Saving settings changes:', changes);
      
      setOriginalSettings(settings);
      setIsEditing(false);
      setShowConfirmModal(false);
      setPendingChanges({});
      showNotification('success', 'Settings saved successfully');
      
      // Log audit event
      console.log('Audit Log: System Settings Update', {
        admin: user?.email,
        action: 'System Settings Update',
        target: 'System Configuration',
        details: `Updated ${Object.keys(changes).join(', ')}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      showNotification('error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const confirmSave = () => {
    saveSettings(pendingChanges);
  };

  const generateNewApiKey = () => {
    const newKey = 'np_live_sk_' + Math.random().toString(36).substring(2, 18);
    handleInputChange('apiKey', newKey);
    showNotification('success', 'New API key generated');
  };

  if (!hasSettingsAccess) {
    return (
      <div className="system-settings">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You do not have permission to view this page.</p>
          <p>Only Admins and Super Admins can access System Settings.</p>
        </div>
      </div>
    );
  }

  if (loading && !isEditing) {
    return (
      <div className="system-settings">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading system settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="system-settings">
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <h1>⚙️ System Settings</h1>
          <p>Configure global system settings and security parameters</p>
        </div>
        <div className="header-actions">
          {!isEditing ? (
            <button className="btn-primary" onClick={handleEdit} disabled={loading}>
              ✏️ Edit Settings
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn-secondary" onClick={handleCancel} disabled={loading}>
                ❌ Cancel
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? '💾 Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`notification notification-${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : '⚠️'}
          </span>
          <span className="notification-message">{notification.message}</span>
        </div>
      )}

      {/* Settings Content */}
      <div className="settings-content">
        {/* General Settings */}
        <div className="settings-section">
          <h2>🏢 General Settings</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>System Name</label>
              <input
                type="text"
                value={settings.systemName}
                onChange={(e) => handleInputChange('systemName', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter system name"
              />
            </div>
            <div className="setting-item">
              <label>Primary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  disabled={!isEditing}
                  placeholder="#FFD700"
                />
              </div>
            </div>
            <div className="setting-item">
              <label>Secondary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={settings.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  disabled={!isEditing}
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  disabled={!isEditing}
                  placeholder="#1a1a2e"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Limits */}
        <div className="settings-section">
          <h2>💳 Transaction Limits</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Minimum Transaction ($)</label>
              <input
                type="number"
                value={settings.minTransactionLimit}
                onChange={(e) => handleInputChange('minTransactionLimit', Number(e.target.value))}
                disabled={!isEditing}
                min="0"
                step="0.01"
              />
            </div>
            <div className="setting-item">
              <label>Maximum Transaction ($)</label>
              <input
                type="number"
                value={settings.maxTransactionLimit}
                onChange={(e) => handleInputChange('maxTransactionLimit', Number(e.target.value))}
                disabled={!isEditing}
                min="1"
                step="0.01"
              />
            </div>
            <div className="setting-item">
              <label>Daily Transaction Limit ($)</label>
              <input
                type="number"
                value={settings.dailyTransactionLimit}
                onChange={(e) => handleInputChange('dailyTransactionLimit', Number(e.target.value))}
                disabled={!isEditing}
                min="1"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="settings-section">
          <h2>🔑 API Configuration</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>API Key</label>
              <div className="api-key-group">
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  disabled={!isEditing}
                  placeholder="API Key"
                />
                {isEditing && (
                  <button className="btn-secondary" onClick={generateNewApiKey}>
                    🔄 Generate New
                  </button>
                )}
              </div>
            </div>
            <div className="setting-item">
              <label>Webhook Endpoint</label>
              <input
                type="url"
                value={settings.webhookEndpoint}
                onChange={(e) => handleInputChange('webhookEndpoint', e.target.value)}
                disabled={!isEditing}
                placeholder="https://api.example.com/webhooks"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-section">
          <h2>🛡️ Security Settings</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', Number(e.target.value))}
                disabled={!isEditing}
                min="5"
                max="480"
              />
            </div>
            <div className="setting-item">
              <label>Max Login Attempts</label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', Number(e.target.value))}
                disabled={!isEditing}
                min="3"
                max="10"
              />
            </div>
          </div>
          
          <div className="settings-toggles">
            <div className="toggle-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-label">🚧 Maintenance Mode</span>
              </label>
              <p className="toggle-description">Enable maintenance mode to restrict access</p>
            </div>
            
            <div className="toggle-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.twoFactorRequired}
                  onChange={(e) => handleInputChange('twoFactorRequired', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-label">🔐 Require Two-Factor Authentication</span>
              </label>
              <p className="toggle-description">Require 2FA for all admin accounts</p>
            </div>
            
            <div className="toggle-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-label">📧 Email Notifications</span>
              </label>
              <p className="toggle-description">Send email notifications for important events</p>
            </div>
            
            <div className="toggle-item">
              <label>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                  disabled={!isEditing}
                />
                <span className="toggle-label">📱 SMS Notifications</span>
              </label>
              <p className="toggle-description">Send SMS notifications for critical alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>⚠️ Confirm Critical Changes</h3>
            </div>
            <div className="modal-content">
              <p>You are about to make critical security changes that may affect system access:</p>
              <ul>
                {Object.keys(pendingChanges).map(field => (
                  <li key={field}>
                    <strong>{field}:</strong> {String(pendingChanges[field as keyof SystemSettings])}
                  </li>
                ))}
              </ul>
              <p>Are you sure you want to proceed?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setShowConfirmModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn-danger" 
                onClick={confirmSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Confirm Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;

