export default function TranscriptCard(props: any){
    return <div className="card w-96 bg-base-100 shadow-xl">
    <div className="card-body">
      <p>{props.content}</p>
    </div>
  </div>
}