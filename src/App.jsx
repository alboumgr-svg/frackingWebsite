import { useState, useEffect, useRef } from 'react'

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

  const generateNewTarget = () => {
    setTargetSpot({
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60
    })
  }

  const checkIfFound = (machineX, machineY) => {
    const distance = Math.sqrt(
      Math.pow(machineX - targetSpot.x, 2) + 
      Math.pow(machineY - targetSpot.y, 2)
    )
    
    // Increased from 8 to 15 for bigger detection zone
    if (distance < 5 && !isFound) {
      setIsFound(true)
      setOilSpurt(true)
      setShowPopup(true)
      
      setTimeout(() => {
        setShowPopup(false)
        setOilSpurt(false)
        setIsFound(false)
        generateNewTarget()
      }, 3000)
    }
  }

  const handleStart = (clientX, clientY) => {
    if (!machineRef.current) return
    
    setHasStarted(true) 

    const rect = machineRef.current.getBoundingClientRect()
    
    setDragOffset({
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2
    })
    setIsDragging(true)
  }

  const handleMove = (clientX, clientY) => {
    if (!isDragging || !machineRef.current) return
    
    const parentRect = machineRef.current.parentElement.getBoundingClientRect()
    
    let newX = ((clientX - dragOffset.x - parentRect.left) / parentRect.width) * 100
    let newY = ((clientY - dragOffset.y - parentRect.top) / parentRect.height) * 100
    
    newX = Math.max(5, Math.min(95, newX))
    newY = Math.max(5, Math.min(90, newY))
    
    setPosition({ x: newX, y: newY })
    // Check while dragging, not just on drop
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
      
      {/* Game area */}
      <div className="relative w-full h-screen touch-none select-none" style={{ paddingBottom: '120px' }}>

      {/* Instructions at top */}
      {!hasStarted && (
        <div className="absolute top-8 left-0 right-0 text-center z-50 px-4">
          <p className="text-gray-800 text-lg md:text-2xl font-medium">
            Click and drag the fracker to the oil spot for a surprise!
          </p>
        </div>
      )}  

      {/* Visible oil spot target */}
      <div
        className="absolute w-16 h-16 md:w-20 md:h-20 pointer-events-none"
        style={{
          left: `${targetSpot.x}%`,
          top: `${targetSpot.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        {/* Main oil splatter */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 45% 45%, rgba(20,15,10,0.95) 0%, rgba(15,10,8,0.85) 40%, rgba(10,8,6,0.6) 70%, transparent 100%)',
            filter: 'blur(1px)',
          }}
        />
        
        {/* Irregular splatter edges */}
        <div className="absolute w-6 h-6 bg-black/70 rounded-full blur-sm" 
            style={{ top: '-10%', left: '60%' }} />
        <div className="absolute w-4 h-4 bg-black/60 rounded-full blur-sm" 
            style={{ top: '70%', left: '-5%' }} />
        <div className="absolute w-5 h-5 bg-black/65 rounded-full blur-sm" 
            style={{ top: '65%', right: '5%' }} />
        <div className="absolute w-3 h-3 bg-black/50 rounded-full blur-sm" 
            style={{ top: '10%', left: '10%' }} />
        
        {/* Dark center */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(5,5,5,0.9) 0%, rgba(15,10,8,0.7) 30%, transparent 60%)',
          }}
        />
        
        {/* Subtle shine on oil */}
        <div 
          className="absolute opacity-20"
          style={{
            top: '20%',
            left: '30%',
            width: '30%',
            height: '20%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)',
            filter: 'blur(2px)',
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
            zIndex: 100, // Always on top, above disclaimer
          }}
        >
          <div className="relative w-full h-full select-none pointer-events-none">
            {/* Derrick legs */}
            <div className="absolute bottom-0 left-1/4 w-0.5 md:w-1 h-3/4 bg-gray-800"
                 style={{ transform: 'skewX(-6deg)' }} />
            <div className="absolute bottom-0 right-1/4 w-0.5 md:w-1 h-3/4 bg-gray-800"
                 style={{ transform: 'skewX(6deg)' }} />
            
            {/* Cross beams */}
            <div className="absolute w-1/2 h-0.5 bg-gray-700 left-1/4"
                 style={{ top: '25%' }} />
            <div className="absolute w-1/2 h-0.5 bg-gray-700 left-1/4"
                 style={{ top: '50%' }} />
            <div className="absolute w-1/2 h-0.5 bg-gray-700 left-1/4"
                 style={{ top: '75%' }} />
            
            {/* Platform */}
            <div className="absolute bottom-0 w-full h-5 md:h-7 bg-gray-900 rounded-sm border border-gray-950" />
            
            {/* Drill bit */}
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 md:w-2 h-2 md:h-3 bg-gray-950 ${
              oilSpurt ? 'animate-pulse' : ''
            }`} />
            
            {/* Oil spurting */}
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

        {/* Success popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 px-4">
            <div className="bg-black text-white px-6 py-4 md:px-12 md:py-6 rounded-2xl text-xl md:text-4xl font-bold animate-bounce shadow-2xl">
              Get Fracked Loser!
            </div>
          </div>
        )}
      </div>

      {/* Legal disclaimer at bottom */}
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
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(0.3);
            opacity: 0;
          }
        }
        
        * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  )
}

export default App
