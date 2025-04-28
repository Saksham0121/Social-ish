import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function InterestsPage() {
  
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
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

  // 🔐 Track authenticated user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user.uid);
        setUserId(user.uid);
      } else {
        console.log("No user authenticated - using local storage");
        // Fallback to localStorage if no user is logged in
        const savedInterests = localStorage.getItem('userInterests');
        if (savedInterests) {
          setInterests(JSON.parse(savedInterests));
          setIsEditing(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 📥 Fetch interests from MongoDB when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchInterests = async () => {
      try {
        console.log("Fetching interests for user:", userId);
        const response = await fetch(`http://localhost:3001/api/interests/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // No credentials needed with the updated CORS config
        });
        
        console.log("API response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Interests data received:", data);
          if (data?.interests) {
            setInterests(data.interests);
            setIsEditing(false);
          }
        } else {
          console.log("No saved interests found for this user");
          // Fall back to localStorage if no data in DB
          const savedInterests = localStorage.getItem('userInterests');
          if (savedInterests) {
            setInterests(JSON.parse(savedInterests));
            setIsEditing(false);
          }
        }
      } catch (err) {
        console.error("Error fetching interests:", err);
        // Fall back to localStorage on error
        const savedInterests = localStorage.getItem('userInterests');
        if (savedInterests) {
          setInterests(JSON.parse(savedInterests));
          setIsEditing(false);
        }
      }
    };

    fetchInterests();
  }, [userId]);

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

  const handleSave = async () => {
    console.log("Save button clicked");
    
    // Always save to localStorage as backup
    localStorage.setItem('userInterests', JSON.stringify(interests));
    
    if (userId) {
      // Save to MongoDB if user is logged in
      try {
        console.log("Saving interests to MongoDB for user:", userId);
        const response = await fetch("http://localhost:3001/api/interests/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, interests }),
        });

        console.log("API response status:", response.status);
        
        if (!response.ok) {
          console.error("Failed to save to MongoDB - using localStorage as fallback");
          // localStorage already saved above
        } else {
          console.log("Successfully saved to MongoDB");
        }
      } catch (err) {
        console.error("Error saving to MongoDB:", err);
        // localStorage already saved above
      }
    } else {
      console.log("No user logged in, saved to localStorage only");
    }
    
    setIsEditing(false);
  };

  const handleEdit = () => {
    console.log("Edit button clicked");
    setIsEditing(true);
  };

  // Handler functions for navigation
  const handleBackToWebsite = () => {
    navigate('/');  // Navigate to homepage
  };

  const renderCheckbox = (category, option, label) => {
    const isChecked = interests[category].includes(option);
    return (
      <div className="flex items-center space-x-2" key={`${category}-${option}`}>
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
    <div className="h-screen flex justify-center items-center overflow-hidden " 
         style={{ backgroundImage: "url('src/Assets/bgSocialish.png')", backgroundSize: "cover", backgroundPosition: "center" }}>

      {/* Back button */}
      <button 
        onClick={handleBackToWebsite}
        className="absolute top-7 left-8 z-50 bg-{F5F0E7} flex items-center text-stone-800 hover:text-amber-800 transition-colors px-4 py-2 rounded-full hover:bg-amber-100">
        <ChevronLeft size={32} className="mr-1" />
      </button>

      <div className="w-[80%] h-[90%] bg-[#E2D6C3] rounded-lg p-4 shadow-md border border-[#B29A86] flex flex-col">
        <h1 className="text-4xl font-slackey text-center text-[#5A3E2B] mb-6">Interests</h1>
        <div className="grid grid-cols-2 gap-6 flex-grow ">
          {[
            { category: 'hobbies', title: 'What type of Hobbies do you have?', options: ['traveling', 'reading', 'art', 'music & Singing', 'fitness & Sports', 'dancing'] },
            { category: 'books', title: 'What Type of books do you enjoy?', options: ['fiction', 'mystery', 'romance', 'scifi', 'motivational', 'nonfiction'] },
            { category: 'content', title: 'What type of content do you consume the most?', options: ['movies & TV shows', 'music & Podcasts', 'books & Comics', 'content creation', 'gaming & Esports', 'theater'] },
            { category: 'communicationStyle', title: "What's your preferred way of communicating?", options: ['in-person communication', 'texting', 'voice notes & Calls', 'writing (letters)', 'through memes', 'I prefer listening rather than talking'] },
            { category: 'music', title: 'What type of music do you like?', options: ['rock', 'pop', 'lo-fi & chill', 'instrumental', 'rap', 'classical'] },
            { category: 'movies', title: 'What type of movies do you like?', options: ['action', 'mystery & Crime', 'sci-fi', 'horror & Thriller', 'drama', 'romance'] },
            { category: 'friendQualities', title: "What's the most important quality in a friend?", options: ['understanding', 'shared Interests', 'loyalty & Trust', "Honesty, even if it's hard to hear", 'Giving me space while still being there', 'Encouragement and motivating me to grow'] }
          ].map(({ category, title, options }) => (
            <div key={category} className="p-4">
              <h2 className="text-lg font-sans mb-4 text-[#5A3E2B]">{title}</h2>
              <div className="grid grid-cols-3 gap-1">
                {options.map(option => renderCheckbox(category, option, option.charAt(0).toUpperCase() + option.slice(1)))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-3 space-x-2">
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