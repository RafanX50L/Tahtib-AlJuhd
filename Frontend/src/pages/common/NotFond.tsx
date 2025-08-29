import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MousePosition {
  x: number;
  y: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

const NotFoundPage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  interface FloatingElementProps {
    children: React.ReactNode;
    index: number;
    className?: string;
    style?: React.CSSProperties;
  }

  const FloatingElement: React.FC<FloatingElementProps> = ({
    children,
    index,
    className = "",
    style,
  }) => {
    const speed = (index + 1) * 0.02;
    const xPos = (mousePosition.x - 0.5) * 100 * speed;
    const yPos = (mousePosition.y - 0.5) * 100 * speed;

    return (
      <div
        className={`absolute opacity-50 text-4xl transition-transform duration-300 ease-out ${className}`}
        style={{
          transform: `translate(${xPos}px, ${yPos}px)`,
          animation: "float 6s ease-in-out infinite",
          ...style,
        }}
      >
        {children}
      </div>
    );
  };

  interface AnimatedButtonProps {
    variant?:
      | "default"
      | "link"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | null;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
  }

  const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    variant,
    children,
    onClick,
    className = "",
  }) => {
    return (
      <Button
        variant={variant}
        onClick={(e) => {
          createRipple(e);
          if (onClick) onClick(e);
        }}
        className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
      >
        {children}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              animation: "ripple 0.6s linear forwards",
            }}
          />
        ))}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center overflow-hidden relative">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement
          index={0}
          className="top-1/5 left-1/12"
          style={{ animationDelay: "0s" }}
        >
          💪
        </FloatingElement>
        <FloatingElement
          index={1}
          className="top-3/5 right-1/5"
          style={{ animationDelay: "2s" }}
        >
          🏃‍♂️
        </FloatingElement>
        <FloatingElement
          index={2}
          className="bottom-1/3 left-1/5"
          style={{ animationDelay: "4s" }}
        >
          🏋️‍♀️
        </FloatingElement>
        <FloatingElement
          index={3}
          className="top-1/4 right-1/4"
          style={{ animationDelay: "1s" }}
        >
          🧘‍♀️
        </FloatingElement>
        <FloatingElement
          index={4}
          className="bottom-1/5 left-1/3"
          style={{ animationDelay: "3s" }}
        >
          🚴‍♂️
        </FloatingElement>
        <FloatingElement
          index={5}
          className="top-2/5 right-1/6"
          style={{ animationDelay: "5s" }}
        >
          🏊‍♀️
        </FloatingElement>
      </div>

      <div className="text-center p-8 max-w-2xl w-full relative z-10">
        {/* Logo */}
        <div className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-lg animate-fade-in-down">
          Tahtib AlJuhd
        </div>

        {/* Fitness Icon */}
        <div className="w-20 h-20 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse-slow">
          <div className="relative w-12 h-5 bg-white rounded-full animate-spin-slow">
            <div className="absolute -left-1 -top-1 w-4 h-7 bg-white rounded-sm"></div>
            <div className="absolute -right-1 -top-1 w-4 h-7 bg-white rounded-sm"></div>
          </div>
        </div>

        {/* Error Code */}
        <div className="text-8xl md:text-9xl font-black text-white/90 mb-4 drop-shadow-2xl animate-bounce-in leading-none">
          404
        </div>

        {/* Error Message */}
        <h1 className="text-2xl md:text-3xl text-white mb-4 animate-fade-in-up font-semibold">
          Page Not Found
        </h1>

        {/* Error Description */}
        <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed animate-fade-in-up-delayed max-w-lg mx-auto">
          {/* eslint-disable-next-line */}
          Looks like this page took a rest day! The page you're looking for
          might have been moved, deleted, or is taking a break from its workout
          routine.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delayed-2">
          <AnimatedButton
            variant="secondary"
            onClick={() => navigate("/")}
            className="bg-white text-indigo-600 hover:bg-white/10 hover:border-white hover:text-white font-semibold px-8 py-3 rounded-full min-w-[200px]"
          >
            Back to Home
          </AnimatedButton>
          <AnimatedButton
            variant="secondary"
            onClick={() => navigate("/dashboard")}
            className="bg-white text-indigo-600 hover:bg-white/10 hover:border-white hover:text-white font-semibold px-8 py-3 rounded-full min-w-[200px]"
          >
            Back to Dashboard
          </AnimatedButton>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.3s both;
        }

        .animate-fade-in-up-delayed {
          animation: fade-in-up 1s ease-out 0.6s both;
        }

        .animate-fade-in-up-delayed-2 {
          animation: fade-in-up 1s ease-out 0.9s both;
        }

        .animate-bounce-in {
          animation: bounce-in 1.2s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
