export default function MainPost(props: {image: string, title: string }) {
  const { image, title } = props;

  return (
    <div
    className="min-h-[30vh] min-w-[80vw] block sm:min-h-[35vh] lg:min-h-[40vh] relative bg-gray-800 text-white mb-4 bg-cover bg-no-repeat bg-center"
    style={{ backgroundImage: `url(${image})` }} >

      <div className="absolute top-0 bottom-0 right-0 left-0 bg-[rgb(0,0,0)] opacity-30"/>

      <div>
        <div>
          <div className="relative">
            <h1 className="text-4xl md:text-5xl">{title}</h1>
          </div>
        </div>
      </div>

    </div>
  );
}
