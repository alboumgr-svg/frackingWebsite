import { useState, useEffect, useRef } from 'react'

const generateOilBlob = () => {
  // Creating a more organic "blob" using border radius and multiple layers
  return {
    rotation: Math.random() * 360,
    borderRadius: `${40 + Math.random() * 20}% ${35 + Math.random() * 25}% ${45 + Math.random() * 20}% ${30 + Math.random() * 30}% / ${35 + Math.random() * 25}% ${45 + Math.random() * 20}% ${30 + Math.random() * 30}% ${40 + Math.random() * 20}%`,
    splatter: Array.from({ length: 6 }).map(() => ({
      size: 15 + Math.random() * 20,
      x: -20 + Math.random() * 140,
      y: -20 + Math.random() * 140,
      radius: `${40 + Math.random() * 20}%`
    }))
  }
}

const successMessages = [
  "Nice fracking job!",
  "Good fracking work!",
  "Frack-tastic effort!",
  "Legendary fracking!",
  "Keep on fracking!",
  "Frack to the future!",
  "You're a fracking natural!",
  "Absolute fracking genius!",
  "That's some deep fracking!",
  "Frack me, that was fast!",
  "You fracked that hole perfectly!",
  "The best fracker in the patch!",
  "Frack it like you mean it!",
  "Mother Earth felt that one!",
  "Fracking masterclass!",
  "Don't stop fracking now!",
  "You really know your way around a drill!",
  "That's some high-pressure fracking!",
  "You're fracking unstoppable!",
  "Frack yeah!",
  "Drill baby, drill!",
  "A fracking master at work!",
  "You've got the fracking touch!",
  "Total fracking domination!"
];

