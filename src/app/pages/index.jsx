'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import FakePayment from '../components/FakePayments';

export default function Home() {
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [chances, setChances] = useState(5);
  const [message, setMessage] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize the game
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Set the secret number to 3099
      const newSecretNumber = 3099;

      // Check if we have saved data in localStorage
      const savedChances = localStorage.getItem('chances');
      const savedSecretNumber = localStorage.getItem('secretNumber');
      const savedGameStatus = localStorage.getItem('gameStatus');

      if (savedChances && savedSecretNumber && savedGameStatus) {
        setChances(parseInt(savedChances));
        setSecretNumber(parseInt(savedSecretNumber));
        setGameStatus(savedGameStatus);
      } else {
        // Initialize with new data
        setSecretNumber(newSecretNumber);
        localStorage.setItem('secretNumber', newSecretNumber.toString());
        localStorage.setItem('chances', '5');
        localStorage.setItem('gameStatus', 'playing');
      }

      setIsInitialized(true);
    }
  }, []);

  // Update localStorage whenever chances or gameStatus changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('chances', chances.toString());
      localStorage.setItem('gameStatus', gameStatus);
    }
  }, [chances, gameStatus, isInitialized]);

  const handleInputChange = (e) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, '');
    setGuess(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!guess || gameStatus !== 'playing') return;

    const userGuess = parseInt(guess);

    // Validate guess
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 5000) {
      setMessage('Please enter a valid number between 1 and 5000');
      return;
    }

    // Compare with secret number
    if (userGuess === secretNumber) {
      setMessage('Congratulations! You won $10,000!');
      setGameStatus('won');
      setShowHint(false);
    } else {
      // Provide hint
      const newHint = userGuess > secretNumber ? 'Too high!' : 'Too low!';
      setHint(newHint);
      setShowHint(true);

      // Reduce chances
      const newChances = chances - 1;
      setChances(newChances);

      if (newChances <= 0) {
        setMessage('You ran out of chances!');
        setGameStatus('lost');
      } else {
        setMessage(`Wrong guess! ${newChances} ${newChances === 1 ? 'chance' : 'chances'} left.`);
      }
    }

    setGuess('');
  };

  const resetGame = () => {
    const newSecretNumber = 3099; // Reset to 3099
    setSecretNumber(newSecretNumber);
    setChances(5);
    setMessage('');
    setGameStatus('playing');
    setShowHint(false);

    // Update localStorage
    localStorage.setItem('secretNumber', newSecretNumber.toString());
    localStorage.setItem('chances', '5');
    localStorage.setItem('gameStatus', 'playing');
  };

  const addChance = () => {
    const newChances = chances + 1;
    setChances(newChances);
    setGameStatus('playing');
    setMessage(`You now have ${newChances} ${newChances === 1 ? 'chance' : 'chances'}.`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <Head>
        <title>Guess the Number - Win $10,000!</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="absolute top-4 right-6 bg-gradient-to-r from-yellow-500 to-yellow-300 p-2 px-4 rounded-lg shadow-lg">
        <span className="text-gray-900 font-bold">Prize: $10,000</span>
      </div>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center mt-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Guess The Number
          </h1>
          <p className="text-gray-400 mb-8">Guess a number between 1 and 5000. You have {chances} chances.</p>

          {/* Progress bar for chances */}
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(chances / 5) * 100}%` }}
            ></div>
          </div>

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex mb-4">
              <input
                type="text"
                value={guess}
                onChange={handleInputChange}
                placeholder="Enter your guess..."
                disabled={gameStatus !== 'playing'}
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                max="5000"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={gameStatus !== 'playing'}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-r-lg font-medium disabled:opacity-50"
              >
                Guess
              </motion.button>
            </div>
          </form>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-4 py-2 px-4 rounded-lg ${
                  hint === 'Too high!' ? 'bg-red-900/40 text-red-300' : 'bg-blue-900/40 text-blue-300'
                }`}
              >
                <p>{hint}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 py-2 px-4 rounded-lg bg-gray-800"
              >
                <p>{message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            {gameStatus === 'lost' && (
              <FakePayment onSuccess={addChance} />
            )}

            {(gameStatus === 'won' || gameStatus === 'lost') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
              >
                Play Again
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Winning animation */}
        <AnimatePresence>
          {gameStatus === 'won' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={resetGame}
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{
                  scale: [0.8, 1.1, 1],
                  rotate: [-5, 5, 0],
                  transition: { duration: 0.5 }
                }}
                className="bg-gradient-to-br from-purple-600 to-indigo-800 p-10 rounded-xl shadow-2xl text-center max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-4xl font-bold mb-4 text-white">CONGRATULATIONS!</h2>
                <p className="text-xl mb-6 text-purple-200">You've won the grand prize of</p>
                <p className="text-6xl font-extrabold mb-4 text-yellow-300">$10,000</p>
                <p className='mb-8 text-sm'>Send your account details to ianndiormel@gmail.com</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="bg-white text-purple-800 px-6 py-3 rounded-lg font-bold shadow-lg"
                >
                  Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-4 text-gray-500 text-center text-sm">
        © 2025 Number Guessing Game | Try your luck to win the prize!
      </footer>
    </div>
  );
}