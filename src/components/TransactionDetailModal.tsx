import React from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Completed' | 'Failed';
  userEmail: string;
  paymentMethod: string;
  blockchainTxHash?: string;
  walletAddress?: string;
  metadata?: any;
}

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#28a745';
      case 'Pending': return '#ffc107';
      case 'Failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return '✅';
      case 'Pending': return '⏳';
      case 'Failed': return '❌';
      default: return '❓';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bitcoin': return '₿';
      case 'ethereum': return 'Ξ';
      case 'credit card': return '💳';
      case 'bank transfer': return '🏦';
      default: return '💰';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const openBlockchainExplorer = (txHash: string, method: string) => {
    let explorerUrl = '';
    if (method.toLowerCase() === 'bitcoin') {
      explorerUrl = `https://blockstream.info/tx/${txHash}`;
    } else if (method.toLowerCase() === 'ethereum') {
      explorerUrl = `https://etherscan.io/tx/${txHash}`;
    }
    if (explorerUrl) {
      window.open(explorerUrl, '_blank');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="transaction-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-icon">💳</span>
            <h3>Transaction Details</h3>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Transaction Overview */}
          <div className="transaction-overview">
            <div className="overview-card">
              <div className="overview-main">
                <div className="transaction-id-display">
                  <span className="id-label">Transaction ID</span>
                  <div className="id-value">
                    <span className="id-text">{transaction.id}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(transaction.id)}
                      title="Copy Transaction ID"
                    >
                      📋
                    </button>
                  </div>
                </div>
                
                <div className="amount-display">
                  <span className="amount-value">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </span>
                  <span 
                    className="status-badge large"
                    style={{ backgroundColor: getStatusColor(transaction.status) }}
                  >
                    {getStatusIcon(transaction.status)} {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details Grid */}
          <div className="transaction-details-grid">
            <div className="detail-section">
              <h4>📅 Transaction Information</h4>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">Date & Time</span>
                  <span className="detail-value">{formatDate(transaction.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value">{formatAmount(transaction.amount, transaction.currency)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Currency</span>
                  <span className="detail-value">{transaction.currency}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span 
                    className="detail-value status-badge"
                    style={{ backgroundColor: getStatusColor(transaction.status) }}
                  >
                    {getStatusIcon(transaction.status)} {transaction.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>👤 User Information</h4>
              <div className="detail-items">
                <div className="detail-item">
                  <span className="detail-label">User Email</span>
                  <span className="detail-value">{transaction.userEmail}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-value">
                    {getPaymentMethodIcon(transaction.paymentMethod)} {transaction.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Blockchain Information */}
            {transaction.blockchainTxHash && (
              <div className="detail-section">
                <h4>⛓️ Blockchain Information</h4>
                <div className="detail-items">
                  <div className="detail-item">
                    <span className="detail-label">Transaction Hash</span>
                    <div className="hash-value">
                      <span className="hash-text">{transaction.blockchainTxHash}</span>
                      <div className="hash-actions">
                        <button 
                          className="copy-btn"
                          onClick={() => copyToClipboard(transaction.blockchainTxHash!)}
                          title="Copy Transaction Hash"
                        >
                          📋
                        </button>
                        <button 
                          className="explorer-btn"
                          onClick={() => openBlockchainExplorer(transaction.blockchainTxHash!, transaction.paymentMethod)}
                          title="View on Blockchain Explorer"
                        >
                          🔗
                        </button>
                      </div>
                    </div>
                  </div>
                  {transaction.walletAddress && (
                    <div className="detail-item">
                      <span className="detail-label">Wallet Address</span>
                      <div className="hash-value">
                        <span className="hash-text">{transaction.walletAddress}</span>
                        <button 
                          className="copy-btn"
                          onClick={() => copyToClipboard(transaction.walletAddress!)}
                          title="Copy Wallet Address"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Metadata */}
            {transaction.metadata && (
              <div className="detail-section">
                <h4>📋 Additional Information</h4>
                <div className="detail-items">
                  {Object.entries(transaction.metadata).map(([key, value]) => (
                    <div key={key} className="detail-item">
                      <span className="detail-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span className="detail-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-actions">
          <button className="action-btn secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="action-btn primary"
            onClick={() => window.print()}
          >
            🖨️ Print Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;

