'use client';

import { useState } from 'react';
import { usePayments } from '@/lib/hooks/usePayments';
import { TestTube, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function PaymentTest() {
  const { processPayment, getUSDCBalance, getTransactionStatus, status, isConnected, address } = usePayments();
  const [testResults, setTestResults] = useState<{
    balanceCheck?: { success: boolean; balance?: string; error?: string };
    paymentFlow?: { success: boolean; txHash?: string; error?: string };
    transactionStatus?: { success: boolean; status?: any; error?: string };
  }>({});
  const [isRunningTests, setIsRunningTests] = useState(false);

  const runTests = async () => {
    setIsRunningTests(true);
    setTestResults({});

    // Test 1: Check USDC Balance
    console.log('🧪 Testing USDC balance check...');
    try {
      const balance = await getUSDCBalance();
      setTestResults(prev => ({
        ...prev,
        balanceCheck: { success: true, balance: balance || '0' }
      }));
      console.log('✅ Balance check successful:', balance);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => ({
        ...prev,
        balanceCheck: { success: false, error: errorMsg }
      }));
      console.log('❌ Balance check failed:', errorMsg);
    }

    // Test 2: Test Payment Flow (with small amount)
    console.log('🧪 Testing payment flow...');
    try {
      const testPayment = {
        amount: 0.01, // Very small test amount
        recipient: '0x742d35Cc6634C0532925a3b8D0C9C0C0C0C0C0C0', // Test recipient
        description: 'Test payment for x402 integration',
        gigId: 'test-gig-1',
      };

      const result = await processPayment(testPayment);
      
      if (result.success && result.transactionHash) {
        setTestResults(prev => ({
          ...prev,
          paymentFlow: { success: true, txHash: result.transactionHash }
        }));
        console.log('✅ Payment flow successful:', result.transactionHash);

        // Test 3: Check Transaction Status
        console.log('🧪 Testing transaction status check...');
        try {
          const txStatus = await getTransactionStatus(result.transactionHash);
          setTestResults(prev => ({
            ...prev,
            transactionStatus: { success: true, status: txStatus }
          }));
          console.log('✅ Transaction status check successful:', txStatus);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          setTestResults(prev => ({
            ...prev,
            transactionStatus: { success: false, error: errorMsg }
          }));
          console.log('❌ Transaction status check failed:', errorMsg);
        }
      } else {
        setTestResults(prev => ({
          ...prev,
          paymentFlow: { success: false, error: result.error || 'Payment failed' }
        }));
        console.log('❌ Payment flow failed:', result.error);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setTestResults(prev => ({
        ...prev,
        paymentFlow: { success: false, error: errorMsg }
      }));
      console.log('❌ Payment flow failed:', errorMsg);
    }

    setIsRunningTests(false);
  };

  const TestResult = ({ 
    title, 
    result 
  }: { 
    title: string; 
    result?: { success: boolean; error?: string; [key: string]: any } 
  }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-textPrimary">{title}</span>
      {!result ? (
        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
      ) : result.success ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-600" />
      )}
    </div>
  );

  return (
    <div className="card">
      <div className="flex items-center space-x-3 mb-4">
        <TestTube className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-textPrimary">x402 Payment Integration Test</h3>
      </div>

      {/* Connection Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-textSecondary">Wallet Connection</span>
          <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        {address && (
          <div className="text-xs font-mono text-textSecondary">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
        )}
      </div>

      {/* Test Results */}
      <div className="space-y-3 mb-4">
        <TestResult title="USDC Balance Check" result={testResults.balanceCheck} />
        <TestResult title="Payment Flow" result={testResults.paymentFlow} />
        <TestResult title="Transaction Status" result={testResults.transactionStatus} />
      </div>

      {/* Test Details */}
      {Object.keys(testResults).length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-textPrimary mb-2">Test Details</h4>
          <div className="space-y-2 text-xs">
            {testResults.balanceCheck && (
              <div>
                <span className="font-medium">Balance: </span>
                {testResults.balanceCheck.success 
                  ? `${testResults.balanceCheck.balance} USDC`
                  : testResults.balanceCheck.error
                }
              </div>
            )}
            {testResults.paymentFlow && (
              <div>
                <span className="font-medium">Payment: </span>
                {testResults.paymentFlow.success 
                  ? `TX: ${testResults.paymentFlow.txHash?.slice(0, 10)}...`
                  : testResults.paymentFlow.error
                }
              </div>
            )}
            {testResults.transactionStatus && (
              <div>
                <span className="font-medium">Status: </span>
                {testResults.transactionStatus.success 
                  ? `${testResults.transactionStatus.status?.status} (${testResults.transactionStatus.status?.confirmations} confirmations)`
                  : testResults.transactionStatus.error
                }
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {status.error && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-600">{status.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Run Tests Button */}
      <button
        onClick={runTests}
        disabled={!isConnected || isRunningTests || status.isLoading}
        className="w-full flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRunningTests || status.isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Running Tests...</span>
          </>
        ) : (
          <>
            <TestTube className="w-4 h-4" />
            <span>Run x402 Integration Tests</span>
          </>
        )}
      </button>

      {!isConnected && (
        <p className="text-sm text-textSecondary text-center mt-2">
          Please connect your wallet to run tests
        </p>
      )}
    </div>
  );
}
