import { getAllVideosResponse } from "./api"

export const getAllVideos = async () => {
    return [
        {
            id: '1',
            title: 'Video 1',
            size: '1.2GB',
            dateCreated: '2021-01-01',
            thumbnail: 'output1.png'
        },
        {
            id: '2',
            title: 'Video 2',
            size: '1.2GB',
            dateCreated: '2021-01-01',
            thumbnail: 'output1.png'
        },
        {
            id: '3',
            title: 'Video 3',
            size: '1.2GB',
            dateCreated: '2021-01-01',
            thumbnail: 'output1.png'
        },
        {
            id: '4',
            title: 'Video 4',
            size: '1.2GB',
            dateCreated: '2021-01-01',
            thumbnail: 'output1.png'
        },
        {
            id: '5',
            title: 'Video 5',
            size: '1.2GB',
            dateCreated: '2021-01-01',
            thumbnail: 'output1.png'
        },
        {
            id: '6',
            title: 'Video 6',
            size: '1.2GB',
            dateCreated: '2021-01-01',
            thumbnail: 'output1.png'
        },
    ]
}

export const getVideoArtifacts = async (videoId: string) => {
    console.log(videoId);
    return {
        videoURL:'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/sign/demo/public/out1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vL3B1YmxpYy9vdXQxLnBuZyIsImlhdCI6MTY5ODM1NDM2MywiZXhwIjoxNzI5ODkwMzYzfQ.1Rs9N-_gCU37U767GmqCXc5u5j5xY-7mT64ZS4MKwJs&t=2023-10-26T21%3A06%3A03.633Z',
        peopleDetectedFrames: [
            {
                thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/sign/demo/public/out1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vL3B1YmxpYy9vdXQxLnBuZyIsImlhdCI6MTY5ODM1NDM2MywiZXhwIjoxNzI5ODkwMzYzfQ.1Rs9N-_gCU37U767GmqCXc5u5j5xY-7mT64ZS4MKwJs&t=2023-10-26T21%3A06%3A03.633Z',
                timestamp: '00:00:01'
            }
            ,
            {
                thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/sign/demo/public/out1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vL3B1YmxpYy9vdXQxLnBuZyIsImlhdCI6MTY5ODM1NDM4MiwiZXhwIjoxNzI5ODkwMzgyfQ._NWVTwJbOdRT5fp4EdyjC8Aa-04S1EEvZe_3qNhyqko&t=2023-10-26T21%3A06%3A22.155Z',
                timestamp: '00:00:02'
            }
        ],
        voiceDetectedFrames: [
            {
                transcript: "Speaker 1: abc\
                Speaker 2: def",
                timestamp: '00:00:01'
            },
            {
                transcript: 'Speaker 3: Hello World',
                timestamp: '00:00:02'
            }
        ]
        ,
        distinctPeopleDetected: [
            {
                thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/sign/demo/public/out3.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vL3B1YmxpYy9vdXQzLnBuZyIsImlhdCI6MTY5ODM1NDM5MiwiZXhwIjoxNzI5ODkwMzkyfQ.sGqDMZQjc2WifOeIc0fpnI9VnwZCI6GuaByOjit8V7s&t=2023-10-26T21%3A06%3A32.793Z',
                personId: 'Speaker 1'
            },
            {
                thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/sign/demo/public/out4.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vL3B1YmxpYy9vdXQ0LnBuZyIsImlhdCI6MTY5ODM1NDQwNCwiZXhwIjoxNzI5ODkwNDA0fQ.MwTGhN92PtjDTBwgWlvtbjl1uJMEs-RNXQ9S6RUPF1I&t=2023-10-26T21%3A06%3A44.375Z',
                personId: 'Speaker 2'
            }
        ]
    }
}