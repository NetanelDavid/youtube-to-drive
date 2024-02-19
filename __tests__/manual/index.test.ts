import { handler } from "../../src/index";

handler({
    action: "Drive",
    playlist: [
        "https://www.youtube.com/watch?v=JTh5yQwjNNo",
    ]
}, {} as any, () => { })?.then(res => {
    console.log(res);
})