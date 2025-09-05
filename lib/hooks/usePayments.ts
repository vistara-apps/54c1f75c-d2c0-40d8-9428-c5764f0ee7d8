'use client';

import { useState, useCallback } from 'react';
import { useWalletClient, useAccount, usePublicClient } from 'wagmi';
import { base } from 'wagmi/chains';
import { parseUnits, formatUnits } from 'viem';
import axios from 'axios';

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export interface PaymentRequest {
  amount: number; // Amount in USDC
  recipient: string; // Recipient address
  description?: string;
  gigId?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface PaymentStatus {
  isLoading: boolean;
  error: string | null;
  lastTransaction?: string;
}

export function usePayments() {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  
  const [status, setStatus] = useState<PaymentStatus>({
    isLoading: false,
    error: null,
  });

  // Initialize x402 axios client
  const x402Client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_X402_API_URL || 'https://api.x402.com',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_X402_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const processPayment = useCallback(async (
    paymentRequest: PaymentRequest
  ): Promise<PaymentResult> => {
    if (!walletClient || !address || !isConnected) {
      return {
        success: false,
        error: 'Wallet not connected',
      };
    }

    if (!publicClient) {
      return {
        success: false,
        error: 'Public client not available',
      };
    }

    setStatus({ isLoading: true, error: null });

    try {
      // Convert amount to USDC decimals (6 decimals)
      const amountInWei = parseUnits(paymentRequest.amount.toString(), 6);

      // Check USDC balance
      const balance = await publicClient.readContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
        functionName: 'balanceOf',
        args: [address],
      });

      if (balance < amountInWei) {
        const balanceFormatted = formatUnits(balance, 6);
        throw new Error(`Insufficient USDC balance. Available: ${balanceFormatted} USDC`);
      }

      // Check allowance for x402 contract (if needed)
      // This would be the x402 contract address that handles payments
      const x402ContractAddress = process.env.NEXT_PUBLIC_X402_CONTRACT_ADDRESS;
      
      if (x402ContractAddress) {
        const allowance = await publicClient.readContract({
          address: USDC_CONTRACT_ADDRESS,
          abi: [
            {
              name: 'allowance',
              type: 'function',
              stateMutability: 'view',
              inputs: [
                { name: 'owner', type: 'address' },
                { name: 'spender', type: 'address' },
              ],
              outputs: [{ name: '', type: 'uint256' }],
            },
          ],
          functionName: 'allowance',
          args: [address, x402ContractAddress as `0x${string}`],
        });

        // If allowance is insufficient, request approval
        if (allowance < amountInWei) {
          const approveTx = await walletClient.writeContract({
            address: USDC_CONTRACT_ADDRESS,
            abi: [
              {
                name: 'approve',
                type: 'function',
                stateMutability: 'nonpayable',
                inputs: [
                  { name: 'spender', type: 'address' },
                  { name: 'amount', type: 'uint256' },
                ],
                outputs: [{ name: '', type: 'bool' }],
              },
            ],
            functionName: 'approve',
            args: [x402ContractAddress as `0x${string}`, amountInWei],
          });

          // Wait for approval confirmation
          await publicClient.waitForTransactionReceipt({
            hash: approveTx,
            confirmations: 1,
          });
        }
      }

      // Process payment through x402 (simplified implementation)
      try {
        const paymentResponse = await x402Client.post('/payments', {
          amount: paymentRequest.amount,
          currency: 'USDC',
          network: 'base',
          sender: address,
          recipient: paymentRequest.recipient,
          description: paymentRequest.description,
          metadata: {
            gigId: paymentRequest.gigId,
            timestamp: Date.now(),
          },
        });

        // Check if x402 API responded successfully
        if (paymentResponse.status !== 200) {
          console.warn('x402 API warning:', paymentResponse.status);
        }
      } catch (x402Error) {
        // Log x402 error but continue with direct transfer
        console.warn('x402 API unavailable, proceeding with direct transfer:', x402Error);
      }

      // Execute the actual transfer
      const transferTx = await walletClient.writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ],
        functionName: 'transfer',
        args: [paymentRequest.recipient as `0x${string}`, amountInWei],
      });

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: transferTx,
        confirmations: 2, // Wait for 2 confirmations for security
      });

      if (receipt.status === 'success') {
        setStatus({ 
          isLoading: false, 
          error: null, 
          lastTransaction: transferTx 
        });

        return {
          success: true,
          transactionHash: transferTx,
        };
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setStatus({ 
        isLoading: false, 
        error: errorMessage 
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [walletClient, address, isConnected, publicClient, x402Client]);

  const getTransactionStatus = useCallback(async (txHash: string) => {
    if (!publicClient) return null;

    try {
      const receipt = await publicClient.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });
      
      return {
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        confirmations: await publicClient.getBlockNumber() - receipt.blockNumber + BigInt(1),
      };
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return null;
    }
  }, [publicClient]);

  const getUSDCBalance = useCallback(async (): Promise<string | null> => {
    if (!publicClient || !address) return null;

    try {
      const balance = await publicClient.readContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
        functionName: 'balanceOf',
        args: [address],
      });

      return formatUnits(balance, 6);
    } catch (error) {
      console.error('Error getting USDC balance:', error);
      return null;
    }
  }, [publicClient, address]);

  return {
    processPayment,
    getTransactionStatus,
    getUSDCBalance,
    status,
    isConnected,
    address,
  };
}
