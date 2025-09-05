# x402 Payment Integration

This document describes the implementation of x402 payment flow integration in the GigFlow application.

## Overview

The x402 integration enables secure USDC payments on the Base network using wagmi wallet client and x402-axios library. This implementation provides:

- ✅ USDC balance checking
- ✅ Payment processing with x402
- ✅ Transaction confirmation (2 confirmations for security)
- ✅ Error handling and user feedback
- ✅ Integration with wagmi useWalletClient

## Architecture

### Components

1. **`usePayments` Hook** (`lib/hooks/usePayments.ts`)
   - Core payment logic using wagmi and x402-axios
   - USDC balance checking
   - Payment processing with proper error handling
   - Transaction status monitoring

2. **`PaymentModal` Component** (`components/PaymentModal.tsx`)
   - User interface for payment confirmation
   - Real-time balance display
   - Transaction status updates
   - Error handling and user feedback

3. **`PaymentTest` Component** (`components/PaymentTest.tsx`)
   - End-to-end testing interface
   - Validates all payment flow components
   - Useful for development and debugging

### Integration Points

- **GigCard Component**: Added "Pay" button that opens payment modal
- **Providers**: Enhanced with proper wagmi configuration for Base network
- **Environment Variables**: Added x402 API configuration

## Configuration

### Environment Variables

```bash
# x402 Payment Integration
NEXT_PUBLIC_X402_API_URL=https://api.x402.com
NEXT_PUBLIC_X402_API_KEY=your_x402_api_key_here
NEXT_PUBLIC_X402_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### Network Configuration

- **Network**: Base (Chain ID: 8453)
- **USDC Contract**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Confirmations**: 2 blocks for security

## Usage

### Basic Payment Flow

```typescript
import { usePayments } from '@/lib/hooks/usePayments';

function MyComponent() {
  const { processPayment, status, isConnected } = usePayments();

  const handlePayment = async () => {
    const result = await processPayment({
      amount: 50, // USDC amount
      recipient: '0x742d35Cc6634C0532925a3b8D0C9C0C0C0C0C0C0',
      description: 'Payment for gig work',
      gigId: 'gig-123',
    });

    if (result.success) {
      console.log('Payment successful:', result.transactionHash);
    } else {
      console.error('Payment failed:', result.error);
    }
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={!isConnected || status.isLoading}
    >
      Pay with USDC
    </button>
  );
}
```

### Using the Payment Modal

```typescript
import { PaymentModal } from '@/components/PaymentModal';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  const paymentRequest = {
    amount: 100,
    recipient: '0x...',
    description: 'Gig payment',
    gigId: 'gig-123',
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Pay Now
      </button>
      
      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        paymentRequest={paymentRequest}
        onSuccess={(txHash) => console.log('Success:', txHash)}
        onError={(error) => console.error('Error:', error)}
      />
    </>
  );
}
```

## Testing

### Automated Testing

The `PaymentTest` component provides comprehensive testing:

1. **Balance Check**: Verifies USDC balance retrieval
2. **Payment Flow**: Tests end-to-end payment processing
3. **Transaction Status**: Validates transaction confirmation

### Manual Testing

1. Connect wallet to Base network
2. Ensure USDC balance > test amount
3. Click "Run x402 Integration Tests"
4. Verify all tests pass

### Test Scenarios

- ✅ Wallet connection validation
- ✅ Insufficient balance handling
- ✅ Payment approval flow
- ✅ Transaction confirmation
- ✅ Error handling and recovery

## Error Handling

The integration includes comprehensive error handling:

### Common Errors

1. **Wallet Not Connected**
   - Error: "Wallet not connected"
   - Solution: Connect wallet before attempting payment

2. **Insufficient Balance**
   - Error: "Insufficient USDC balance. Available: X USDC"
   - Solution: Add USDC to wallet or reduce payment amount

3. **Transaction Failed**
   - Error: "Transaction failed"
   - Solution: Check network status and try again

4. **x402 API Error**
   - Error: "Payment processing failed"
   - Solution: Verify x402 API configuration

### Error Recovery

- All errors are displayed to users with clear messages
- Failed transactions don't consume gas
- Users can retry payments after resolving issues

## Security Considerations

1. **Transaction Confirmations**: Waits for 2 confirmations before marking as successful
2. **Balance Validation**: Checks USDC balance before attempting payment
3. **Allowance Management**: Handles ERC-20 approvals securely
4. **Error Boundaries**: Prevents crashes from payment failures

## Future Enhancements

- [ ] Multi-token support (ETH, other ERC-20s)
- [ ] Payment scheduling and recurring payments
- [ ] Enhanced transaction monitoring
- [ ] Gas optimization strategies
- [ ] Payment history and receipts

## Troubleshooting

### Common Issues

1. **x402-axios not found**
   - Run: `npm install x402-axios`

2. **Wagmi hooks not working**
   - Ensure proper provider setup in `app/providers.tsx`

3. **Base network not detected**
   - Check wallet network settings
   - Verify Base network is added to wallet

4. **USDC balance shows 0**
   - Confirm wallet has USDC on Base network
   - Check contract address: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### Debug Mode

Enable debug logging by adding to console:

```javascript
localStorage.setItem('debug', 'x402:*');
```

This will show detailed logs for all x402 operations.
