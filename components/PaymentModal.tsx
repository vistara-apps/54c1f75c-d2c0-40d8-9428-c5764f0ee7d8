'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, AlertCircle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { usePayments, PaymentRequest } from '@/lib/hooks/usePayments';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: PaymentRequest;
  onSuccess?: (transactionHash: string) => void;
  onError?: (error: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  paymentRequest,
  onSuccess,
  onError,
}: PaymentModalProps) {
  const { processPayment, getUSDCBalance, status, isConnected, address } = usePayments();
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isConnected) {
      loadBalance();
    }
  }, [isOpen, isConnected]);

  useEffect(() => {
    if (status.error) {
      setStep('error');
      onError?.(status.error);
    }
  }, [status.error, onError]);

  const loadBalance = async () => {
    const balance = await getUSDCBalance();
    setUsdcBalance(balance);
  };

  const handlePayment = async () => {
    setStep('processing');
    
    const result = await processPayment(paymentRequest);
    
    if (result.success && result.transactionHash) {
      setTransactionHash(result.transactionHash);
      setStep('success');
      onSuccess?.(result.transactionHash);
    } else {
      setStep('error');
      onError?.(result.error || 'Payment failed');
    }
  };

  const handleClose = () => {
    setStep('confirm');
    setTransactionHash(null);
    onClose();
  };

  const openTransaction = () => {
    if (transactionHash) {
      window.open(`https://basescan.org/tx/${transactionHash}`, '_blank');
    }
  };

  if (!isOpen) return null;

  const isBalanceSufficient = usdcBalance ? parseFloat(usdcBalance) >= paymentRequest.amount : false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-textPrimary">
            {step === 'confirm' && 'Confirm Payment'}
            {step === 'processing' && 'Processing Payment'}
            {step === 'success' && 'Payment Successful'}
            {step === 'error' && 'Payment Failed'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-textSecondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'confirm' && (
            <div className="space-y-6">
              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-textSecondary">Amount</span>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-semibold text-textPrimary">
                      {paymentRequest.amount} USDC
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-textSecondary">Recipient</span>
                  <span className="text-sm font-mono text-textPrimary">
                    {paymentRequest.recipient.slice(0, 6)}...{paymentRequest.recipient.slice(-4)}
                  </span>
                </div>

                {paymentRequest.description && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-textSecondary">Description</span>
                    <span className="text-sm text-textPrimary">
                      {paymentRequest.description}
                    </span>
                  </div>
                )}
              </div>

              {/* Wallet Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-textSecondary">Your Wallet</span>
                  <span className="text-sm font-mono text-textPrimary">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-textSecondary">USDC Balance</span>
                  <span className={`text-sm font-semibold ${
                    isBalanceSufficient ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {usdcBalance ? `${usdcBalance} USDC` : 'Loading...'}
                  </span>
                </div>
              </div>

              {/* Warning for insufficient balance */}
              {usdcBalance && !isBalanceSufficient && (
                <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Insufficient Balance</p>
                    <p className="text-sm text-red-600">
                      You need {paymentRequest.amount} USDC but only have {usdcBalance} USDC.
                    </p>
                  </div>
                </div>
              )}

              {/* Network Info */}
              <div className="flex items-center justify-center space-x-2 text-sm text-textSecondary">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Base Network</span>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-textPrimary mb-2">
                  Processing Payment
                </h3>
                <p className="text-textSecondary">
                  Please confirm the transaction in your wallet and wait for confirmation...
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-textPrimary mb-2">
                  Payment Successful!
                </h3>
                <p className="text-textSecondary mb-4">
                  Your payment of {paymentRequest.amount} USDC has been sent successfully.
                </p>
                {transactionHash && (
                  <button
                    onClick={openTransaction}
                    className="flex items-center justify-center space-x-2 text-primary hover:text-primary-dark transition-colors mx-auto"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on BaseScan</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-textPrimary mb-2">
                  Payment Failed
                </h3>
                <p className="text-textSecondary">
                  {status.error || 'An unexpected error occurred during payment processing.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t">
          {step === 'confirm' && (
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={!isConnected || !isBalanceSufficient || status.isLoading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isConnected ? 'Connect Wallet' : 'Confirm Payment'}
              </button>
            </div>
          )}

          {step === 'processing' && (
            <button
              onClick={handleClose}
              className="w-full btn-secondary"
              disabled
            >
              Processing...
            </button>
          )}

          {(step === 'success' || step === 'error') && (
            <button
              onClick={handleClose}
              className="w-full btn-primary"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
