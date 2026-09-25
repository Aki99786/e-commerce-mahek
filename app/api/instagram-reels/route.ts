import { NextResponse } from "next/server";

export const revalidate = 1800; // Cache for 30 minutes

const INSTAGRAM_TOKEN =
  process.env.INSTAGRAM_ACCESS_TOKEN ||
  "IGAAdjLlPakLFBZAGFtQXpDelVBR2JaS2FCclhETGZAyRkVfZAkJQYUlRTUUyblR5aE1ldTFQSUxmSGFYSkFES0hhdmF2LTZAPQUdjajBLTlpGd3RHY2hialU5VGFmN1JzX1pqdVZACR3IzdjQ5eHBvdVNtMEdhYXR3NHpOcURQU3hyawZDZD";

const FALLBACK_REELS = [
  {
    id: "18142366873597792",
    media_type: "VIDEO",
    media_url:
      "https://scontent-atl3-1.cdninstagram.com/o1/v/t2/f2/m86/AQP4sYphOvvo-0Iz5qr7pyAvXB31KtTBAsMbcY0seyRKbRNrWRDuaxR5AdE9SHqU24lYSX3zcerzf3Wwqo3bDUULFH1JjayRYC9WGxg.mp4?_nc_cat=107&_nc_sid=5e9851&_nc_ht=scontent-atl3-1.cdninstagram.com&_nc_ohc=SK2uSvovFaIQ7kNvwGwfqjN&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MTQxMTA5ODAyNDUzNTg0MCwiYXNzZXRfYWdlX2RheXMiOjQsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjoxNSwidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9&ccb=17-1&vs=9a209cc6d087a13f&edm=ANo9K5cEAAAA&_nc_zt=28&oh=00_AQIO7o8LWHPDp5KCMYG9Of2lp53FcLBjAkwbY_FyVvv_Ug&oe=6AB46540",
    permalink: "https://www.instagram.com/reel/DdalgX9pV8c/",
    timestamp: "2026-09-18T04:33:24+0000",
    thumbnail_url:
      "https://scontent-atl3-2.cdninstagram.com/v/t51.82787-15/813949319_18100056578124431_8672931102487562280_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&edm=ANo9K5cEAAAA&_nc_zt=23&oh=00_AQJqNNexTf1cvuKngoSxmwNiJQ5YzrFNHseAPrTImrbCbQ&oe=6AB84155",
    caption: "Hand-Embroidered Silk Lehenga",
  },
  {
    id: "18429142594180468",
    media_type: "VIDEO",
    media_url:
      "https://scontent-atl3-2.cdninstagram.com/o1/v/t2/f2/m86/AQNleGMe_L4ZXZdARWPlPBki5dKEUqe-I0FJvDvuzhPCJrpBKTxtrDPVnG5D1GpS5F07fkpnN7Gz69NZkrHOIhlaGQZB8VPshM9nY-E.mp4?_nc_cat=105&_nc_sid=5e9851&_nc_ht=scontent-atl3-2.cdninstagram.com&_nc_ohc=UgAJT8N9ArYQ7kNvwHOIChg&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MzYwNzg4MTUwNjAyNjE2NiwiYXNzZXRfYWdlX2RheXMiOjQsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjo4LCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&vs=f7e55f4b70ff2b36&edm=ANo9K5cEAAAA&_nc_zt=28&oh=00_AQIgi8s4PWZPSA399qeW715JQhGiHFWnPWGkJ9z8vcq_HA&oe=6AB44812",
    permalink: "https://www.instagram.com/reel/DdalQEJpzJD/",
    timestamp: "2026-09-18T04:31:29+0000",
    thumbnail_url:
      "https://scontent-atl3-1.cdninstagram.com/v/t51.82787-15/813949333_18100056044124431_1983009570833648712_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ccb=7-5&_nc_sid=18de74&edm=ANo9K5cEAAAA&_nc_zt=23&oh=00_AQIIwF-hFy6RGmV0",
    caption: "Emerald Kanjeevaram Saree",
  },
  {
    id: "18207760438363352",
    media_type: "VIDEO",
    media_url:
      "https://instagram.fidr7-1.fna.fbcdn.net/o1/v/t2/f2/m86/AQN2kQPMlu7PKcnevhHG2NwCro4A_OV-6jP3Ft9W2XjLhXsNVBEKuwFxhVCiuRZAtjlakdUHVLWzs7Hpe2FlAt3eTJusXPpKBQF6TU8.mp4?_nc_cat=107&_nc_sid=5e9851&_nc_ht=instagram.fidr7-1.fna.fbcdn.net&_nc_ohc=Na10HCPXnokQ7kNvwHwQIp6&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6NDM1NDg1NjQ3ODEwMTMzMiwiYXNzZXRfYWdlX2RheXMiOjQsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjo0LCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&vs=eedffec6e71aac79&edm=ANo9K5cEAAAA&_nc_zt=28&oh=00_AQJ3P52ENsc2W4TmquHd5BFKFUiGMd34qlXH3-SwS-Y2cg&oe=6AB46604",
    permalink: "https://www.instagram.com/reel/DdalHaIpeEW/",
    timestamp: "2026-09-18T04:30:00+0000",
    thumbnail_url:
      "https://scontent.cdninstagram.com/v/t51.82787-15/815187650_18100055891124431_673786318715838527_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ccb=7-5&_nc_sid=18de74&edm=ANo9K5cEAAAA&_nc_zt=23&oh=00_AQJTOGug8xCjxKNbC_OEev98QtL_7C5vpPe_fbug_st8Sg&oe=6AB86306",
    caption: "Royal Navy Blue Zari Saree",
  },
  {
    id: "18629929909044633",
    caption: "jai shree ganesh 😍",
    media_type: "VIDEO",
    media_url:
      "https://instagram.fidr7-1.fna.fbcdn.net/o1/v/t2/f2/m86/AQOCFzaUPsHjXEOmuz1PTqsRIBvtZAnVDiPbBMGN4unrDWpXxBx9KPh15VceyIY-GTD6NKv2bMHWFS7WSLFpUbV7rzN9QpmkEGf3sv4.mp4?_nc_cat=104&_nc_sid=5e9851&_nc_ht=instagram.fidr7-1.fna.fbcdn.net&_nc_ohc=3DCulGqc1WgQ7kNvwHH0Srf&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuMjQwLmRhc2hfYmFzZWxpbmVfM192MSIsInhwdl9hc3NldF9pZCI6MTUxMzg0NDI2MDc2ODU1MywiYXNzZXRfYWdlX2RheXMiOjQsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjo2NSwidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9&ccb=17-1&vs=f18164497a419c&edm=ANo9K5cEAAAA&_nc_zt=28&oh=00_AQJdBAqnjqEht2sKRsl79wNEQAN30oWwBExSSGK2M7iiLw&oe=6AB45251",
    permalink: "https://www.instagram.com/reel/DdY8iorJ-LP/",
    timestamp: "2026-09-17T13:16:13+0000",
    thumbnail_url:
      "https://scontent.cdninstagram.com/v/t51.82787-15/813332518_18099840086124431_6743682014731076458_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&edm=ANo9K5cEAAAA&_nc_zt=23&oh=00_AQKnk5D4QldnMvfZLIu37Ou3AsbL6pHmU8AHIPKXkwbA3Q&oe=6AB8555E",
  },
];

export async function GET() {
  try {
    const url = `https://graph.instagram.com/v25.0/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,thumbnail_url&limit=25&access_token=${INSTAGRAM_TOKEN}`;
    const response = await fetch(url, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      console.warn("Instagram API responded with status:", response.status);
      return NextResponse.json({ data: FALLBACK_REELS, source: "fallback" });
    }

    const data = await response.json();

    // Filter for video reels first, or items with video/thumbnail media
    const reelsOnly = (data.data || []).filter(
      (item: { media_type?: string; media_url?: string; thumbnail_url?: string }) =>
        item.media_type === "VIDEO" || item.thumbnail_url || item.media_url
    );

    return NextResponse.json({
      data: reelsOnly.length > 0 ? reelsOnly : FALLBACK_REELS,
      source: "live",
    });
  } catch (error) {
    console.error("Failed to fetch Instagram reels:", error);
    return NextResponse.json({ data: FALLBACK_REELS, source: "fallback" });
  }
}
