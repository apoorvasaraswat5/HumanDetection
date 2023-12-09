export default function TranscriptCard(props: any){
    return <div className="card bg-base-100 shadow-xl max-w-none">
    <div className="card-body">
      <p className="whitespace-pre">{props.content}</p>
    </div>
  </div>
}