import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function PlatformerSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const posRef = useRef({ x: 50, y: 0, vy: 0, ground: 180 });
  const frameCount = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      frameCount.current++;
      const pos = posRef.current;

      // Update physics
      pos.vy += 0.6;
      pos.y += pos.vy;
      if (pos.y >= pos.ground) {
        pos.y = pos.ground;
        pos.vy = -10; // Jump
      }
      pos.x += 2;
      if (pos.x > canvas.width + 20) pos.x = -20;

      // Clear
      ctx.fillStyle = '#011A24';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ground
      ctx.fillStyle = '#C8FF2F';
      ctx.fillRect(0, 200, canvas.width, 4);

      // Pixel character (simple block style)
      const bounce = Math.sin(frameCount.current * 0.15) * 3;
      const charY = pos.y + bounce;

      // Body
      ctx.fillStyle = '#C8FF2F';
      ctx.fillRect(pos.x - 8, charY - 24, 16, 16);
      // Head
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(pos.x - 6, charY - 36, 12, 12);
      // Eyes
      ctx.fillStyle = '#012A38';
      ctx.fillRect(pos.x + 2, charY - 32, 3, 3);
      // Legs (animated)
      const legOffset = Math.sin(frameCount.current * 0.3) * 4;
      ctx.fillStyle = '#C8FF2F';
      ctx.fillRect(pos.x - 6, charY - 8 + legOffset, 5, 8);
      ctx.fillRect(pos.x + 1, charY - 8 - legOffset, 5, 8);

      // Scattered coins
      for (let i = 0; i < 5; i++) {
        const coinX = ((i * 150) + frameCount.current * 2) % (canvas.width + 40) - 20;
        const coinY = 120 + Math.sin(frameCount.current * 0.05 + i) * 10;
        ctx.fillStyle = '#C8FF2F';
        ctx.beginPath();
        ctx.arc(coinX, coinY, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-6xl lg:text-8xl font-bold text-white/5">05</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2">Take a break.</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-white/10 max-w-3xl mx-auto"
        >
          <canvas
            ref={canvasRef}
            width={800}
            height={240}
            className="w-full h-auto"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-sm text-white/40 font-medium">powered by reviews.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
