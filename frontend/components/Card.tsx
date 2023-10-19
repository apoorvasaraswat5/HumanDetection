export default function Card({
  onClick,
  thumbnail = "/defaultThumbnail.png",
  fileName = "video.mp4",
  date = "01/01/2020",
  size = "0kb",
}: {
  onClick: () => void;
  thumbnail?: string;
  fileName?: string;
  date?: string;
  size?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full group items-center p-6 bg-white border border-gray-200 shadow hover:bg-blue-200 flex space-x-5"
    >
      <img src={thumbnail} />
      <div className="mb-2 text-lg text-gray-900">
        <div className="font-bold">{fileName}</div>
        <div>{date}</div>
      </div>
      <div className="filesize border-2 p-2 ml-auto group-hover:border-black">
        {size}
      </div>
    </button>
  );
}
