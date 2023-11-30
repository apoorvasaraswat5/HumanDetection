export default function TranscriptCard(props: any){
    return <div className="card w-96 bg-base-100 shadow-xl overflow-hidden">
    <div className="card-body">
      <p className="whitespace-pre">{props.content}</p>
    </div>
  </div>
}