function App() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [targetSpot, setTargetSpot] = useState({ x: 75, y: 60 })
  const [isFound, setIsFound] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [oilSpurt, setOilSpurt] = useState(false)
  const machineRef = useRef(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [oilBlob, setOilBlob] = useState(generateOilBlob())
  
  // Growth, losing, and difficulty states
  const [oilScale, setOilScale] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [difficulty, setDifficulty] = useState(1)
  const [currentMessage, setCurrentMessage] = useState(successMessages[0]);

  const generateNewTarget = () => {
    setOilBlob(generateOilBlob())
    setOilScale(1) // Reset growth for next round
    setTargetSpot({
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 45 
    })
  }

  // Handle rapid oil growth with difficulty scaling
  useEffect(() => {
    if (gameOver || isFound) return;

    const interval = setInterval(() => {
      setOilScale(prev => {
        // Increases growth speed based on how many you've successfully fracked
        const next = prev + (0.03 * difficulty);
        if (next > 35) { 
          setGameOver(true);
          clearInterval(interval);
        }
        return next;
      });
    }, 40); // 40ms for very smooth, rapid expansion

    return () => clearInterval(interval);
  }, [gameOver, isFound, targetSpot, difficulty]);

  const checkIfFound = (machineX, machineY) => {
    const distance = Math.sqrt(
      Math.pow(machineX - targetSpot.x, 2) + 
      Math.pow(machineY - targetSpot.y, 2)
    );
    
    if (distance < 6 && !isFound && !gameOver) {
      // Pick a random message from the list
      const randomMsg = successMessages[Math.floor(Math.random() * successMessages.length)];
      setCurrentMessage(randomMsg); // Set the new message
      
      setIsFound(true);
      setOilSpurt(true);
      setShowPopup(true);
      // Increase difficulty for the next round
      setDifficulty(prev => prev + 0.5)
      
      setTimeout(() => {
        setShowPopup(false)
        setOilSpurt(false)
        setIsFound(false)
        generateNewTarget()
      }, 2500)
    }
  }

  const handleStart = (clientX, clientY) => {
    if (!machineRef.current || gameOver) return
    
    setHasStarted(true) 
    const rect = machineRef.current.getBoundingClientRect()
    
    setDragOffset({
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2
    })
    setIsDragging(true)
  }

  const handleMove = (clientX, clientY) => {
    if (!isDragging || !machineRef.current || gameOver) return
    
    const parentRect = machineRef.current.parentElement.getBoundingClientRect()
    
    let newX = ((clientX - dragOffset.x - parentRect.left) / parentRect.width) * 100
    let newY = ((clientY - dragOffset.y - parentRect.top) / parentRect.height) * 100
    
    newX = Math.max(5, Math.min(95, newX))
    newY = Math.max(5, Math.min(90, newY))
    
    setPosition({ x: newX, y: newY })
    checkIfFound(newX, newY)
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleEnd)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleEnd)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDragging, dragOffset, position])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      <div className="relative w-full h-screen touch-none select-none" style={{ paddingBottom: '120px' }}>

      {!hasStarted && (
        <div className="absolute top-8 left-0 right-0 text-center z-50 px-4">
          <p className="text-gray-800 text-lg md:text-2xl font-black uppercase tracking-tighter">
            Hurry! The oil is rising! Drag the Fracker to the center of oil!
          </p>
        </div>
      )}  

      {/* Improved Rapid-Growth Oil Spot */}
      <div
        className="absolute w-16 h-16 md:w-20 md:h-20 pointer-events-none"
        style={{
          left: `${targetSpot.x}%`,
          top: `${targetSpot.y}%`,
          transform: `translate(-50%, -50%) scale(${oilScale})`,
          // Removed standard transition to make the expansion feel raw and instant
          zIndex: 1,
        }}
      >
        {/* Organic Base Layer */}
        <div 
          className="absolute inset-0 bg-black"
          style={{
            borderRadius: oilBlob.borderRadius,
            transform: `rotate(${oilBlob.rotation}deg)`,
          }}
        />
        
        {/* Extra droplets for organic feel */}
        {oilBlob.splatter.map((s, i) => (
          <div
            key={i}
            className="absolute bg-black"
            style={{
              width: `${s.size}%`,
              height: `${s.size}%`,
              top: `${s.y}%`,
              left: `${s.x}%`,
              borderRadius: s.radius,
            }}
          />
        ))}

        {/* Interior Highlight (Sheen) */}
        <div 
          className="absolute bg-gray-900"
          style={{
            inset: '15%',
            borderRadius: oilBlob.borderRadius,
            opacity: 0.5
          }}
        />
      </div>

        {/* Draggable fracking machine */}
        <div
          ref={machineRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`absolute w-16 h-20 md:w-20 md:h-28 cursor-grab active:cursor-grabbing touch-none transition-transform select-none ${
            isDragging ? 'scale-110' : 'scale-100'
          }`}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            zIndex: 100, 
            visibility: gameOver ? 'hidden' : 'visible'
          }}
        >
          <div className="relative w-full h-full select-none pointer-events-none">
            <div className="absolute bottom-0 left-1/4 w-0.5 md:w-1 h-3/4 bg-gray-800"
                 style={{ transform: 'skewX(-6deg)' }} />
            <div className="absolute bottom-0 right-1/4 w-0.5 md:w-1 h-3/4 bg-gray-800"
                 style={{ transform: 'skewX(6deg)' }} />
            
            <div className="absolute w-1/2 h-0.5 bg-gray-700 left-1/4"
                 style={{ top: '25%' }} />
            <div className="absolute w-1/2 h-0.5 bg-gray-700 left-1/4"
                 style={{ top: '50%' }} />
            <div className="absolute w-1/2 h-0.5 bg-gray-700 left-1/4"
                 style={{ top: '75%' }} />
            
            <div className="absolute bottom-0 w-full h-5 md:h-7 bg-gray-900 rounded-sm border border-gray-950" />
            
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 md:w-2 h-2 md:h-3 bg-gray-950 ${
              oilSpurt ? 'animate-pulse' : ''
            }`} />
            
            {oilSpurt && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-900 rounded-full"
                    style={{
                      left: `${-6 + Math.random() * 12}px`,
                      animation: `spurt ${0.4 + Math.random() * 0.3}s ease-out infinite`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popups */}
        {(showPopup || gameOver) && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[200] px-4">
            <div className="bg-black text-white px-6 py-4 md:px-12 md:py-6 rounded-2xl text-xl md:text-4xl font-black uppercase italic animate-bounce shadow-2xl border-4 border-amber-900">
              {gameOver ? "Congrats Frack-tard, you lost!" : currentMessage}
              {gameOver && (
                <button 
                  onClick={() => {
                    setGameOver(false); 
                    setDifficulty(1); 
                    generateNewTarget();
                  }}
                  className="block mt-4 text-sm bg-white text-black px-4 py-2 rounded-full pointer-events-auto mx-auto font-bold"
                >
                  RETRY
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-yellow-50 border-t-2 border-yellow-200 px-4 py-4 md:py-6" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 border-2 border-yellow-600 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-yellow-600 text-xs md:text-sm font-bold">!</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-yellow-800 font-semibold text-xs md:text-sm mb-1">Legal Disclaimer</h4>
              <p className="text-yellow-700 text-xs md:text-sm leading-relaxed">
                This is a parody website. Do not actually go frack yourself. Do, however, try to Frack your backyard. GetFracked™ is not responsible for 
                structural damage, angry neighbors, contaminated groundwater, property value collapse, or visits 
                from federal regulatory agencies. Consult local geological surveys before drilling. Objects in mirror may be closer than they appear. Please drink responsibly. 
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spurt {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) scale(0.3); opacity: 0; }
        }
        * { -webkit-user-select: none; user-select: none; }
      `}</style>
    </div>
  )
}

export default App