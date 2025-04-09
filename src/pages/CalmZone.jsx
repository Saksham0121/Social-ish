import { useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';

export default function CalmZone() {
  const [openCategory, setOpenCategory] = useState(null);
  
  const categories = [
    {
      id: 'nature',
      title: 'Nature Sounds',
      icon: '🌲',
      sounds: [
        { id: 'ocean', title: 'Ocean Waves', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qFFzUcFZ7iFZ9Jn5lzGJeRU' },
        { id: 'rain', title: 'Rainfall & Thunder', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qF7NV1Gk_tLyKDlQ8zfvXnM' },
        { id: 'forest', title: 'Forest Ambiance', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qH9KkLIlgMbej4Kj8A4wvL1' },
        { id: 'winter', title: 'Winter Winds', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qGFVPyxeK-3-gwGeWbugJyl' }
      ]
    },
    {
      id: 'ambient',
      title: 'Ambient Sounds',
      icon: '🎧',
      sounds: [
        { id: 'space', title: 'Space Ambiance', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qFdXMQcDmWYpHfbZfLCHkBK' },
        { id: 'cafe', title: 'Cafe Atmosphere', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qGKKB-O3ZDHyJ2_kz9P2XzI' },
        { id: 'night', title: 'Night Sounds', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qF5lFUJjpKnHXDVQYgN0Sq1' },
        { id: 'white', title: 'White Noise', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qF_dYgJL7gOjZ8qWWRjQhD2' }
      ]
    },
    {
      id: 'music',
      title: 'Instrumental Music',
      icon: '🎵',
      sounds: [
        { id: 'piano', title: 'Piano Melodies', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qGRDYBrpGQnm9Pp1l1Rjbn7' },
        { id: 'guitar', title: 'Acoustic Guitar', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qH1Wz6MyYdTzURz1yCEiQZ5' },
        { id: 'lofi', title: 'Lo-Fi Beats', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qG0Hp58OGqpxfK5QGhBQgN7' },
        { id: 'classical', title: 'Classical Pieces', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qFJ0rq70dJgEcMQ2c6bIGPx' }
      ]
    },
    {
      id: 'guided',
      title: 'Guided Relaxation',
      icon: '🧘‍♀️',
      sounds: [
        { id: 'meditation', title: 'Meditation', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qGqFW3wH_aUCYVrKw6g7M6Z' },
        { id: 'breathing', title: 'Breathing Exercises', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qHDOI2PVh9L15Mh0z_tBnRf' },
        { id: 'sleep', title: 'Sleep Stories', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qGcTnBcQjCVgJ99KDvjE30T' },
        { id: 'body', title: 'Body Scan', url: 'https://www.youtube.com/playlist?list=PLIdBPph6q-qHPrfEQ4DBZG5T0sdCjXEpN' }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    if (openCategory === categoryId) {
      setOpenCategory(null);
    } else {
      setOpenCategory(categoryId);
    }
  };

  const handleSoundClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-amber-50 flex justify-center items-center p-4">
      <div className="max-w-4xl w-full bg-amber-100 rounded-3xl border-2 border-blue-400 p-8 relative">
        {/* Back button */}
        <button className="absolute top-4 left-4 text-gray-800">
          <ArrowLeft size={24} />
        </button>
        
        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-10 text-gray-800" style={{ fontFamily: 'cursive' }}>
          calm zone
        </h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Categories */}
          <div className="md:w-1/2 space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="relative">
                <button
                  className="w-full bg-amber-200 rounded-xl px-6 py-3 flex items-center gap-3 hover:bg-amber-300 transition-colors text-left"
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-lg font-bold uppercase tracking-wider">{category.title}</span>
                </button>
                
                {/* Popup for sounds */}
                {openCategory === category.id && (
                  <div className="absolute z-10 mt-2 w-full bg-amber-200 rounded-xl p-3 shadow-lg">
                    <div className="space-y-2">
                      {category.sounds.map((sound) => (
                        <button
                          key={sound.id}
                          className="w-full flex items-center justify-between bg-amber-100 rounded-lg px-4 py-2 hover:bg-amber-300 transition-colors"
                          onClick={() => handleSoundClick(sound.url)}
                        >
                          <span className="uppercase tracking-wide font-medium text-sm">{sound.title}</span>
                          <Play size={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Right side - Image */}
          <div className="md:w-1/2 bg-amber-200 rounded-xl p-4">
            <img 
              src="/api/placeholder/400/320" 
              alt="Calm landscape" 
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}