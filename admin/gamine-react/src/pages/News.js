import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './News.css';

function News() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { blogId } = useParams();

  useEffect(() => {
    // Mô phỏng việc tải dữ liệu tin tức từ cơ sở dữ liệu
    const newsData = [
      {
        id: 1,
        title: "GaMine Sponsors World Gaming Championship",
        summary: "We're excited to announce our sponsorship of this year's World Gaming Championship with exclusive gear for all participants.",
        content: `
          <p>We are thrilled to announce that GaMine has become the official peripheral sponsor of the 2023 World Gaming Championship! This partnership represents a significant milestone in our commitment to supporting competitive gaming at the highest level.</p>
          
          <p>As part of this sponsorship, all championship participants will receive an exclusive GaMine gear package featuring our latest Quantum Series products. This includes:</p>
          
          <ul>
            <li>Quantum Keyboard with custom WGC keycaps</li>
            <li>Neuro Mouse with championship edition RGB lighting</li>
            <li>Sonic Headset featuring WGC branding</li>
            <li>Limited edition carrying case</li>
          </ul>
          
          <p>"We believe that professional gamers deserve the absolute best equipment," said our CEO. "This partnership allows us to showcase our premium products on the world stage while supporting the growth of esports."</p>
          
          <p>The World Gaming Championship will be held in Seoul, South Korea from August 15-21, 2023, featuring competitions in multiple game titles with a total prize pool of $3 million.</p>
          
          <p>GaMine will also host a booth at the event where fans can try our latest products, meet professional players, and participate in mini-tournaments for prizes.</p>
        `,
        image: "../assets/images/New Gear Drop.png",
        category: "Events",
        author: "GaMine Team",
        date: "2023-06-15T10:00:00Z",
        tags: ["esports", "sponsorship", "gaming championship"],
        featured: true
      },
      {
        id: 2,
        title: "Introducing Our New Quantum Series",
        summary: "Our new Quantum Series features revolutionary haptic feedback technology and enhanced RGB lighting for immersive gaming.",
        content: `
          <p>Today we're proud to unveil our groundbreaking Quantum Series, representing the next evolution in gaming peripherals. After two years of intensive research and development, we've created a product line that doesn't just enhance your gaming experience—it transforms it.</p>
          
          <h3>Revolutionary Haptic Feedback</h3>
          <p>The centerpiece of our Quantum Series is our proprietary HapticSense™ technology. Unlike conventional vibration systems, HapticSense™ provides precise, localized feedback that corresponds directly to in-game actions. Feel the difference between walking on grass versus metal, or the subtle variations between different weapons.</p>
          
          <h3>Advanced RGB Lighting System</h3>
          <p>Our enhanced ChromaSync™ lighting system features individually addressable RGB zones with over 16.8 million colors. The system intelligently integrates with supported games to provide dynamic lighting effects that respond to in-game events, ammunition levels, health status, and more.</p>
          
          <h3>Premium Build Quality</h3>
          <p>Every Quantum Series product is crafted from aerospace-grade aluminum and high-quality polymers, ensuring durability while maintaining a lightweight feel. The series features:</p>
          
          <ul>
            <li>Quantum Keyboard with optical-mechanical hybrid switches (100 million keystroke lifespan)</li>
            <li>Quantum Mouse with adjustable weight system and 26K DPI optical sensor</li>
            <li>Quantum Headset with memory foam ear cushions and spatial audio</li>
          </ul>
          
          <p>The Quantum Series will be available for pre-order starting July 1st, with products shipping by late July. Early adopters will receive exclusive in-game content for selected partner titles.</p>
        `,
        image: "../assets/images/Tech Updates.png",
        category: "Product News",
        author: "Lisa Chen, Product Director",
        date: "2023-06-03T10:00:00Z",
        tags: ["product launch", "gaming peripherals", "technology"],
        featured: false
      },
      {
        id: 3,
        title: "GaMine Control Center 2.0 Now Available",
        summary: "Our updated software now includes AI-powered performance optimization and enhanced customization options.",
        content: `
          <p>We're excited to announce the release of GaMine Control Center 2.0, a complete overhaul of our peripheral management software. This update introduces numerous features designed to enhance your gaming experience while providing unprecedented levels of customization.</p>
          
          <h3>AI Performance Optimization</h3>
          <p>Our new GameSense AI technology analyzes your playing style across different game genres and automatically adjusts peripheral settings to match your preferences. The system learns from your gameplay and makes subtle adjustments to sensitivity, lighting, and macros to optimize your performance.</p>
          
          <h3>Enhanced Customization</h3>
          <p>Control Center 2.0 introduces a redesigned user interface that makes customizing your devices more intuitive than ever. New features include:</p>
          
          <ul>
            <li>Per-game profile management with automatic switching</li>
            <li>Advanced macro recording with timing adjustments</li>
            <li>Expanded RGB lighting effects library with custom animation tools</li>
            <li>Peripheral performance analytics dashboard</li>
          </ul>
          
          <h3>Cloud Synchronization</h3>
          <p>Your profiles and settings now automatically sync across all your devices through your GaMine account. Switch computers without losing your carefully crafted setups.</p>
          
          <h3>System Requirements and Availability</h3>
          <p>Control Center 2.0 is available as a free download for all GaMine peripheral owners. The software requires Windows 10/11 or macOS 11+.</p>
          
          <p>Visit our downloads section to get the latest version and experience the future of peripheral management.</p>
        `,
        image: "../assets/images/Event Recap.png",
        category: "Software",
        author: "Mark Johnson, Software Engineer",
        date: "2023-05-28T10:00:00Z",
        tags: ["software", "updates", "AI technology"],
        featured: false
      },
      {
        id: 4,
        title: "The Future of RGB: Going Beyond Aesthetics",
        summary: "How smart lighting in gaming peripherals is evolving to provide functional benefits beyond visual appeal.",
        content: `
          <p>RGB lighting has become a staple in gaming peripherals, but its evolution goes far beyond mere aesthetics. Our research team has been exploring new ways to leverage RGB technology to provide functional benefits that can actually improve your gaming experience.</p>
          
          <h3>Status Indicators and In-game Integration</h3>
          <p>The next generation of RGB peripherals will serve as intuitive status indicators. Imagine your keyboard subtly changing color to indicate your health status, or your mouse lighting up when special abilities are available. This natural integration provides critical information without cluttering your screen.</p>
          
          <h3>Focus Enhancement through Ambient Lighting</h3>
          <p>Our studies have shown that properly implemented RGB lighting can actually improve focus during extended gaming sessions. By dynamically adjusting the ambient light around your gaming space, our peripherals can help reduce eye strain and maintain optimal awareness levels.</p>
          
          <h3>Accessibility Features</h3>
          <p>RGB lighting is showing great promise as an accessibility tool. For gamers with hearing impairments, visual cues through RGB can replace audio indicators. Our adaptive lighting system can translate important game sounds into specific light patterns, ensuring no information is missed.</p>
          
          <p>As we look to the future, expect RGB technology to become more integrated with gameplay, more responsive to your needs, and more useful as a functional gaming tool rather than just a visual enhancement.</p>
          
          <p>GaMine is committed to leading this technological evolution with our upcoming peripheral lines, bringing smart lighting to every aspect of your gaming experience.</p>
        `,
        image: "../assets/images/rgb-future.webp",
        category: "Technology",
        author: "Dr. Sarah Kim, Research Lead",
        date: "2023-05-15T10:00:00Z",
        tags: ["RGB lighting", "gaming technology", "accessibility"],
        featured: false
      },
      {
        id: 5,
        title: "Esports Training: How Pros Configure Their Gaming Peripherals",
        summary: "Learn how professional esports players optimize their keyboard, mouse, and headset settings for peak performance.",
        content: `
          <p>Professional esports players understand that proper peripheral configuration can be the difference between victory and defeat. We've interviewed several top competitors to uncover how they optimize their setups.</p>
          
          <h3>Keyboard Configurations</h3>
          <p>Most pros prefer mechanical keyboards with specific switch types based on their game genre:</p>
          <ul>
            <li>FPS players often choose linear switches (like Cherry MX Red) for quick, repeated keypresses</li>
            <li>MOBA and MMO players tend to prefer tactile switches (like Cherry MX Brown) for precision</li>
            <li>Almost all pros remap certain keys for more efficient access to critical commands</li>
          </ul>
          
          <h3>Mouse Settings</h3>
          <p>Contrary to popular belief, most professionals use relatively low DPI settings:</p>
          <ul>
            <li>400-800 DPI is common among FPS pros for greater precision</li>
            <li>Higher polling rates (1000Hz) are standard for minimal input latency</li>
            <li>Weight customization varies by game, with FPS players typically preferring lighter mice</li>
          </ul>
          
          <h3>Audio Configurations</h3>
          <p>Sound provides critical information in competitive gaming:</p>
          <ul>
            <li>Many pros use equalization settings that emphasize footstep frequencies</li>
            <li>Virtual surround sound is increasingly used for positional awareness</li>
            <li>Noise cancellation is essential in tournament environments</li>
          </ul>
          
          <p>The key takeaway is customization—professional players spend considerable time fine-tuning their peripherals to match their specific needs and playstyle. Even small adjustments can lead to measurable performance improvements.</p>
        `,
        image: "../assets/images/esports-training.webp",
        category: "Esports",
        author: "Alex Torres, Esports Analyst",
        date: "2023-05-10T10:00:00Z",
        tags: ["esports", "gaming peripherals", "professional gaming"],
        featured: false
      },
      {
        id: 6,
        title: "Custom Keycaps: The Growing Trend in Mechanical Keyboard Customization",
        summary: "Explore the booming market for artisan keycaps and how gamers are using them to express their personality.",
        content: `
          <p>The mechanical keyboard community has exploded in recent years, with custom keycaps becoming one of the most popular ways for gamers to personalize their setup. What started as a niche hobby has evolved into a thriving industry with artists creating intricate designs that blur the line between technology and art.</p>
          
          <h3>Artisan Keycaps: Miniature Masterpieces</h3>
          <p>Handcrafted artisan keycaps have become collectors' items, with limited editions selling out in minutes and sometimes reaching hundreds of dollars in aftermarket sales. These miniature sculptures often feature detailed characters, landscapes, or abstract designs, typically placed on the Escape key or function row as a centerpiece.</p>
          
          <h3>Material Innovations</h3>
          <p>Modern keycaps go beyond basic plastic, incorporating:</p>
          <ul>
            <li>PBT plastic for durability and a premium feel</li>
            <li>Dye-sublimation and double-shot molding for permanent legends</li>
            <li>Novel materials like zinc, aluminum, wood, and even resin with embedded real plants or minerals</li>
          </ul>
          
          <h3>Beyond Aesthetics: Practical Benefits</h3>
          <p>Custom keycaps aren't just about looks:</p>
          <ul>
            <li>Different profiles (SA, OEM, Cherry, etc.) provide varied typing experiences</li>
            <li>Textured keycaps for gaming keys improve tactile feedback</li>
            <li>Custom layouts help with specific applications or programming languages</li>
          </ul>
          
          <p>GaMine is entering this growing market with our upcoming Customization Studio, allowing users to design their own keycap sets with professional-grade materials and printing techniques. Stay tuned for the announcement of this service in the coming months.</p>
        `,
        image: "../assets/images/custom-keycaps.webp",
        category: "Trends",
        author: "Michelle Park, Design Specialist",
        date: "2023-05-05T10:00:00Z",
        tags: ["mechanical keyboards", "customization", "gaming setup"],
        featured: false
      }
    ];

    // Thiết lập danh mục
    const uniqueCategories = [...new Set(newsData.map(article => article.category))];
    setCategories(['all', ...uniqueCategories]);

    // Đặt bài viết nổi bật
    const featured = newsData.find(article => article.featured) || newsData[0];
    setFeaturedArticle(featured);

    // Thiết lập tất cả bài viết
    setArticles(newsData);

    // Nếu có blogId, hiển thị bài viết chi tiết
    if (blogId) {
      const article = newsData.find(article => article.id === parseInt(blogId));
      if (article) {
        setSelectedArticle(article);
      }
    }
  }, [blogId]);

  // Lọc bài viết dựa trên danh mục và từ khóa tìm kiếm
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Xử lý khi người dùng chọn một danh mục
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedArticle(null); // Đóng bài viết chi tiết khi chuyển danh mục
  };

  // Xử lý khi người dùng tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý khi người dùng chọn một bài viết
  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
    // Không sử dụng useNavigate để tránh tải lại trang, nhưng vẫn cập nhật URL
    window.history.pushState({}, '', `/news/${article.id}`);
  };

  // Quay lại danh sách bài viết
  const handleBackToList = () => {
    setSelectedArticle(null);
    window.history.pushState({}, '', '/news');
  };

  return (
    <div className="news-page">
      {/* Cyberpunk decorative elements */}
      <div className="cyber-circuit top"></div>
      <div className="cyber-circuit bottom"></div>
      <div className="cyber-dot dot1"></div>
      <div className="cyber-dot dot2"></div>
      
      {!selectedArticle ? (
        <>
          {/* Header */}
          <div className="news-header">
            <h1>Latest News</h1>
            <div className="header-line"></div>
          </div>

          {/* Search and Filters */}
          <div className="news-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="search-icon">🔍</span>
            </div>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Article */}
          {featuredArticle && selectedCategory === 'all' && !searchTerm && (
            <div className="featured-article" onClick={() => handleArticleSelect(featuredArticle)}>
              <div className="featured-image">
                <img src={featuredArticle.image} alt={featuredArticle.title} />
                <div className="featured-badge">Featured</div>
              </div>
              <div className="featured-content">
                <h2>{featuredArticle.title}</h2>
                <p className="featured-meta">
                  <span className="category">{featuredArticle.category}</span>
                  <span className="dot">•</span>
                  <span className="date">{formatDate(featuredArticle.date)}</span>
                  <span className="dot">•</span>
                  <span className="author">By {featuredArticle.author}</span>
                </p>
                <p className="featured-summary">{featuredArticle.summary}</p>
                <button className="read-more-btn">Read Full Article</button>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="articles-grid">
            {filteredArticles
              .filter(article => !article.featured || selectedCategory !== 'all' || searchTerm)
              .map(article => (
                <div 
                  className="article-card" 
                  key={article.id}
                  onClick={() => handleArticleSelect(article)}
                >
                  <div className="article-image">
                    <img src={article.image} alt={article.title} />
                    <div className="article-category">{article.category}</div>
                  </div>
                  <div className="article-info">
                    <p className="article-date">{formatDate(article.date)}</p>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-summary">{article.summary}</p>
                    <p className="article-author">By {article.author}</p>
                  </div>
                </div>
              ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="no-results">
              <p>No articles found. Try adjusting your search or filters.</p>
            </div>
          )}
        </>
      ) : (
        /* Article Detail View */
        <div className="article-detail">
          <button className="back-button" onClick={handleBackToList}>
            ← Back to Articles
          </button>

          <h1 className="article-title">{selectedArticle.title}</h1>
          
          <div className="article-meta">
            <span className="category">{selectedArticle.category}</span>
            <span className="dot">•</span>
            <span className="date">{formatDate(selectedArticle.date)}</span>
            <span className="dot">•</span>
            <span className="author">By {selectedArticle.author}</span>
          </div>

          <div className="article-hero-image">
            <img src={selectedArticle.image} alt={selectedArticle.title} />
          </div>

          <div className="article-content" dangerouslySetInnerHTML={{ __html: selectedArticle.content }}></div>

          <div className="article-tags">
            {selectedArticle.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>

          <div className="share-section">
            <p>Share this article:</p>
            <div className="share-buttons">
              <button className="share-button facebook">Facebook</button>
              <button className="share-button twitter">Twitter</button>
              <button className="share-button linkedin">LinkedIn</button>
              <button className="share-button copy">Copy Link</button>
            </div>
          </div>

          <h3 className="related-heading">Related Articles</h3>
          <div className="related-articles">
            {articles
              .filter(article => 
                article.id !== selectedArticle.id && 
                (article.category === selectedArticle.category || 
                 article.tags.some(tag => selectedArticle.tags.includes(tag)))
              )
              .slice(0, 3)
              .map(article => (
                <div 
                  className="related-article-card" 
                  key={article.id}
                  onClick={() => handleArticleSelect(article)}
                >
                  <div className="related-article-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                  <div className="related-article-info">
                    <h4>{article.title}</h4>
                    <p className="related-article-date">{formatDate(article.date)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default News; 