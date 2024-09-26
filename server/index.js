// import express from "express";
// import { createReadStream, readFileSync, statSync } from 'fs';
// import { dirname } from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// console.log("_dirname", __dirname);

// const app = express();

// app.get("/", (req, res) => {
//     res.send("hellow world")


// })

// app.get("/video", (req, res) => {
//     const filepath = `${__dirname}/public/video.mp4`;
//     const stat = statSync(filepath);
//     const fileSize = stat.size;

//     const range = req.headers.range;
//     if (!range) {
//         res.status(400).send("range is required");
//     }
//     const chunkSize = 10 ** 6;
//     const start = Number(range.replace(/\D/g, ""));
//     const end = Math.min(start + chunkSize, fileSize);
//     const contentLength = end - start + 1;

//     const fileStream = createReadStream(filepath, {
//         start, end,
//     })
//     fileStream.pipe(res);

//     const header = {
//         "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//         "Accept-Ranges": "bytes",
//         "Content-Length": contentLength,
//         "Content-Type": 'video/mp4',
//     }

//     res.writeHead(206, header);

// })





// const port = 3000;
// app.listen(port, () => {
//     console.log("server is running prot 3000")

// })
import express from "express";
import { createReadStream, statSync, existsSync } from 'fs';
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log("__dirname", __dirname);

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/video", (req, res) => {
    const filepath = `${__dirname}/public/vedio.mp4`;

    // Check if the file exists
    if (!existsSync(filepath)) {
        return res.status(404).send("Video file not found");
    }
    console.log(existsSync(filepath))

    const stat = statSync(filepath);
    const fileSize = stat.size;

    const range = req.headers.range;
    if (!range) {
        return res.status(400).send("Range is required");
    }

    const CHUNK_SIZE = 10 ** 6; // 1MB chunk size
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, fileSize - 1); // Ensure end is within the file size
    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const videoStream = createReadStream(filepath, { start, end });
    videoStream.pipe(res);
});

const port = 3000;
app.listen(port, () => {
    console.log("Server is running on port 3000");
});