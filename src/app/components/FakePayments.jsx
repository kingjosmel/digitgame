'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

const FakePayment = ({ onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handlePayment}
      disabled={isProcessing}
      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg disabled:opacity-70 relative overflow-hidden"
    >
      {isProcessing && (
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2 }}
          className="absolute left-0 top-0 h-full bg-white/20"
        />
      )}
      {isProcessing ? 'Processing...' : 'Buy Extra Chance (100 Naira)'}
    </motion.button>
  );
};

export default FakePayment;