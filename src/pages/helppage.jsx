import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';


export default function HelpAndSupport() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('getting-started');

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 text-gray-800 p-4 md:p-8">
        <Link to="/" className="text-neutral-800 hover:text-neutral-600 transition-colors">
          <ChevronLeft size={32} />
        </Link>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-amber-900">
            <span className="text-black">🌿</span> Help & Support — Social-ish
          </h1>
          <p className="text-gray-600">Your guide to a more comfortable social experience</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Navigation Sidebar */}
          <nav className="md:w-1/4 bg-white p-4 rounded-lg shadow-md">
            <ul className="space-y-1">
              {[
                { id: 'getting-started', label: '1. Getting Started' },
                { id: 'features', label: '2. Features Overview' },
                { id: 'privacy', label: '3. Privacy & Safety' },
                { id: 'faqs', label: '4. FAQs' },
              ].map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-amber-100 text-amber-900 font-medium'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content Section */}
          <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md">
            {activeSection === 'getting-started' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-amber-700 mb-4">Getting Started</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">How to Sign Up and Log In</h3>
                    <p>Navigate to our homepage and click the "Sign Up" button. You can create an account using your email address or connect with your Google or Apple account. After verification, you'll be ready to log in and start your journey.</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">Setting Up Your Profile</h3>
                    <p>Complete your profile by adding your interests, comfort level with social interactions, and preferred communication style. This helps us match you with like-minded individuals and customize your experience.</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Choose your interests from our categories</li>
                      <li>Set your personal information like email, DOB, Gender, Phone no and status</li>
                      <li>Add an optional profile picture or avatar</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">Navigating the Homepage</h3>
                    <p>Your homepage is personalized based on your interests and comfort level. You'll find:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Chat room suggestions that match your interests</li>
                      <li>Quick access to Calming Corner and TheraBot</li>
                      <li>Notifications for new matches and messages</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'features' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-amber-700 mb-4">Features Overview</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">🧘‍♀️ Calming UI/UX</h3>
                    <p>Our platform is designed with your comfort in mind:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Minimalist design with soft color schemes to reduce visual overwhelm</li>
                      <li>Smooth transitions and relaxing animations for a peaceful experience</li>
                      <li>Gentle notifications that respect your need for calm and avoid creating urgency</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">🤝 Like-minded Matching</h3>
                    <p>Our thoughtful matching system connects you with compatible individuals:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>AI-based personality and interest matching</li>
                      <li>Connect with people who share your values, energy levels, and hobbies</li>
                      <li>Conversation prompts to break the ice for introverts</li>
                      <li>No pressure to respond immediately—everyone understands the need for space</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">💬 AI Chatbot – Friend + Therapist</h3>
                    <p>A dual-purpose AI that serves as both a friendly companion and mental wellness assistant:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Engage in meaningful conversation without social pressure</li>
                      <li>Receive help with calming anxiety and managing stress</li>
                      <li>Access guided breathing exercises or grounding techniques</li>
                      <li>Get journaling prompts, affirmations, or regular check-ins</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">🧩 Anxiety-Relief Games</h3>
                    <p>Calming mini-games designed specifically for stress relief:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>FlappyBird</li>
                      <li>2048</li>
                      <li>Snake game</li>
                      <li>puzzle solving</li>

                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2"> ❄️ IceBreakers</h3>
                    <p>Help start meaningful conversations comfortably</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>When you're matched with someone, you'll see a set of calm, low-pressure questions or prompts you can choose from</li>
                      <li>These are designed to spark meaningful connections without small talk or awkwardness</li>
                      <li>Control when you're visible to others</li>
                      <li>You can skip any prompt or suggest your own if you feel more comfortable</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">🧍‍♀️ Solo Engagement Mode</h3>
                    <p>Enjoy the app without socializing:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Use wellness tools and self-care resources</li>
                      <li>Play games for mindfulness and relaxation</li>
                      <li>Talk to the AI chatbot for companionship</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">🎯 Interests</h3>
                    <p>Select your interests from categories like:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Hobbies (Art, Music, Sports, Reading)</li>
                      <li>Professional Interests (Tech, Business, Health)</li>
                      <li>Lifestyle (Travel, Food, Wellness)</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">🧠 Therapeutic Resource Library</h3>
                    <p>Access a wealth of wellbeing resources:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Calming tools and emotional wellness tips</li>
                      <li>Information about introversion, anxiety, burnout, and healing</li>
                      <li>Audio meditations, soft music, and guided breathing exercises</li>
                    </ul>
                  </div>

                  
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-amber-700 mb-4">Privacy & Safety</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">How Your Data is Protected</h3>
                    <p>We prioritize your privacy with these measures:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>End-to-end encryption for all messages</li>
                      <li>Option to use a pseudonym instead of your real name</li>
                      <li>Control over what profile information is visible to others</li>
                      <li>Regular privacy audits and transparent data policies</li>
                      <li>Data encryption for conversations & journals</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">Blocking/Reporting Users</h3>
                    <p>If you ever feel uncomfortable with another user:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Tap the three dots near their name and select "Block" or "Report"</li>
                      <li>Blocked users cannot see your profile or contact you</li>
                      <li>All reports are reviewed by our team within 24 hours</li>
                      <li>Zero tolerance policy for harassment or intimidation</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">Staying Anonymous or Choosing What to Share</h3>
                    <p>You decide how visible you want to be:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Use "Incognito Mode" in chat rooms to participate without profile visibility</li>
                      <li>Customize visibility settings for each profile element</li>
                      <li>Gradually reveal more as you become comfortable</li>
                      <li>Reset visibility settings anytime with one click</li>
                    </ul>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">Safety Tools</h3>
                    <p>Additional features to help you feel secure:</p>
                    <ul className="list-disc ml-6 mt-2 text-gray-700">
                      <li>Optional live location sharing for solo outings</li>
                      <li>Emergency alert via shake gesture when needed</li>
                      <li>More safety features currently under development</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'faqs' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-amber-700 mb-4">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">What makes Social-ish different?</h3>
                    <p>Social-ish is specifically designed for introverts and those who find traditional social media overwhelming. We focus on quality interactions over quantity, with features designed to reduce social pressure and anxiety. Our platform has no "like" counters, no public follower counts, and emphasizes meaningful connections rather than performance.</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">Is this platform only for introverts?</h3>
                    <p>While Social-ish is primarily designed for introverts and socially anxious individuals, it welcomes anyone who values meaningful interactions in a calming environment. Our platform caters to people with burnout, sensory overwhelm, or digital fatigue who are seeking a more mindful approach to social connection.</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-black mb-2">Can I use it without chatting with others?</h3>
                    <p>Absolutely! Our Solo Engagement Mode lets you enjoy Social-ish without any social interaction. You can use wellness tools, play anxiety-relief games, talk to the AI chatbot, read calming content, and practice guided journaling—all without engaging with other users.</p>
                  </div>


                </div>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
}