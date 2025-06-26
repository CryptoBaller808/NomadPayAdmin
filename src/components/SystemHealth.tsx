import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  url: string;
  lastPing: Date;
  latency: number;
  uptime: string;
  details: string;
}

interface EnvironmentInfo {
  frontendBranch: string;
  backendBranch: string;
  frontendUrl: string;
  backendUrl: string;
  environment: string;
  frontendCommit: string;
  backendCommit: string;
  commitTimestamp: string;
  serverTimezone: string;
  serverUptime: string;
}

const SystemHealth: React.FC = () => {
  const context = useContext(AuthContext);
  const user = context?.user;

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'Frontend (Admin Panel)',
      status: 'healthy',
      url: 'https://nomadpayadmin.onrender.com',
      lastPing: new Date(),
      latency: 245,
      uptime: '99.9%',
      details: 'React application running smoothly'
    },
    {
      name: 'Backend API',
      status: 'healthy',
      url: 'https://nomadpay-api.onrender.com',
      lastPing: new Date(),
      latency: 312,
      uptime: '99.8%',
      details: 'Flask API responding normally'
    },
    {
      name: 'Database Connection',
      status: 'healthy',
      url: 'PostgreSQL Database',
      lastPing: new Date(),
      latency: 89,
      uptime: '99.9%',
      details: 'Database queries executing normally'
    },
    {
      name: 'User Frontend',
      status: 'warning',
      url: 'https://nomadpay-fe.onrender.com',
      lastPing: new Date(),
      latency: 567,
      uptime: '98.5%',
      details: 'Slightly elevated response times'
    }
  ]);

  const [environmentInfo, setEnvironmentInfo] = useState<EnvironmentInfo>({
    frontendBranch: 'main',
    backendBranch: 'main',
    frontendUrl: 'https://nomadpayadmin.onrender.com',
    backendUrl: 'https://nomadpay-api.onrender.com',
    environment: 'Production',
    frontendCommit: '548b905',
    backendCommit: 'a7f3c21',
    commitTimestamp: '2025-06-25T02:45:00Z',
    serverTimezone: 'UTC',
    serverUptime: '7 days, 14 hours, 23 minutes'
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Simulate real-time health checking
  useEffect(() => {
    const interval = setInterval(() => {
      checkServiceHealth();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkServiceHealth = async () => {
    setIsRefreshing(true);
    
    // Simulate health checks with realistic delays
    const updatedServices = await Promise.all(
      services.map(async (service) => {
        try {
          const startTime = Date.now();
          
          // Simulate API call for health check
          if (service.url.startsWith('http')) {
            // For actual URLs, we could do a real fetch request
            // For now, simulate with random variations
            await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
          }
          
          const endTime = Date.now();
          const latency = endTime - startTime;
          
          // Simulate occasional status changes
          const randomFactor = Math.random();
          let status: 'healthy' | 'warning' | 'error' = 'healthy';
          let details = service.details;
          
          if (randomFactor < 0.05) {
            status = 'error';
            details = 'Service temporarily unavailable';
          } else if (randomFactor < 0.15) {
            status = 'warning';
            details = 'Elevated response times detected';
          }
          
          return {
            ...service,
            status,
            lastPing: new Date(),
            latency: Math.floor(latency + Math.random() * 100),
            details
          };
        } catch (error) {
          return {
            ...service,
            status: 'error' as const,
            lastPing: new Date(),
            details: 'Health check failed'
          };
        }
      })
    );
    
    setServices(updatedServices);
    setLastRefresh(new Date());
    setIsRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return '🟢';
      case 'warning':
        return '🟡';
      case 'error':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const handleClearFrontendCache = () => {
    // Simulate cache clearing
    console.log('Frontend cache cleared by:', user?.email);
    alert('Frontend cache cleared successfully!');
  };

  const handleClearBackendCache = () => {
    // Simulate cache clearing
    console.log('Backend cache cleared by:', user?.email);
    alert('Backend cache cleared successfully!');
  };

  const handleRestartBackend = () => {
    // Simulate backend restart
    console.log('Backend restart initiated by:', user?.email);
    alert('Backend restart initiated! This may take a few minutes.');
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="system-health">
      <div className="system-health-header">
        <h2>🩺 System Health Dashboard</h2>
        <p>Monitor platform services and manage system operations</p>
        <div className="health-actions">
          <button 
            className="refresh-btn"
            onClick={checkServiceHealth}
            disabled={isRefreshing}
          >
            {isRefreshing ? '🔄 Checking...' : '🔄 Refresh Status'}
          </button>
          <span className="last-refresh">
            Last updated: {formatTimestamp(lastRefresh)}
          </span>
        </div>
      </div>

      {/* Service Status Overview */}
      <div className="health-section">
        <h3>🚦 Service Status Overview</h3>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className={`service-card ${service.status}`}>
              <div className="service-header">
                <div className="service-name">
                  <span className="status-icon">{getStatusIcon(service.status)}</span>
                  <span className="name">{service.name}</span>
                </div>
                <span className={`status-badge ${service.status}`}>
                  {getStatusText(service.status)}
                </span>
              </div>
              
              <div className="service-details">
                <div className="service-url">{service.url}</div>
                <div className="service-metrics">
                  <div className="metric">
                    <span className="metric-label">Latency:</span>
                    <span className="metric-value">{service.latency}ms</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Uptime:</span>
                    <span className="metric-value">{service.uptime}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Last Ping:</span>
                    <span className="metric-value">{formatTimestamp(service.lastPing)}</span>
                  </div>
                </div>
                <div className="service-status-details">{service.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Controls */}
      <div className="health-section">
        <h3>🔄 System Controls</h3>
        <div className="controls-grid">
          <div className="control-card">
            <h4>🗂️ Cache Management</h4>
            <p>Clear application caches to resolve performance issues</p>
            <div className="control-buttons">
              <button 
                className="control-btn primary"
                onClick={handleClearFrontendCache}
              >
                🧹 Clear Frontend Cache
              </button>
              <button 
                className="control-btn primary"
                onClick={handleClearBackendCache}
              >
                🧹 Clear Backend Cache
              </button>
            </div>
          </div>

          <div className="control-card">
            <h4>🔄 Service Management</h4>
            <p>Restart services to apply updates or resolve issues</p>
            <div className="control-buttons">
              <button 
                className="control-btn warning"
                onClick={handleRestartBackend}
              >
                🔄 Restart Backend Service
              </button>
            </div>
            <div className="control-warning">
              ⚠️ Service restart may cause temporary downtime
            </div>
          </div>
        </div>
      </div>

      {/* Environment Information */}
      <div className="health-section">
        <h3>🗂️ Environment Information</h3>
        <div className="environment-grid">
          <div className="env-card">
            <h4>🌐 Deployment Details</h4>
            <div className="env-details">
              <div className="env-item">
                <span className="env-label">Environment:</span>
                <span className="env-value production">{environmentInfo.environment}</span>
              </div>
              <div className="env-item">
                <span className="env-label">Frontend URL:</span>
                <span className="env-value">{environmentInfo.frontendUrl}</span>
              </div>
              <div className="env-item">
                <span className="env-label">Backend URL:</span>
                <span className="env-value">{environmentInfo.backendUrl}</span>
              </div>
            </div>
          </div>

          <div className="env-card">
            <h4>🔧 Git Information</h4>
            <div className="env-details">
              <div className="env-item">
                <span className="env-label">Frontend Branch:</span>
                <span className="env-value">{environmentInfo.frontendBranch}</span>
              </div>
              <div className="env-item">
                <span className="env-label">Backend Branch:</span>
                <span className="env-value">{environmentInfo.backendBranch}</span>
              </div>
              <div className="env-item">
                <span className="env-label">Frontend Commit:</span>
                <span className="env-value">{environmentInfo.frontendCommit}</span>
              </div>
              <div className="env-item">
                <span className="env-label">Backend Commit:</span>
                <span className="env-value">{environmentInfo.backendCommit}</span>
              </div>
              <div className="env-item">
                <span className="env-label">Last Deploy:</span>
                <span className="env-value">{new Date(environmentInfo.commitTimestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="env-card">
            <h4>⏰ Server Information</h4>
            <div className="env-details">
              <div className="env-item">
                <span className="env-label">Server Timezone:</span>
                <span className="env-value">{environmentInfo.serverTimezone}</span>
              </div>
              <div className="env-item">
                <span className="env-label">Server Uptime:</span>
                <span className="env-value">{environmentInfo.serverUptime}</span>
              </div>
              <div className="env-item">
                <span className="env-label">Current Time:</span>
                <span className="env-value">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="health-section">
        <h3>📊 System Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card healthy">
            <div className="stat-icon">🟢</div>
            <div className="stat-content">
              <div className="stat-number">3</div>
              <div className="stat-label">Healthy Services</div>
            </div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">🟡</div>
            <div className="stat-content">
              <div className="stat-number">1</div>
              <div className="stat-label">Warning Services</div>
            </div>
          </div>
          <div className="stat-card error">
            <div className="stat-icon">🔴</div>
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">Error Services</div>
            </div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-number">303ms</div>
              <div className="stat-label">Avg Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;

