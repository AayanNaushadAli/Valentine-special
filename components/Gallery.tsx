
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Gallery: React.FC = () => {
  const photos = [
    { id: 1, src: 'https://picsum.photos/seed/love1/400/500', label: 'The Day We Met' },
    { id: 2, src: 'https://picsum.photos/seed/love2/400/400', label: 'Your Beautiful Smile' },
    { id: 3, src: 'https://picsum.photos/seed/love3/500/400', label: 'Our Late Night Talks' },
    { id: 4, src: 'https://picsum.photos/seed/love4/400/600', label: 'Your Infectious Laugh' },
    { id: 5, src: 'https://picsum.photos/seed/love5/600/400', label: 'Dreaming of You' },
    { id: 6, src: 'https://picsum.photos/seed/love6/400/400', label: 'Forever & Always' },
  ];

  return (
    <div className="px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h3 className="text-3xl font-romantic text-[#ff4d6d] mb-2">Our Scrapbook</h3>
          <p className="text-gray-400 text-sm">A collection of every tiny reason I love you.</p>
        </div>

        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg border-4 border-white"
            >
              <img
                src={photo.src}
                alt={photo.label}
                className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white font-romantic text-xl">{photo.label}</p>
                <div className="flex items-center gap-1 text-pink-400">
                  <Heart size={12} fill="currentColor" />
                  <span className="text-[10px] text-white/80 uppercase tracking-widest">Always</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-white/40 backdrop-blur-md p-8 rounded-3xl text-center border border-white/60">
          <Heart className="w-10 h-10 text-[#ff4d6d] mx-auto mb-4" />
          <p className="text-gray-600 font-medium italic">
            "And the best memories are the ones we haven't made yet."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
