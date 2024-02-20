import { handler } from "../../src/index";

handler({
    format: "mp3",
    action: "download",
    playlist: [
        // יענקי היל חיים ישראל
        "https://www.youtube.com/watch?v=lNw2I4ydaXU",
        // יענקי היל אברהם פריד
        "https://www.youtube.com/watch?v=rgPGVU1nO7I",
        // יענקי היל ישי ריבו
        "https://www.youtube.com/watch?v=gbe0YFUUhZQ",
        // יענקי היל פתחי לי 
        "https://www.youtube.com/watch?v=KfDC8bvx89M",
        // בני פרידמן לא לפחד
        "https://www.youtube.com/watch?v=zCw-h4ikn_c",
        // אבי הילסון לראות את הטוב
        "https://www.youtube.com/watch?v=soj14hA7UKc",
        // אבי אילסון תן לי אור
        "https://www.youtube.com/watch?v=pJMXeJRm7cg",
        //אבי אילסון מקום לחלום
        "https://www.youtube.com/watch?v=uHEOB_X7fAk",
        //  אבי אילסון שבילים
        "https://www.youtube.com/watch?v=roApxa4iGfA",
        // שובו אלי
        "https://jmusic.me/vod/watch/mIsfB7foF838rPY",
        // אבא נתנאל ישראל ואיציק גבאי
        "https://www.youtube.com/watch?v=tsnkKRZXPoA",
        // לילה טוב ילד
        "https://www.youtube.com/watch?v=5PN4NnHcgZ4",
        // מודה אני צמד ילד
        "https://www.youtube.com/watch?v=LGSoBr0Sxdw",
        // מתנות קטנות צמד ילד
        "https://www.youtube.com/watch?v=oc_J8UiUvUo",
        // לא נפסיק לרקוד
        "https://www.youtube.com/watch?v=VUfuKKi3qQc",
        //אברהם פריד אבא מלך העולם
        "https://www.youtube.com/watch?v=WhxcSxDgtHI",
        // מידד טסה אבא תראה
        "https://www.youtube.com/watch?v=tlUAXjl4yhY",
        // ואני מוטי שטיימניץ
        "https://www.youtube.com/watch?v=JTh5yQwjNNo",
        // מוטי שטיימניץ כי שמחתני
        "https://www.youtube.com/watch?v=Bs03BR4ffyY",
        // מוטי שטיימינץ לכה דודי
        "https://www.youtube.com/channel/UCjh-noHUsafx_CSiieHNXFg",
        // יענקי היל מילה של נחמה 
        "https://www.youtube.com/watch?v=mDQbIB_aagY",
        // אל תפול חיים ישראל
        "https://www.youtube.com/watch?v=fcGTSuxDZ6g",
        // משה קליין על תפול
        "https://www.youtube.com/watch?v=f5TNkVPmNs4",
        // משה קליין עוד לא מאוחר
        "https://www.youtube.com/channel/UCDi07HVQVRGLtRS9gH_0woA",
        // משה קליין היום
        "https://www.youtube.com/watch?v=P4AS3jdGWeY",
        // משה קליין להיות שלם
        "https://www.youtube.com/watch?v=QVFwI22apZQ",
        // תן לי תפילה שמואל
        "https://www.youtube.com/watch?v=-wYyIvFFp4g",
        // שלמה כהן מחרוזת
        "https://www.youtube.com/watch?v=gciYfgd1Hf4",
        // מוטי שטטימניץ הנשמה בקרבי
        "https://www.youtube.com/watch?v=FL3h6UrX7kU",
        // מוטי שטיימניץ זכור ברית אברהם
        "https://www.youtube.com/watch?v=Cxwhqk8RVHk",
        // מוטי שטיימניץ תנה בני
        "https://www.youtube.com/watch?v=tYxFOEa6yHQ",
        // אברהם פריד צמאה לך נפשי
        "https://www.youtube.com/watch?v=YB30syENOdo",
        // אברהם פריד איתך אני
        "https://www.youtube.com/watch?v=kCavcNAsPFU",
        // מיילך קאהן ונהפוך הוא
        "https://www.youtube.com/watch?v=kiYXm_QernY",
        // מיילך קאהן לכבוד שבת
        "https://www.youtube.com/watch?v=ZwqKmQeNMEs",
        // מיילך קאהן ואהבת
        "https://www.youtube.com/watch?v=MWDF2LyBotk",
        // בבידוד מול בורא עולם
        "https://www.youtube.com/watch?v=oRU_8qFBrBo",
        // יגדל ליפא שמלצער
        "https://www.youtube.com/watch?v=lSB4q2fRBy0",
        // ליפא שמעלצר נקדישך
        "https://www.youtube.com/watch?v=z_b1jKRhEb0",
    ]
}, {} as any, () => { })?.then(res => {
    console.log(res);
})