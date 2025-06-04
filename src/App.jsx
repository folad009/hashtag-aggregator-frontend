import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Youtube, Instagram, Music2, ChevronDown, ChevronUp } from "lucide-react";

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

  return (
    <div className="p-4 min-h-screen w-full" style={{backgroundImage: "url('/assets/img/background-11millionsway.jpg')", backgroundSize: 'cover'}}>
      <h2 className="px-10 py-6 text-2xl font-bold text-center">
        #11MillionsWays Social Wall
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 px-6">
        {/* Instructions Column */}
        <div className="lg:w-1/3 w-full">
          {/* Mobile Toggle Button */}
          <button
            className="lg:hidden flex items-center justify-between w-full px-4 py-2 bg-white rounded shadow mb-2"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <span className="font-semibold">Instructions: How to participate</span>
            {showInstructions ? <ChevronUp /> : <ChevronDown />}
          </button>

          {/* Instructions Panel */}
          <div
            className={`${
              showInstructions ? "block" : "hidden"
            } lg:block bg-white rounded p-4 shadow lg:sticky lg:top-6`}
          >
            <h2 className="text-2xl font-semibold mb-4">Instructions: How to participate</h2>
            <p className="text-sm text-gray-700 mb-2">
              Use the filter buttons to view content from different platforms.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Click "All" to view everything.</li>
              <li>Choose a platform icon to filter by type.</li>
              <li>Click the link in each post to view it in full.</li>
            </ul>
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
                  {post.type === "instagram" && (
                    <span className="text-xs px-2 py-1 rounded bg-pink-100 text-pink-600 font-bold">
                      Instagram
                    </span>
                  )}
                  {post.type === "youtube" && (
                    <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-600 font-bold">
                      YouTube
                    </span>
                  )}
                  {post.type === "tiktok" && (
                    <span className="text-xs px-2 py-1 rounded bg-black text-white font-extrabold">
                      TikTok
                    </span>
                  )}
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

                {/* Instagram & TikTok from Juicer */}
                {(post.type === "instagram" || post.type === "tiktok") && (
                  <>
                    {post.media_url && post.media_type === "video" ? (
                      <video
                        controls
                        className="mb-2 w-full rounded"
                        src={post.media_url}
                        poster={post.thumbnail}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      post.media_url && (
                        <img
                          loading="lazy"
                          src={post.media_url}
                          alt={post.content?.slice(0, 30) || "Media"}
                          className="mb-2 w-full h-auto rounded"
                        />
                      )
                    )}

                    <p className="text-sm text-gray-700 mb-2">
                      {post.content || post.caption}
                    </p>

                    {post.permalink && (
                      <a
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline text-sm ${
                          post.type === "instagram"
                            ? "text-pink-600"
                            : "text-black"
                        }`}
                      >
                        View on{" "}
                        {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                      </a>
                    )}
                  </>
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
