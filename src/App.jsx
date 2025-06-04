import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  Youtube,
  Instagram,
  Music2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const socket = io("https://hashtag-aggregator-backend.onrender.com");

function App() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    socket.on("newPosts", (data) => {
      setPosts(data);
    });
  }, []);

  const filteredPosts =
    filter === "all" ? posts : posts.filter((p) => p.type === filter);

  const platformLabel = (type) => {
    if (type === "instagram") return "Instagram";
    if (type === "youtube") return "YouTube";
    if (type === "tiktok") return "TikTok";
    return "";
  };

  return (
    <div
      className="p-4 min-h-screen w-full"
      style={{
        backgroundImage: "url('/assets/img/background-11millionsway.jpg')",
        backgroundSize: "cover",
      }}
    >
      <h2 className="px-10 py-6 text-2xl font-bold text-center underline">
        Chivita 11 Million Ways Social Wall
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 px-6">
        {/* Instructions Column */}
        <div className="lg:w-1/3 w-full">
          <button
            className="lg:hidden flex items-center justify-between w-full px-4 py-2 bg-white rounded shadow mb-2"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <span className="font-semibold">
              Instructions: How to participate
            </span>
            {showInstructions ? <ChevronUp /> : <ChevronDown />}
          </button>

          <div
            className={`${
              showInstructions ? "block" : "hidden"
            } lg:block bg-white rounded p-4 shadow lg:sticky lg:top-6`}
          >
            <h2 className="text-2xl font-semibold mb-4">
             🎉 Join the #11MillionWays with Chivita Challenge!
            </h2>
            <div>
              <h2>Create Your Chivita Recipe 🧃</h2>
              <p>Come up with a fun, delicious, or unexpected recipe using any Chivita product (e.g. smoothies, mocktails, desserts, etc.).</p>
            </div>
            <div>
              <h2>Record a Video 🎬</h2>
              <p>Film yourself making the recipe — show us your ingredients, your process, and the final result! Make it fun, clear, and personal.</p>
            </div>
            <div>
              <h2>Post Your Video 📲</h2>
              <p>Upload your video to <strong>Instagram</strong> or <strong>YouTube</strong>.<br/>
                🔖 <strong>IMPORTANT:</strong> In your caption or title, use the hashtag <strong>#11MillionWays</strong> and tag <strong>Chivita</strong> to make sure we see it!
              </p>
            </div>
            <div>
              <h2>Inspire Others 💥</h2>
              <p>Share your video with friends, family, or followers. You never know who you'll inspire!</p>
            </div>
            <div>
               <h2>🌟 Bonus Tips:</h2>
                <ul>
                  <li>Keep your video under 60–90 seconds if posting on Instagram Reels or YouTube Shorts.</li>
                  <li>Show your face and talk us through the recipe!</li>
                  <li>Get creative with ingredients or presentation — this is your moment to shine.</li>
                </ul>
            </div>
          </div>
        </div>

        {/* Aggregator Column */}
        <div className="lg:w-2/3 w-full">
          {/* Filter Buttons */}
          <div className="flex justify-start lg:justify-center gap-4 mb-6 flex-wrap">
            {[
              { label: "All", type: "all" },
              {
                label: "YouTube",
                type: "youtube",
                icon: <Youtube className="inline w-4 h-4 mr-1" />,
              },
              {
                label: "Instagram",
                type: "instagram",
                icon: <Instagram className="inline w-4 h-4 mr-1" />,
              },
              {
                label: "TikTok",
                type: "tiktok",
                icon: <Music2 className="inline w-4 h-4 mr-1" />,
              },
            ].map(({ label, type, icon }) => (
              <button
                key={type}
                className={`px-4 py-2 rounded ${
                  filter === type
                    ? "bg-red-600 text-black font-bold"
                    : "bg-white text-red-600 border"
                }`}
                onClick={() => setFilter(type)}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Masonry Layout */}
          <div className="columns-1 sm:columns-2 lg:columns-2 gap-4 space-y-4">
            {filteredPosts.map((post, idx) => (
              <div
                key={idx}
                className="break-inside-avoid p-4 bg-white rounded shadow mb-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="capitalize text-sm font-semibold text-gray-700">
                    {post.type}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded font-bold ${
                      post.type === "instagram"
                        ? "bg-pink-100 text-pink-600"
                        : post.type === "youtube"
                        ? "bg-red-100 text-red-600"
                        : "bg-black text-white"
                    }`}
                  >
                    {platformLabel(post.type)}
                  </span>
                </div>

                {/* YouTube */}
                {post.type === "youtube" && (
                  <>
                    <img
                      loading="lazy"
                      src={post.thumbnail}
                      alt={post.title}
                      className="mb-2 w-full h-auto rounded"
                    />
                    <h3 className="text-md font-bold">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.description}</p>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-950 underline mt-2 inline-block text-sm"
                    >
                      Watch on YouTube
                    </a>
                  </>
                )}

                {/* Instagram & TikTok */}
                {(post.type === "instagram" || post.type === "tiktok") && (
                  <div className="mb-4">
                    {post.video ? (
                      <video
                        className="w-full h-auto rounded mb-2"
                        src={post.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        poster={
                          post.image ||
                          post.thumbnail ||
                          "/assets/img/default-thumbnail.jpg"
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.poster = "/assets/img/default-thumbnail.jpg";
                        }}
                      />
                    ) : (
                      <img
                        src={
                          post.image ||
                          post.thumbnail ||
                          "/assets/img/default-thumbnail.jpg"
                        }
                        alt="Post thumbnail"
                        className="w-full h-auto rounded mb-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/img/default-thumbnail.jpg";
                        }}
                      />
                    )}

                    {post.message && (
                      <p
                        className="text-sm text-gray-800 whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{ __html: post.message }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
