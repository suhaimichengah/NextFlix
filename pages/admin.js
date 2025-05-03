// pages/admin.js
import { useState } from "react";
import { storage, db } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !category || !thumbnail || !video) {
      alert("Sila isi semua maklumat.");
      return;
    }

    setUploading(true);

    try {
      // 1. Upload thumbnail
      const thumbRef = ref(storage, `thumbnails/${thumbnail.name}`);
      await uploadBytes(thumbRef, thumbnail);
      const thumbnailUrl = await getDownloadURL(thumbRef);

      // 2. Upload video
      const videoRef = ref(storage, `videos/${video.name}`);
      await uploadBytes(videoRef, video);
      const videoUrl = await getDownloadURL(videoRef);

      // 3. Simpan info ke Firestore
      await addDoc(collection(db, "videos"), {
        title,
        description,
        category,
        videoUrl,
        thumbnailUrl,
      });

      setTitle("");
      setDescription("");
      setCategory("");
      setThumbnail(null);
      setVideo(null);
      setSuccess(true);
    } catch (err) {
      console.error("Gagal upload:", err);
    }

    setUploading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Video (Admin)</h1>
      {success && <p className="text-green-600 mb-2">Berjaya upload!</p>}
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Tajuk Video"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
        />
        <textarea
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2"
        />
        <input
          type="text"
          placeholder="Kategori (contoh: Aksi, Komedi)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2"
        />
        <label>Thumbnail:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="w-full"
        />
        <label>Fail Video:</label>
        <input
          type="file"
          accept="video/mp4"
          onChange={(e) => setVideo(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {uploading ? "Memuat naik..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default Admin;

