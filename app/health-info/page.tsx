'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { FileText, AlertCircle, Heart, Lightbulb } from 'lucide-react';

export default function HealthInfo() {
  const [activeTab, setActiveTab] = useState('news');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dynamicContent, setDynamicContent] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/health-content')
      .then(res => res.json())
      .then(data => {
        if (data.content) setDynamicContent(data.content);
      })
      .catch(err => console.error(err));
  }, []);

  const categories = ['All', 'Local', 'International', 'University', 'Health', 'Children'];

  // News & Updates Content
  const newsUpdates = {
    all: [
      {
        id: 1,
        title: 'WHO Launches New Mental Health Initiative',
        category: 'International',
        date: 'December 15, 2024',
        content: 'The World Health Organization announced a comprehensive mental health support program focusing on digital wellness and mental resilience.',
        source: 'WHO News'
      },
      {
        id: 2,
        title: 'COVID-19 Vaccination Drive in Sri Lanka',
        category: 'Local',
        date: 'December 10, 2024',
        content: 'Sri Lanka Ministry of Health continues nationwide vaccination campaigns with emphasis on booster doses for vulnerable populations.',
        source: 'Ministry of Health Sri Lanka'
      },
      {
        id: 3,
        title: 'Wayamba University Health Campus Expansion',
        category: 'University',
        date: 'December 12, 2024',
        content: 'Wayamba University of Sri Lanka inaugurates a new health and wellness center to support student mental and physical health initiatives.',
        source: 'Wayamba University'
      },
      {
        id: 4,
        title: 'Dengue Fever Prevention Campaign',
        category: 'Local',
        date: 'December 8, 2024',
        content: 'Local health authorities in Sri Lanka launch awareness campaign on dengue prevention with focus on mosquito control measures.',
        source: 'National Health Authority'
      },
      {
        id: 5,
        title: 'World Antimicrobial Resistance Day',
        category: 'International',
        date: 'December 5, 2024',
        content: 'Global health organizations emphasize responsible antibiotic use and awareness about antimicrobial resistance threats.',
        source: 'WHO'
      },
      {
        id: 6,
        title: 'Child Vaccination Schedule Updated',
        category: 'Children',
        date: 'December 1, 2024',
        content: 'New child vaccination recommendations released to include protection against emerging infectious diseases.',
        source: 'Health Ministry'
      }
    ],
    local: [
      {
        id: 2,
        title: 'COVID-19 Vaccination Drive in Sri Lanka',
        category: 'Local',
        date: 'December 10, 2024',
        content: 'Sri Lanka Ministry of Health continues nationwide vaccination campaigns with emphasis on booster doses for vulnerable populations.',
        source: 'Ministry of Health Sri Lanka'
      },
      {
        id: 4,
        title: 'Dengue Fever Prevention Campaign',
        category: 'Local',
        date: 'December 8, 2024',
        content: 'Local health authorities in Sri Lanka launch awareness campaign on dengue prevention with focus on mosquito control measures.',
        source: 'National Health Authority'
      }
    ],
    international: [
      {
        id: 1,
        title: 'WHO Launches New Mental Health Initiative',
        category: 'International',
        date: 'December 15, 2024',
        content: 'The World Health Organization announced a comprehensive mental health support program focusing on digital wellness and mental resilience.',
        source: 'WHO News'
      },
      {
        id: 5,
        title: 'World Antimicrobial Resistance Day',
        category: 'International',
        date: 'December 5, 2024',
        content: 'Global health organizations emphasize responsible antibiotic use and awareness about antimicrobial resistance threats.',
        source: 'WHO'
      }
    ],
    university: [
      {
        id: 3,
        title: 'Wayamba University Health Campus Expansion',
        category: 'University',
        date: 'December 12, 2024',
        content: 'Wayamba University of Sri Lanka inaugurates a new health and wellness center to support student mental and physical health initiatives.',
        source: 'Wayamba University'
      }
    ],
    health: [
      {
        id: 1,
        title: 'WHO Launches New Mental Health Initiative',
        category: 'Health',
        date: 'December 15, 2024',
        content: 'The World Health Organization announced a comprehensive mental health support program focusing on digital wellness and mental resilience.',
        source: 'WHO News'
      },
      {
        id: 5,
        title: 'World Antimicrobial Resistance Day',
        category: 'Health',
        date: 'December 5, 2024',
        content: 'Global health organizations emphasize responsible antibiotic use and awareness about antimicrobial resistance threats.',
        source: 'WHO'
      }
    ],
    children: [
      {
        id: 6,
        title: 'Child Vaccination Schedule Updated',
        category: 'Children',
        date: 'December 1, 2024',
        content: 'New child vaccination recommendations released to include protection against emerging infectious diseases.',
        source: 'Health Ministry'
      }
    ]
  };

  // Health Tips Content
  const healthTips = {
    all: [
      {
        id: 1,
        title: 'Stay Hydrated Daily',
        category: 'Health',
        icon: '💧',
        content: 'Drink at least 8 glasses of water daily to maintain proper hydration. Water helps regulate body temperature, aids digestion, and improves skin health. Stay hydrated especially during physical activity and hot weather.'
      },
      {
        id: 2,
        title: 'Exercise Regularly',
        category: 'Health',
        icon: '🏃',
        content: 'Engage in at least 150 minutes of moderate aerobic exercise weekly. Regular physical activity strengthens your heart, improves mental health, and helps maintain a healthy weight. Choose activities you enjoy like walking, swimming, or cycling.'
      },
      {
        id: 3,
        title: 'Eat a Balanced Diet',
        category: 'Health',
        icon: '🥗',
        content: 'Include fruits, vegetables, whole grains, lean proteins, and healthy fats in your diet. Balanced nutrition supports immune function, energy levels, and overall wellness. Reduce intake of processed foods and added sugars.'
      },
      {
        id: 4,
        title: 'Get Adequate Sleep',
        category: 'Health',
        icon: '😴',
        content: 'Aim for 7-9 hours of quality sleep each night. Good sleep improves concentration, strengthens immune system, and supports mental health. Maintain a consistent sleep schedule and create a comfortable sleeping environment.'
      },
      {
        id: 5,
        title: 'Manage Stress Effectively',
        category: 'Health',
        icon: '🧘',
        content: 'Practice meditation, yoga, or deep breathing exercises to reduce stress. Chronic stress can affect your health, so take time for relaxation and activities you enjoy. Consider seeking support from friends, family, or professionals.'
      },
      {
        id: 6,
        title: 'Child Nutrition Tips',
        category: 'Children',
        icon: '👶',
        content: 'Provide children with nutrient-rich foods including milk, eggs, fruits, and vegetables. Limit sugary snacks and drinks. Involve children in meal planning and cooking to develop healthy eating habits early.'
      },
      {
        id: 7,
        title: 'Students: Take Regular Breaks',
        category: 'University',
        icon: '📚',
        content: 'Take 5-10 minute breaks every hour while studying. Stand up, stretch, and rest your eyes. Regular breaks improve focus, prevent fatigue, and help retain information better. This is especially important during exam season.'
      },
      {
        id: 8,
        title: 'Prevent Dengue Fever',
        category: 'Local',
        icon: '🦟',
        content: 'Use mosquito repellents, wear long sleeves, and eliminate standing water around your home. Dengue is common in Sri Lanka, so take preventive measures seriously. Report any suspected cases to health authorities immediately.'
      }
    ],
    health: [
      {
        id: 1,
        title: 'Stay Hydrated Daily',
        category: 'Health',
        icon: '💧',
        content: 'Drink at least 8 glasses of water daily to maintain proper hydration. Water helps regulate body temperature, aids digestion, and improves skin health. Stay hydrated especially during physical activity and hot weather.'
      },
      {
        id: 2,
        title: 'Exercise Regularly',
        category: 'Health',
        icon: '🏃',
        content: 'Engage in at least 150 minutes of moderate aerobic exercise weekly. Regular physical activity strengthens your heart, improves mental health, and helps maintain a healthy weight. Choose activities you enjoy like walking, swimming, or cycling.'
      },
      {
        id: 3,
        title: 'Eat a Balanced Diet',
        category: 'Health',
        icon: '🥗',
        content: 'Include fruits, vegetables, whole grains, lean proteins, and healthy fats in your diet. Balanced nutrition supports immune function, energy levels, and overall wellness. Reduce intake of processed foods and added sugars.'
      },
      {
        id: 4,
        title: 'Get Adequate Sleep',
        category: 'Health',
        icon: '😴',
        content: 'Aim for 7-9 hours of quality sleep each night. Good sleep improves concentration, strengthens immune system, and supports mental health. Maintain a consistent sleep schedule and create a comfortable sleeping environment.'
      },
      {
        id: 5,
        title: 'Manage Stress Effectively',
        category: 'Health',
        icon: '🧘',
        content: 'Practice meditation, yoga, or deep breathing exercises to reduce stress. Chronic stress can affect your health, so take time for relaxation and activities you enjoy. Consider seeking support from friends, family, or professionals.'
      }
    ],
    children: [
      {
        id: 6,
        title: 'Child Nutrition Tips',
        category: 'Children',
        icon: '👶',
        content: 'Provide children with nutrient-rich foods including milk, eggs, fruits, and vegetables. Limit sugary snacks and drinks. Involve children in meal planning and cooking to develop healthy eating habits early.'
      },
      {
        id: 2,
        title: 'Exercise Regularly',
        category: 'Children',
        icon: '🏃',
        content: 'Encourage children to engage in at least 1 hour of physical activity daily. Play outdoor games, sports, or dancing. Regular exercise promotes healthy growth, strong bones, and good mental health in children.'
      }
    ],
    university: [
      {
        id: 7,
        title: 'Students: Take Regular Breaks',
        category: 'University',
        icon: '📚',
        content: 'Take 5-10 minute breaks every hour while studying. Stand up, stretch, and rest your eyes. Regular breaks improve focus, prevent fatigue, and help retain information better. This is especially important during exam season.'
      },
      {
        id: 5,
        title: 'Manage Stress Effectively',
        category: 'University',
        icon: '🧘',
        content: 'Practice meditation, yoga, or deep breathing exercises to reduce academic stress. Connect with campus support services at Wayamba University. Maintain work-life balance and don\'t hesitate to seek help from counseling services.'
      }
    ],
    local: [
      {
        id: 8,
        title: 'Prevent Dengue Fever',
        category: 'Local',
        icon: '🦟',
        content: 'Use mosquito repellents, wear long sleeves, and eliminate standing water around your home. Dengue is common in Sri Lanka, so take preventive measures seriously. Report any suspected cases to health authorities immediately.'
      },
      {
        id: 1,
        title: 'Stay Hydrated Daily',
        category: 'Local',
        icon: '💧',
        content: 'In Sri Lanka\'s tropical climate, hydration is crucial. Drink plenty of water and electrolyte-rich beverages. Dehydration can lead to heat-related illnesses, so maintain adequate water intake throughout the day.'
      }
    ],
    international: []
  };

  const getContent = () => {
    let content: any[] = [];
    if (activeTab === 'news') {
      content = [...(newsUpdates[selectedCategory as keyof typeof newsUpdates] || [])];
    } else {
      content = [...(healthTips[selectedCategory as keyof typeof healthTips] || [])];
    }
    
    const dynamicFiltered = dynamicContent
      .filter(item => {
        const catMatch = selectedCategory === 'all' || item.category.toLowerCase().includes(selectedCategory);
        const tabMatch = activeTab === 'news' ? item.category !== 'wellness' : item.category === 'wellness';
        return catMatch && tabMatch;
      })
      .map(item => ({
        id: item._id,
        title: item.title,
        category: item.category.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        date: new Date(item.createdAt).toLocaleDateString(),
        content: item.content,
        source: 'MediTrack Admin',
        icon: item.category === 'wellness' ? '🌿' : undefined
      }));
      
    return [...dynamicFiltered, ...content];
  };

  const content = getContent();

  return (
    <>
      <Navbar />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">
            Health Information Hub
          </h1>
          <p className="text-blue-100 text-lg">
            Stay informed about your health and wellness
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b bg-white p-4 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('news')}
              className={`pb-2 px-6 font-semibold transition flex items-center gap-2 ${
                activeTab === 'news'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              News & Updates
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`pb-2 px-6 font-semibold transition flex items-center gap-2 ${
                activeTab === 'tips'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              Health Tips
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat.toLowerCase())}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === cat.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Content */}
          {content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-blue-600"
                >
                  <div className="flex items-start gap-4">
                    {item.icon && (
                      <div className="text-4xl">{item.icon}</div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium mb-3">
                        {item.category} {item.date && `• ${item.date}`}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {item.content}
                      </p>
                      {item.source && (
                        <p className="text-xs text-gray-500 mt-3">
                          Source: {item.source}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                No content available in this category yet
              </p>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              About This Hub
            </h3>
            <p className="text-gray-700">
              This Health Information Hub is provided in partnership with Wayamba University of Sri Lanka Health & Wellness Center. 
              For urgent health concerns, please consult with healthcare professionals or contact your nearest medical facility. 
              For more information, visit the Wayamba University Health Services office or contact MediTrack support.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
