export default function FourIsToThree() {
  return (
    <div className="aspect-[4/3] overflow-hidden rounded-lg">
      <iframe
        src="https://www.youtube.com/embed/MRR49K5Dhpo"
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
}