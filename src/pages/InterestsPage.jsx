import { useState, useEffect } from 'react';

function InterestsPage() {
  const [isEditing, setIsEditing] = useState(true);
  const [interests, setInterests] = useState({
    hobbies: [],
    books: [],
    content: [],
    communicationStyle: [],
    friendQualities: [],
    music: [],
    movies: []
  });

  useEffect(() => {
    const savedInterests = localStorage.getItem('userInterests');
    if (savedInterests) {
      setInterests(JSON.parse(savedInterests));
      setIsEditing(false);
    }
  }, []);

  const handleCheckboxChange = (category, option) => {
    if (!isEditing) return;
    setInterests(prev => {
      const updated = { ...prev };
      if (updated[category].includes(option)) {
        updated[category] = updated[category].filter(item => item !== option);
      } else {
        updated[category] = [...updated[category], option];
      }
      return updated;
    });
  };

  const handleSave = () => {
    localStorage.setItem('userInterests', JSON.stringify(interests));
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const renderCheckbox = (category, option, label) => {
    const isChecked = interests[category].includes(option);
    return (
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={`${category}-${option}`}
          checked={isChecked}
          onChange={() => handleCheckboxChange(category, option)}
          disabled={!isEditing}
          className="w-5 h-5 accent-[#8B5A2B] cursor-pointer"
        />
        <label 
          htmlFor={`${category}-${option}`}
          className={`text-xs ${!isEditing && isChecked ? 'font-bold' : ''} ${!isEditing && !isChecked ? 'text-gray-400' : ''}`}
        >
          {label}
        </label>
      </div>
    );
  };

  return (
    <div className="h-screen flex justify-center items-center overflow-hidden" 
         style={{ backgroundImage: "url('src/Assets/bgSocialish.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="w-[80%] h-[90%] bg-[#E2D6C3] rounded-lg p-6 shadow-md border border-[#B29A86] flex flex-col">
        <h1 className="text-4xl font-slackey text-center text-[#5A3E2B] mb-6">Interests</h1>
        <div className="grid grid-cols-2 gap-6 flex-grow">
          {[
            { category: 'hobbies', title: 'What type of Hobbies do you have?', options: ['traveling', 'reading', 'art', 'music & Singing', 'fitness & Sports', 'dancing'] },
            { category: 'books', title: 'What Type of books do you enjoy?', options: ['fiction', 'mystery', 'romance', 'scifi', 'motivational', 'nonfiction'] },
            { category: 'content', title: 'What type of content do you consume the most?', options: ['movies & TV shows', 'music & Podcasts', 'books & Comics', 'content creation', 'gaming & Esports', 'theater'] },
            { category: 'communicationStyle', title: 'What’s your preferred way of communicating?', options: ['in-person communication', 'texting', 'voice notes & Calls', 'writing (letters)', 'through memes', 'I prefer listening rather than talking'] },
            { category: 'music', title: 'What type of music do you like?', options: ['rock', 'pop', 'lo-fi & chill', 'instrumental', 'rap', 'classical'] },
            { category: 'movies', title: 'What type of movies do you like?', options: ['action', 'mystery & Crime', 'sci-fi', 'horror & Thriller', 'drama', 'romance'] },
            { category: 'friendQualities', title: 'What’s the most important quality in a friend?', options: ['understanding', 'shared Interests', 'loyalty & Trust' , 'Honesty, even if it’s hard to hear', 'Giving me space while still being there','Encouragement and motivating me to grow'] }
          ].map(({ category, title, options }) => (
            <div key={category} className=" p-4  ">
              <h2 className="text-lg font-sans serif mb-4 text-[#5A3E2B]">{title}</h2>
              <div className="grid grid-cols-3 gap-1 ">
                {options.map(option => renderCheckbox(category, option, option.charAt(0).toUpperCase() + option.slice(1)))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-3 -translate-y-24 space-x-2">
          <button
            onClick={handleSave}
            disabled={!isEditing}
            className={`px-6 py-2 text-sm rounded-md ${isEditing ? 'bg-[#8B5A2B] hover:bg-[#7A4D25] text-white' : 'bg-[#D6B59E] text-[#8B5A2B] cursor-not-allowed'}`}
          >
            Save
          </button>
          <button
            onClick={handleEdit}
            disabled={isEditing}
            className={`px-6 py-2 text-sm rounded-md ${!isEditing ? 'bg-[#8B5A2B] hover:bg-[#7A4D25] text-white' : 'bg-[#D6B59E] text-[#8B5A2B] cursor-not-allowed'}`}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterestsPage;
