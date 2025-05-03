// pages/index.js
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const querySnapshot = await getDocs(collection(db, "videos"));
      const videoList = [];
      querySnapshot.forEach((doc) => {
        videoList.push({ id: doc.id, ...doc.data() });
      });
      setVideos(videoList);
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
// pages/index.js
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", "Aksi", "Komedi", "Drama", "Seram"];

  useEffect(() => {
    const fetchVideos = async () => {
      const querySnapshot = await getDocs(collection(db, "videos"));
      const videoList = [];
      querySnapshot.forEach((doc) => {
        videoList.push({ id: doc.id, ...doc.data() });
      });
      setVideos(videoList);
    };

    fetchVideos();
  }, []);

  // Filter ikut carian & kategori
  const filteredVideos = videos.filter((video) => {
    const matchSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "Semua" || video.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row gap-2 justify-between">
        <input
          type="text"
          placeholder="Cari video..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full sm:w-1/2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <p className="text-center mt-6 text-gray-500">Tiada video dijumpai.</p>
      )}
    </div>
  );
}

