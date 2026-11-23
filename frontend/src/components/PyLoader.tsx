import { motion } from 'framer-motion';

/** Friendly loading animation while Pyodide downloads: a steaming momo pot. */
export default function PyLoader({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50 border-2 border-dashed border-orange-300">
      <div className="relative w-16 h-16 shrink-0">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute text-xl"
            style={{ left: 8 + i * 16, top: 0 }}
            animate={{ y: [-2, -18], opacity: [0.8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.4 }}
          >
            ♨️
          </motion.span>
        ))}
        <motion.div className="absolute bottom-0 text-4xl" animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 1, repeat: Infinity }}>
          🥟
        </motion.div>
      </div>
      <div>
        <p className="font-bold text-orange-700">{text || 'Getting Python ready…'}</p>
        <p className="text-sm text-slate-500">First time can take a minute on slow internet. After that, CodeGaon remembers it — even offline! 📴</p>
      </div>
    </div>
  );
}
