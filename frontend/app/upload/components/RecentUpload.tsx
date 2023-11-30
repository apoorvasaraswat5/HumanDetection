import { Container, Row, Col } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RecentUpload({
    onClick,
    thumbnail = "/defaultThumbnail.png",
    fileName = "video.mp4",
    date = "01/01/2020",
    processed = "Not Processed",
  }: {
    onClick: (event: any) => void;
    thumbnail?: string;
    fileName?: string;
    date?: string;
    processed?: string;
  }) {
    thumbnail = 'http://127.0.0.1:8000/download?file_path=' + encodeURIComponent(thumbnail);
    return (
      <button
        onClick={onClick}
        className="flex w-full group items-center p-6 bg-white border border-gray-200 shadow hover:bg-blue-200 flex space-x-5">
        <Container>
            <Row>
                <Col>
                    <img width={100} height={100} src={thumbnail} />
                </Col>
                <Col className="items-center">
                    <div className="mb-2 text-lg text-gray-900">
                        <div className="font-bold">{fileName}</div>
                        <div>{date}</div>
                    </div>
                </Col>
                <Col className="items-center">
                    <div className="filesize border-2 p-2 ml-auto group-hover:border-black">
                        {processed}
                    </div>
                </Col>
            </Row>
        </Container>
      </button>
    );
  }
  