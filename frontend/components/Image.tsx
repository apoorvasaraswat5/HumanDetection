export default function Image({src}: {src: string}) {
    return (
        <img className="h-auto max-w-lg rounded-lg" src={src} alt="image description"/>
    )
}