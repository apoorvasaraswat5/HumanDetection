import Card from "@/components/Card";
export default function Home() {
  return (
    <div className="main-content flex h-screen">
      <div className=" sidebar w-1/4 space-y-3 bg-gray-300 overflow-scroll">
        <Card fileName="Video1.mp4" date="01/01/2024" size="100MB"/>
        <Card fileName="Video2.mp4" date="02/01/2024" size="100MB"/>
        <Card fileName="Video3.mp4" date="03/01/2024" size="100MB"/>
        <Card fileName="Video4.mp4" date="04/01/2024" size="100MB"/>
        <Card fileName="Video5.mp4" date="04/01/2024" size="100MB"/>
        <Card fileName="Video6.mp4" date="04/01/2024" size="100MB"/>
        <Card fileName="Video7.mp4" date="04/01/2024" size="100MB"/>
      </div>
      <div className="content w-3/4 flex flex-col p-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Images
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          <img
            className="h-[200px] w-[250px] max-w-lg rounded-lg"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
          <img
            className="h-[200px] w-[250px] max-w-lg rounded-lg"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
          <img
            className="h-[200px] w-[250px] max-w-lg rounded-lg"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
          <img
            className="h-[200px] w-[250px] max-w-lg rounded-lg"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Audio
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          <img
            className="h-[200px] w-[250px] max-w-lg rounded-lg"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
          <img
            className="h-[200px] w-[250px] max-w-lg rounded-lg"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
          <img
            className="h-[200px] w-[250px] max-w-lg rounded-lg"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
          <img
            className="h-[200px] w-[250px] max-w-lg rounded-lg"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          People
        </h2>
        <div className="flex flex-row p-5 space-x-5">
          <img
            className="h-[200px] w-[200px] max-w-lg rounded-full"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
          <img
            className="h-[200px] w-[200px] max-w-lg rounded-full"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
          <img
            className="h-[200px] w-[200px] max-w-lg rounded-full"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
          <img
            className="h-[200px] w-[200px] max-w-lg rounded-full"
            alt=""
            src="https://i.imgur.com/XgbZdeA.jpeg"
          />
        </div>
      </div>
    </div>
  );
}
