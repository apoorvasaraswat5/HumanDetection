export default function Image(src: string) {
    return (
              <img
                className="h-[200px] w-[250px] max-w-lg rounded-lg"
                alt=""
                src={src}
                key={src}
              />
    )
}