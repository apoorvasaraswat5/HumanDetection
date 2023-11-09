import { getAllVideosResponse } from "./api"

export const getAllVideos = async () => {
    return [
        {
            id: '1',
            title: 'Video 1',
            size: '1.2GB',
            dateCreated: '2021-01-01',
            thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/sign/demo/public/out1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vL3B1YmxpYy9vdXQxLnBuZyIsImlhdCI6MTY5ODM1NDM2MywiZXhwIjoxNzI5ODkwMzYzfQ.1Rs9N-_gCU37U767GmqCXc5u5j5xY-7mT64ZS4MKwJs&t=2023-10-26T21%3A06%3A03.633Z'
        },
        {
            id: '2',
            title: 'Keyboard cat',
            size: '2.1MB',
            dateCreated: '2021-01-01',
            thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/public/human-detection-video-files/thumbnails/keyboard%20cat.mp4_1693c077-ae46-4214-a80a-925ee75557f1_thumbnail'
        },
    ]
}

export const getVideoArtifacts = async (videoId: string) => {
    console.log(videoId);
    if(videoId === '1'){
        return {
            videoURL:'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/sign/demo/public/Me%20at%20the%20zoo.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vL3B1YmxpYy9NZSBhdCB0aGUgem9vLm1wNCIsImlhdCI6MTY5ODM1Mzg4NiwiZXhwIjoxNzI5ODg5ODg2fQ.dfwfj6lM8rujyFmeLOJWsG-rRRwSHMLabOtwGCJhgR4&t=2023-10-26T20%3A58%3A07.114Z',
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
                    transcript: "Speaker 1: abc\nSpeaker 2: def",
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
    else{

    return {
        videoURL:'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/public/human-detection-video-files/videos/keyboard%20cat.mp4_1693c077-ae46-4214-a80a-925ee75557f1',
        peopleDetectedFrames: [
            {
                thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/public/human-detection-video-files/thumbnails/keyboard%20cat.mp4_c249b709-830b-4825-b100-71e0b72cbd65_thumbnail',
                timestamp: '00:00:01'
            }
            ,
            {
                thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/public/human-detection-video-files/thumbnails/keyboard%20cat.mp4_d99de0f5-6d36-4af6-9707-37bbcfbf64ca_thumbnail',
                timestamp: '00:00:02'
            }
        ],
        voiceDetectedFrames: [
            {
                transcript: "Speaker 1: Meow",
                timestamp: '00:00:01'
            },
            {
                transcript: 'Speaker 3: Meow',
                timestamp: '00:00:02'
            }
        ]
        ,
        distinctPeopleDetected: [
            {
                thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/public/human-detection-video-files/thumbnails/keyboard%20cat.mp4_d99de0f5-6d36-4af6-9707-37bbcfbf64ca_thumbnail',
                personId: 'Speaker 1'
            },
            {
                thumbnail: 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/public/human-detection-video-files/thumbnails/keyboard%20cat.mp4_d99de0f5-6d36-4af6-9707-37bbcfbf64ca_thumbnail',
                personId: 'Speaker 2'
            }
        ]
    }
}
    
}
export const placeholderVideo = 'https://kwdmufkexqqxupbctksg.supabase.co/storage/v1/object/sign/demo/public/Me%20at%20the%20zoo.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vL3B1YmxpYy9NZSBhdCB0aGUgem9vLm1wNCIsImlhdCI6MTY5ODM1Mzg4NiwiZXhwIjoxNzI5ODg5ODg2fQ.dfwfj6lM8rujyFmeLOJWsG-rRRwSHMLabOtwGCJhgR4&t=2023-10-26T20%3A58%3A07.114Z'