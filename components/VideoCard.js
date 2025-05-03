// components/VideoCard.jsx
import Link from "next/link";

const VideoCard = ({ video }) => {
  return (
    <Link href={`/video/${video.id}`}>
      <div className="border rounded shadow hover:shadow-lg cursor-pointer p-2">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover mb-2" />
        <h3 className="text-lg font-semibold">{video.title}</h3>
        <p className="text-sm text-gray-500">{video.category}</p>
      </div>
    </Link>
  );
};

export default VideoCard;

