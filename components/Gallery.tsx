
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ImagePlus, Loader2, X, Trash2 } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const BUCKET = 'gallery-photos';

interface GalleryPhoto {
  name: string;
  url: string;
}

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prefix: '', limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } }),
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        const photoList: GalleryPhoto[] = data
          .filter((f: any) => f.name && f.metadata?.mimetype?.startsWith('image/'))
          .map((f: any) => ({
            name: f.name,
            url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${f.name}`,
          }));
        setPhotos(photoList);
      }
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name}`;
        await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': file.type,
          },
          body: file,
        });
      }
      await fetchPhotos();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (photoName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this memory?')) return;

    try {
      await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${photoName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      });
      setPhotos((prev) => prev.filter((p) => p.name !== photoName));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-3xl font-romantic text-[#ff4d6d] mb-2">Our Scrapbook</h3>
          <p className="text-gray-400 text-sm mb-4">A collection of every tiny reason I love you.</p>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-[#ff4d6d] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#ff758f] transition-all active:scale-95 font-bold text-sm"
          >
            {isUploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
            ) : (
              <><ImagePlus className="w-4 h-4" /> Add Memories</>
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-pink-300 gap-3">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="font-romantic text-xl">Loading your memories…</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-pink-300 gap-3">
            <Heart className="w-12 h-12 animate-pulse" />
            <p className="font-romantic text-xl">No memories yet…</p>
            <p className="text-sm text-gray-400">Tap "Add Memories" to upload your first photo!</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg border-4 border-white"
                onClick={() => setSelectedPhoto(photo.url)}
              >
                <img
                  src={photo.url}
                  alt="Memory"
                  className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-pink-400">
                      <Heart size={12} fill="currentColor" />
                      <span className="text-[10px] text-white/80 uppercase tracking-widest">Always</span>
                    </div>
                    <button
                      onClick={(e) => handleDelete(photo.name, e)}
                      className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors"
                      title="Delete memory"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white/40 backdrop-blur-md p-8 rounded-3xl text-center border border-white/60">
          <Heart className="w-10 h-10 text-[#ff4d6d] mx-auto mb-4" />
          <p className="text-gray-600 font-medium italic">
            "And the best memories are the ones we haven't made yet."
          </p>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedPhoto(null)}
          >
            <button className="absolute top-6 right-6 text-white/80 hover:text-white" onClick={() => setSelectedPhoto(null)}>
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedPhoto}
              alt="Memory"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
