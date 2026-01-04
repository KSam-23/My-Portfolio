import React, { useState, useEffect, useRef } from 'react';

const Portfolio = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ghostPos, setGhostPos] = useState({ x: 100, y: 100 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentSection, setCurrentSection] = useState('home');
  const [isBlinking, setIsBlinking] = useState(false);
  const canvasRef = useRef(null);
  const fullName = "Keerthi Samhitha";
  
  // Typewriter effect
  useEffect(() => {
    if (!isLoaded) return;
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullName.length) {
        setTypedText(fullName.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [isLoaded]);

  // Ghost blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ghost following + eye tracking
  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const interval = setInterval(() => {
      setGhostPos(prev => {
        const newX = lerp(prev.x, mousePos.x - 30, 0.06);
        const newY = lerp(prev.y, mousePos.y - 40, 0.06);
        
        const dx = mousePos.x - newX - 30;
        const dy = mousePos.y - newY - 30;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxOffset = 3;
        
        if (dist > 0) {
          setEyeOffset({
            x: (dx / dist) * Math.min(maxOffset, dist / 50),
            y: (dy / dist) * Math.min(maxOffset, dist / 50)
          });
        }
        
        return { x: newX, y: newY };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [mousePos]);

  // Constellation background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight || window.innerHeight * 5;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const animate = (time) => {
      ctx.fillStyle = '#07070d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Nebula
      const nebula = ctx.createRadialGradient(canvas.width * 0.3, canvas.height * 0.2, 0, canvas.width * 0.3, canvas.height * 0.2, canvas.width * 0.5);
      nebula.addColorStop(0, 'rgba(75, 0, 130, 0.12)');
      nebula.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * twinkle, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * twinkle})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(animate);
    
    setTimeout(() => setIsLoaded(true), 100);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Ghost Component
  const Ghost = () => {
    const isHappy = currentSection === 'contact';
    
    return (
      <div style={{
        position: 'fixed',
        left: ghostPos.x,
        top: ghostPos.y,
        zIndex: 1000,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 0 25px rgba(200, 180, 255, 0.6))',
        animation: 'float 3s ease-in-out infinite'
      }}>
        <svg width="65" height="75" viewBox="0 0 65 75" fill="none">
          <defs>
            <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.97)" />
              <stop offset="100%" stopColor="rgba(200,180,255,0.85)" />
            </linearGradient>
          </defs>
          <path
            d="M32.5 5C17 5 5 17 5 32V58C5 60 7 61 9 59L16 52C18 50 21 50 23 52L28 57C30 59 35 59 37 57L42 52C44 50 47 50 49 52L56 59C58 61 60 60 60 58V32C60 17 48 5 32.5 5Z"
            fill="url(#ghostGrad)"
            stroke="rgba(147,112,219,0.4)"
            strokeWidth="1.5"
          />
          <ellipse cx="23" cy="30" rx="7" ry={isBlinking ? 1 : 8} fill="#1a1a2e" style={{ transition: 'ry 0.1s' }} />
          <ellipse cx="42" cy="30" rx="7" ry={isBlinking ? 1 : 8} fill="#1a1a2e" style={{ transition: 'ry 0.1s' }} />
          {!isBlinking && <ellipse cx={23 + eyeOffset.x} cy={30 + eyeOffset.y} rx="3" ry="3.5" fill="white" />}
          {!isBlinking && <ellipse cx={42 + eyeOffset.x} cy={30 + eyeOffset.y} rx="3" ry="3.5" fill="white" />}
          {isHappy ? (
            <path d="M26 44 Q32.5 52 39 44" stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            <ellipse cx="32.5" cy="45" rx="5" ry="4" fill="rgba(255,150,180,0.5)" />
          )}
          <ellipse cx="14" cy="38" rx="4" ry="2.5" fill="rgba(255,150,200,0.3)" />
          <ellipse cx="51" cy="38" rx="4" ry="2.5" fill="rgba(255,150,200,0.3)" />
        </svg>
      </div>
    );
  };

  // Animated Counter Component
  const AnimatedCounter = ({ end, suffix = '', duration = 2000, delay = 0 }) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);

    useEffect(() => {
      const startTimer = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(startTimer);
    }, [delay]);

    useEffect(() => {
      if (!started) return;
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, [started, end, duration]);

    return <span>{count}{suffix}</span>;
  };

  // ==========================================
  // STYLE A: Impact Metrics Hero (Ingram Micro)
  // ==========================================
  const ImpactMetricsExperience = () => {
    const metrics = [
      { value: 15, suffix: '+', label: 'Stakeholders', sublabel: 'Weekly dashboards delivered' },
      { value: 40, suffix: '+', label: 'Issues Resolved', sublabel: 'Root cause analyzed' },
      { value: 11, suffix: '%', label: 'Forecast Accuracy', sublabel: 'Improvement achieved' },
      { value: 20, suffix: '%', label: 'Fewer Requests', sublabel: 'Ad-hoc reporting reduced' },
    ];

    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(20, 15, 35, 0.9) 0%, rgba(10, 10, 20, 0.95) 100%)',
        border: '1px solid rgba(147, 112, 219, 0.3)',
        borderRadius: '24px',
        padding: '3rem',
        marginBottom: '3rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative gradient orb */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(147,112,219,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{
                fontSize: '1.8rem',
                fontFamily: "'Syne', sans-serif",
                fontWeight: '700',
                color: '#fff',
                marginBottom: '0.5rem'
              }}>
                Associate
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: '#c8b4ff',
                fontFamily: "'Space Mono', monospace"
              }}>
                Ingram Micro • Buffalo, NY
              </p>
            </div>
            <span style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontFamily: "'Space Mono', monospace",
              fontWeight: '600'
            }}>
              CURRENT
            </span>
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.9rem',
            marginTop: '0.5rem',
            fontFamily: "'Space Mono', monospace"
          }}>
            June 2025 - December 2025
          </p>
        </div>

        {/* Giant Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {metrics.map((metric, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                background: 'rgba(147, 112, 219, 0.08)',
                borderRadius: '16px',
                border: '1px solid rgba(147, 112, 219, 0.15)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.background = 'rgba(147, 112, 219, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(147, 112, 219, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(147, 112, 219, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(147, 112, 219, 0.15)';
              }}
            >
              <div style={{
                fontSize: '3rem',
                fontFamily: "'Syne', sans-serif",
                fontWeight: '800',
                background: 'linear-gradient(135deg, #fff 0%, #c8b4ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1
              }}>
                <AnimatedCounter end={metric.value} suffix={metric.suffix} delay={i * 200 + 500} />
              </div>
              <div style={{
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: '600',
                marginTop: '0.5rem'
              }}>
                {metric.label}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.75rem',
                marginTop: '0.3rem'
              }}>
                {metric.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Brief context */}
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '1rem',
          lineHeight: '1.8',
          textAlign: 'center',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          Driving data-driven decisions through Power BI dashboards, SQL analytics, and systematic root cause analysis for order operations and financial reconciliation.
        </p>

        {/* Tech Stack */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.8rem',
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          {['Power BI', 'SQL', 'Excel', 'CRM Analytics'].map((tech, i) => (
            <span key={i} style={{
              background: 'rgba(147, 112, 219, 0.2)',
              border: '1px solid rgba(147, 112, 219, 0.3)',
              color: '#c8b4ff',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontFamily: "'Space Mono', monospace"
            }}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // ==========================================
  // STYLE D: Mini Dashboard (Capgemini) - Enhanced
  // ==========================================
  const DashboardExperience = () => {
    const [hoveredKpi, setHoveredKpi] = useState(null);
    const [pipelineStep, setPipelineStep] = useState(0);

    // Animate pipeline
    useEffect(() => {
      const interval = setInterval(() => {
        setPipelineStep(prev => (prev + 1) % 6);
      }, 800);
      return () => clearInterval(interval);
    }, []);

    const kpis = [
      { value: '50M+', label: 'Records', icon: '🗄️', color: '#8b5cf6' },
      { value: '10+', label: 'Data Sources', icon: '🔗', color: '#06b6d4' },
      { value: '50+', label: 'Stakeholders', icon: '👥', color: '#22c55e' },
      { value: '20+', label: 'Clients', icon: '🏢', color: '#f59e0b' },
      { value: '5x', label: 'Faster Decisions', icon: '⚡', color: '#ec4899' },
      { value: '30%', label: 'Query Optimization', icon: '🚀', color: '#14b8a6' },
    ];

    const pipelineNodes = [
      { label: 'Raw Data', icon: '📊', sublabel: '10+ Sources' },
      { label: 'Airflow', icon: '🔄', sublabel: 'ETL Pipeline' },
      { label: 'Python', icon: '🐍', sublabel: 'Transform' },
      { label: 'PostgreSQL', icon: '🗃️', sublabel: '50M+ Records' },
      { label: 'Power BI', icon: '📈', sublabel: 'Visualize' },
      { label: 'Insights', icon: '💡', sublabel: '50+ Stakeholders' },
    ];

    const techStack = [
      { category: 'Languages', items: ['Python', 'SQL', 'DAX', 'M Language'] },
      { category: 'Libraries', items: ['Pandas', 'NumPy'] },
      { category: 'Databases', items: ['PostgreSQL', 'MySQL'] },
      { category: 'ETL', items: ['Apache Airflow', 'Power Query'] },
      { category: 'BI Tools', items: ['Power BI', 'Excel'] },
      { category: 'Other', items: ['Git', 'Agile/Scrum'] },
    ];

    return (
      <div style={{
        background: 'linear-gradient(180deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 18, 0.98) 100%)',
        border: '1px solid rgba(147, 112, 219, 0.25)',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '3rem'
      }}>
        {/* Dashboard Header Bar */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(147, 112, 219, 0.2) 0%, rgba(100, 80, 180, 0.1) 100%)',
          padding: '0.8rem 2rem',
          borderBottom: '1px solid rgba(147, 112, 219, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontFamily: "'Space Mono', monospace" }}>
              capgemini_analytics.pbix
            </span>
          </div>
          <span style={{
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.75rem',
            fontFamily: "'Space Mono', monospace"
          }}>
            Oct 2021 - Aug 2024 • 3 Years
          </span>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '1.5rem 2rem' }}>
          {/* Title Row */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontFamily: "'Syne', sans-serif",
              fontWeight: '700',
              color: '#fff',
              marginBottom: '0.3rem'
            }}>
              Data Analyst
            </h3>
            <p style={{
              color: '#c8b4ff',
              fontSize: '0.95rem',
              fontFamily: "'Space Mono', monospace"
            }}>
              Capgemini • Bengaluru, India
            </p>
          </div>

          {/* Smaller KPI Cards with Emboss Effect */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.8rem',
            marginBottom: '2rem'
          }}>
            {kpis.map((kpi, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredKpi(i)}
                onMouseLeave={() => setHoveredKpi(null)}
                style={{
                  background: hoveredKpi === i 
                    ? `linear-gradient(145deg, rgba(30, 25, 45, 1), rgba(15, 12, 25, 1))`
                    : 'rgba(0,0,0,0.3)',
                  borderRadius: '10px',
                  padding: '0.8rem',
                  borderLeft: `3px solid ${kpi.color}`,
                  cursor: 'default',
                  transform: hoveredKpi === i ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredKpi === i 
                    ? `0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px ${kpi.color}30`
                    : '0 2px 10px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Shine effect on hover */}
                {hoveredKpi === i && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                    animation: 'shine 0.6s ease-out forwards'
                  }} />
                )}
                <div style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>{kpi.icon}</div>
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: hoveredKpi === i ? kpi.color : '#fff',
                  fontFamily: "'Syne', sans-serif",
                  transition: 'color 0.3s ease'
                }}>
                  {kpi.value}
                </div>
                <div style={{
                  fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {kpi.label}
                </div>
              </div>
            ))}
          </div>

          {/* Animated Data Pipeline */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(147, 112, 219, 0.1)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                background: '#22c55e',
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite'
              }} />
              Live Data Pipeline
            </div>

            {/* Pipeline Visualization */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              padding: '1rem 0'
            }}>
              {/* Connection Line */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '8%',
                right: '8%',
                height: '2px',
                background: 'rgba(147, 112, 219, 0.2)',
                transform: 'translateY(-50%)',
                zIndex: 0
              }}>
                {/* Animated data flow */}
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  left: `${(pipelineStep / 5) * 100}%`,
                  width: '30px',
                  height: '6px',
                  background: 'linear-gradient(90deg, transparent, #c8b4ff, #9370db, transparent)',
                  borderRadius: '3px',
                  boxShadow: '0 0 15px #9370db',
                  transition: 'left 0.8s ease-in-out'
                }} />
              </div>

              {/* Pipeline Nodes */}
              {pipelineNodes.map((node, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 1,
                    flex: 1
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: pipelineStep === i 
                      ? 'linear-gradient(135deg, #9370db, #c8b4ff)'
                      : 'rgba(20, 18, 35, 0.9)',
                    border: pipelineStep === i 
                      ? '2px solid #c8b4ff'
                      : '2px solid rgba(147, 112, 219, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    transition: 'all 0.4s ease',
                    boxShadow: pipelineStep === i 
                      ? '0 0 25px rgba(147, 112, 219, 0.6)'
                      : 'none',
                    transform: pipelineStep === i ? 'scale(1.1)' : 'scale(1)'
                  }}>
                    {node.icon}
                  </div>
                  <span style={{
                    color: pipelineStep === i ? '#fff' : 'rgba(255,255,255,0.6)',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                    transition: 'color 0.3s ease'
                  }}>
                    {node.label}
                  </span>
                  <span style={{
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.55rem',
                    textAlign: 'center'
                  }}>
                    {node.sublabel}
                  </span>
                </div>
              ))}
            </div>

            {/* Pipeline Description */}
            <div style={{
              marginTop: '1rem',
              padding: '0.8rem 1rem',
              background: 'rgba(147, 112, 219, 0.1)',
              borderRadius: '8px',
              borderLeft: '3px solid #9370db'
            }}>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                margin: 0
              }}>
                Built automated ETL pipelines processing data from <strong style={{ color: '#c8b4ff' }}>10+ sources</strong>, 
                cutting manual processing time by <strong style={{ color: '#22c55e' }}>25%</strong> and delivering 
                real-time reporting for <strong style={{ color: '#c8b4ff' }}>50+ stakeholders</strong>
              </p>
            </div>
          </div>

          {/* Security Findings Alert */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '45px',
              height: '45px',
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              animation: 'pulse 2s infinite'
            }}>
              🛡️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                300+ Security Vulnerabilities Identified
                <span style={{
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.6rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontWeight: '700'
                }}>
                  CRITICAL
                </span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                Across 20+ client IT infrastructures • Compliance scores improved by <strong style={{ color: '#22c55e' }}>47%</strong>
              </div>
            </div>
          </div>

          {/* Expanded Tech Stack */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            padding: '1.2rem 1.5rem'
          }}>
            <div style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '1rem'
            }}>
              Tech Stack
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              {techStack.map((group, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: '0.65rem',
                    color: '#c8b4ff',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '0.5rem'
                  }}>
                    {group.category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {group.items.map((tech, j) => (
                      <span key={j} style={{
                        background: 'rgba(147, 112, 219, 0.15)',
                        color: 'rgba(255,255,255,0.8)',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '5px',
                        fontSize: '0.7rem',
                        fontFamily: "'Space Mono', monospace",
                        border: '1px solid rgba(147, 112, 219, 0.2)',
                        transition: 'all 0.2s ease'
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Section Title Component
  const SectionTitle = ({ children }) => (
    <h2 style={{
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontFamily: "'Syne', sans-serif",
      fontWeight: '700',
      marginBottom: '3rem',
      background: 'linear-gradient(135deg, #fff 0%, #c8b4ff 50%, #9370db 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      position: 'relative',
      display: 'inline-block'
    }}>
      {children}
      <span style={{
        position: 'absolute',
        bottom: '-8px',
        left: 0,
        width: '80px',
        height: '4px',
        background: 'linear-gradient(90deg, #9370db, transparent)',
        borderRadius: '2px'
      }} />
    </h2>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07070d',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes growWidth {
          from { width: 0; }
          to { width: 20%; }
        }

        @keyframes shine {
          from { left: -100%; }
          to { left: 200%; }
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #07070d; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #9370db, #c8b4ff); border-radius: 3px; }

        .nav-link {
          position: relative;
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
          font-family: 'Space Mono', monospace;
          cursor: pointer;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
        }
        .nav-link:hover, .nav-link.active { color: #c8b4ff; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c8b4ff, transparent);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover::after, .nav-link.active::after { width: 80%; }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />
      <Ghost />

      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1.2rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(7,7,13,0.98) 0%, transparent 100%)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{
          fontSize: '1.8rem',
          fontFamily: "'Syne', sans-serif",
          fontWeight: '700',
          background: 'linear-gradient(135deg, #fff 0%, #c8b4ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          KS
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['home', 'experience', 'projects', 'skills', 'contact'].map(section => (
            <button
              key={section}
              className={`nav-link ${currentSection === section ? 'active' : ''}`}
              onClick={() => {
                setCurrentSection(section);
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '900px',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s ease'
        }}>
          {/* Avatar */}
          <div style={{
            width: '150px',
            height: '150px',
            margin: '0 auto 2rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9370db, #c8b4ff)',
            padding: '3px',
            boxShadow: '0 0 60px rgba(147, 112, 219, 0.4)',
            animation: 'pulse 4s ease-in-out infinite'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#0a0a15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img 
                src="/mnt/user-data/uploads/1767469280303_image.png" 
                alt="Keerthi Samhitha"
                style={{ width: '90%', height: '90%', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
          </div>
          
          <p style={{
            color: '#c8b4ff',
            fontSize: '0.9rem',
            fontFamily: "'Space Mono', monospace",
            marginBottom: '0.8rem',
            letterSpacing: '4px',
            textTransform: 'uppercase'
          }}>
            Hello, I'm
          </p>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontFamily: "'Syne', sans-serif",
            fontWeight: '700',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff, #c8b4ff, #9370db)',
            backgroundSize: '200% 200%',
            animation: 'gradientMove 5s ease infinite',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1
          }}>
            {typedText}
            <span style={{
              display: 'inline-block',
              width: '3px',
              height: '0.8em',
              background: '#c8b4ff',
              marginLeft: '4px',
              animation: 'cursorBlink 1s infinite',
              verticalAlign: 'middle'
            }} />
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '1.5rem'
          }}>
            Data Analyst & Data Scientist
          </p>
          
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.8
          }}>
            Transforming complex data into actionable insights through scalable pipelines, 
            intelligent dashboards, and machine learning solutions.
          </p>
          
          {/* Social Links */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://github.com/KSam-23" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: '#fff', textDecoration: 'none',
              padding: '0.7rem 1.3rem',
              border: '1px solid rgba(147, 112, 219, 0.4)',
              borderRadius: '25px',
              fontSize: '0.85rem',
              fontFamily: "'Space Mono', monospace",
              transition: 'all 0.3s ease'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/keerthi-samhitha-kadaveru-a0738a201" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: '#fff', textDecoration: 'none',
              padding: '0.7rem 1.3rem',
              border: '1px solid rgba(147, 112, 219, 0.4)',
              borderRadius: '25px',
              fontSize: '0.85rem',
              fontFamily: "'Space Mono', monospace",
              transition: 'all 0.3s ease'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
            <a href="mailto:k.samhitha23@gmail.com" style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              color: '#07070d', textDecoration: 'none',
              padding: '0.7rem 1.3rem',
              background: 'linear-gradient(135deg, #c8b4ff, #9370db)',
              borderRadius: '25px',
              fontSize: '0.85rem',
              fontFamily: "'Space Mono', monospace",
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" style={{
        position: 'relative',
        zIndex: 1,
        padding: '6rem 2rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <SectionTitle>Experience</SectionTitle>
        
        {/* Ingram Micro - Style A (Impact Metrics) */}
        <ImpactMetricsExperience />
        
        {/* Capgemini - Style D (Dashboard) */}
        <DashboardExperience />

        {/* Education */}
        <div style={{
          background: 'rgba(147, 112, 219, 0.08)',
          border: '1px solid rgba(147, 112, 219, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem 2rem'
        }}>
          <h4 style={{
            color: '#c8b4ff',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.8rem',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '3px'
          }}>
            Education
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <p style={{ color: '#fff', fontSize: '1rem', fontWeight: '500', marginBottom: '0.2rem' }}>M.S. in Data Science</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>University at Buffalo - SUNY • 2024 - 2025</p>
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: '1rem', fontWeight: '500', marginBottom: '0.2rem' }}>B.Tech, Electronics & Communication</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Gurunank Institute of Technology • 2017 - 2021</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Placeholder */}
      <section id="projects" style={{
        position: 'relative',
        zIndex: 1,
        padding: '6rem 2rem',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <SectionTitle>Projects</SectionTitle>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Projects section coming next...
        </p>
      </section>

      {/* Skills Section - Placeholder */}
      <section id="skills" style={{
        position: 'relative',
        zIndex: 1,
        padding: '6rem 2rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <SectionTitle>Skills</SectionTitle>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Skills section coming next...
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{
        position: 'relative',
        zIndex: 1,
        padding: '6rem 2rem',
        textAlign: 'center'
      }}>
        <SectionTitle>Let's Connect</SectionTitle>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: '1.1rem',
          maxWidth: '500px',
          margin: '0 auto 3rem',
          lineHeight: 1.8
        }}>
          Open to discussing data projects, collaboration opportunities, or chatting about the latest in data science.
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="mailto:k.samhitha23@gmail.com" style={{
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontSize: '1rem',
            fontFamily: "'Space Mono', monospace"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8b4ff" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            k.samhitha23@gmail.com
          </a>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1rem',
            fontFamily: "'Space Mono', monospace"
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8b4ff" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Buffalo, NY
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 1,
        padding: '3rem 2rem',
        borderTop: '1px solid rgba(147, 112, 219, 0.15)',
        textAlign: 'center'
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: 1.8
        }}>
          "The world isn't perfect. But it's there for us, doing the best it can. That's what makes it so damn beautiful."
          <span style={{
            display: 'block',
            color: '#c8b4ff',
            marginTop: '0.5rem',
            fontStyle: 'normal',
            fontSize: '0.8rem',
            fontFamily: "'Space Mono', monospace"
          }}>
            — Roy Mustang, Fullmetal Alchemist
          </span>
        </p>
        
        <p style={{
          color: 'rgba(255,255,255,0.25)',
          fontSize: '0.8rem',
          fontFamily: "'Space Mono', monospace"
        }}>
          © Keerthi Samhitha 2025 • Crafted with ✨
        </p>
      </footer>
    </div>
  );
};

export default Portfolio;
