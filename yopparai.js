import React, { useState, useEffect, useRef } from 'react';
import { Beer, Star, Trophy } from 'lucide-react';

export default function DrunkBalanceGame() {
  const [gameState, setGameState] = useState('start'); // start, playing, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [tilt, setTilt] = useState(0); // -100 to 100
  const [speed, setSpeed] = useState(1);
  const [direction, setDirection] = useState(1);
  const [beerCount, setBeerCount] = useState(0);
  const gameLoopRef = useRef(null);
  const tiltLimitRef = useRef(60);

  // ゲームループ
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        setTilt(prev => {
          const newTilt = prev + (direction * speed * 0.8);
          
          // 限界を超えたらゲームオーバー
          if (Math.abs(newTilt) > tiltLimitRef.current) {
            setGameState('gameover');
            if (score > highScore) {
              setHighScore(score);
            }
            return prev;
          }
          
          return newTilt;
        });
        
        setScore(prev => prev + 1);
        
        // スコアに応じてスピードアップ
        if (score > 0 && score % 300 === 0) {
          setSpeed(prev => prev + 0.3);
        }
      }, 50);
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, direction, speed, score, highScore]);

  // ランダムに方向転換
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        setDirection(prev => prev * -1);
      }, 1500 + Math.random() * 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handleTap = () => {
    if (gameState === 'start') {
      setGameState('playing');
      setScore(0);
      setTilt(0);
      setSpeed(1);
      setBeerCount(0);
      tiltLimitRef.current = 60;
    } else if (gameState === 'playing') {
      // タップで反対側に押し戻す
      setTilt(prev => prev * -0.6);
      
      // ビールカウント増加
      setBeerCount(prev => {
        const newCount = prev + 1;
        // 5杯ごとに許容範囲が狭くなる
        if (newCount % 5 === 0) {
          tiltLimitRef.current = Math.max(40, tiltLimitRef.current - 5);
        }
        return newCount;
      });
    } else if (gameState === 'gameover') {
      setGameState('start');
      setTilt(0);
      setBeerCount(0);
      tiltLimitRef.current = 60;
    }
  };

  const getDrunkEmoji = () => {
    const absTilt = Math.abs(tilt);
    if (absTilt < 20) return '😊';
    if (absTilt < 40) return '😵';
    if (absTilt < 55) return '🥴';
    return '😵‍💫';
  };

  const getDifficulty = () => {
    if (beerCount < 10) return '酔い始め';
    if (beerCount < 25) return 'ほろ酔い';
    if (beerCount < 50) return 'かなり酔った';
    return '泥酔状態';
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center overflow-hidden touch-none select-none">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="font-bold">{highScore}</span>
        </div>
        {gameState === 'playing' && (
          <div className="flex items-center gap-2">
            <Beer className="w-5 h-5 text-yellow-300" />
            <span className="font-bold">{beerCount}杯</span>
          </div>
        )}
        {gameState === 'playing' && (
          <div className="text-sm font-bold">
            {Math.floor(score / 20)}m
          </div>
        )}
      </div>

      {/* メインゲーム画面 */}
      <div 
        className="relative w-full max-w-md h-[600px] flex items-end justify-center cursor-pointer"
        onClick={handleTap}
        onTouchStart={(e) => {
          e.preventDefault();
          handleTap();
        }}
      >
        {/* 背景の星 */}
        {gameState === 'playing' && (
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <Star
                key={i}
                className="absolute text-yellow-200 opacity-50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 50}%`,
                  width: `${10 + Math.random() * 10}px`,
                  animation: `twinkle ${1 + Math.random() * 2}s infinite`
                }}
              />
            ))}
          </div>
        )}

        {/* 地面 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-900 to-green-800 border-t-4 border-green-700" />

        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8 z-10">
            <div className="text-6xl mb-4">🍺</div>
            <h1 className="text-4xl font-bold mb-2">酔っ払い</h1>
            <h1 className="text-4xl font-bold mb-6">バランス</h1>
            <p className="text-lg mb-8 opacity-90">
              千鳥足の酔っ払いを<br />
              タップして支えよう！
            </p>
            <div className="bg-yellow-500 text-purple-900 px-8 py-4 rounded-full font-bold text-xl animate-pulse">
              タップしてスタート
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <>
            {/* 危険ゾーン表示 */}
            <div className="absolute top-20 left-0 right-0 flex justify-between px-8">
              <div className={`text-3xl ${tilt < -40 ? 'animate-bounce' : 'opacity-30'}`}>
                ⚠️
              </div>
              <div className={`text-3xl ${tilt > 40 ? 'animate-bounce' : 'opacity-30'}`}>
                ⚠️
              </div>
            </div>

            {/* 難易度表示 */}
            <div className="absolute top-16 left-0 right-0 text-center">
              <div className="inline-block bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm font-bold">
                {getDifficulty()}
              </div>
            </div>

            {/* 酔っ払いキャラクター */}
            <div 
              className="absolute bottom-20 transition-transform duration-100"
              style={{ 
                transform: `rotate(${tilt}deg)`,
                transformOrigin: 'bottom center'
              }}
            >
              <div className="text-8xl">
                {getDrunkEmoji()}
              </div>
              {/* 体 */}
              <div className="flex flex-col items-center -mt-4">
                <div className="w-12 h-16 bg-blue-600 rounded-lg border-4 border-blue-700" />
                {/* 脚 */}
                <div className="flex gap-2 -mt-1">
                  <div className="w-4 h-12 bg-gray-800 rounded" />
                  <div className="w-4 h-12 bg-gray-800 rounded" />
                </div>
              </div>
            </div>

            {/* ビールアイコン */}
            <Beer className="absolute bottom-32 right-8 text-yellow-300 w-8 h-8 animate-bounce" />
          </>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8 bg-black bg-opacity-70 z-10">
            <div className="text-6xl mb-4">😵‍💫</div>
            <h2 className="text-3xl font-bold mb-4">酔いつぶれた！</h2>
            <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
              <div className="text-sm opacity-80 mb-1">歩いた距離</div>
              <div className="text-4xl font-bold mb-4">{Math.floor(score / 20)}m</div>
              <div className="text-sm opacity-80 mb-1">飲んだビール</div>
              <div className="text-3xl font-bold">{beerCount}杯 🍺</div>
            </div>
            {score > highScore && (
              <div className="text-yellow-400 text-xl font-bold mb-4 animate-pulse">
                🎉 新記録！ 🎉
              </div>
            )}
            <div className="bg-yellow-500 text-purple-900 px-8 py-4 rounded-full font-bold text-xl">
              もう一度挑戦
            </div>
          </div>
        )}
      </div>

      {/* 説明 */}
      {gameState === 'playing' && (
        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm opacity-70">
          画面をタップして立て直そう！
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
