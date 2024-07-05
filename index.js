const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const readline = require("readline");
const ytdl = require("ytdl-core");
const fs = require("fs");
const ytpl = require("ytpl");
const { exit } = require("node:process");
ffmpeg.setFfmpegPath(ffmpegPath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const red = "\x1b[31m";
const ciano = "\x1b[36m";
const reset = "\x1b[0m";
const verde = "\x1b[32m";

const output = "./saida/";
const msgLink = `${red}Qual o link?\n${reset}`;
const msgPath = `${red}Qual o caminho do video?\n${reset}`;

const asciiIMG =
  "\n╔═══╗\n║███║ \n║(O)║ \x1b[31m♫ ♪ ♫ ♪\x1b[0m \n╚═══╝\n▄ █ ▄ █ ▄ ▄ █ ▄ █ ▄ █\nMin●- - - - - - -●Max\n\n";
const legal =
  "\n░░░░░░░░░░░░░░░░░░░░░░█████████░░░░░░░░░\n░░███████░░░░░░░░░░███▒▒▒▒▒▒▒▒███░░░░░░░\n░░█▒▒▒▒▒▒█░░░░░░░███▒▒▒▒▒▒▒▒▒▒▒▒▒███░░░░\n░░░█▒▒▒▒▒▒█░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██░░\n░░░░█▒▒▒▒▒█░░░██▒▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒███░\n░░░░░█▒▒▒█░░░█▒▒▒▒▒▒████▒▒▒▒████▒▒▒▒▒▒██\n░░░█████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██\n░░░█▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒██\n░██▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒██\n██▒▒▒███████████▒▒▒▒▒██▒▒▒▒▒▒▒▒██▒▒▒▒▒██\n█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒████████▒▒▒▒▒▒▒██\n██▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██░\n░█▒▒▒███████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██░░░\n░██▒▒▒▒▒▒▒▒▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█░░░░░\n░░████████████░░░█████████████████░░░░░░";

const information = () => {
  console.log(asciiIMG);
  const msg = `${red}Você quer?\n${ciano}[1]Baixar 1 video\n[2]Converter[video->audio]\n[3]Baixar Playlist\n${reset}`;
  rl.question(msg, (resp) => {
    switch (Number(resp)) {
      case 1:
        baixar();
        break;
      case 2:
        converter();
        break;
      case 3:
        baixarPlaylist();
        break;
    }
  });
};

const baixar = () => {
  rl.question(
    `${red}Qual o formato?\n${ciano}[1]Video\n[2]Audio\n${reset}`,
    (resp) => {
      if (resp == 1) {
        rl.question(msgLink, (resp) => {
          console.log(verde, "Baixando o video...", reset);
          ytdl.getBasicInfo(resp).then((d) => {
            ytdl(resp).pipe(
              fs.createWriteStream(output + `${d.videoDetails.title}.mp4`)
            );
            console.log(
              `terminou de baixar o video\nO arquivo está em ${red}${
                output + `${d.videoDetails.title}.mp4`
              }`
            );
            console.log(reset, legal);
          });
          rl.close();
        });
      } else {
        rl.question(msgLink, (resp) => {
          console.log(verde, "Baixando o audio...", reset);
          ytdl.getBasicInfo(resp).then((d) => {
            ytdl(resp).pipe(
              fs.createWriteStream(output + `${d.videoDetails.title}.mp3`)
            );
            console.log(
              `terminou de baixar o audio\nO arquivo está em ${red}${
                output + `${d.videoDetails.title}.mp3`
              }`
            );
            console.log(reset, legal);
          });
          rl.close();
        });
      }
    }
  );
};

const converter = () => {
  rl.question(msgPath, (resp) => {
    convertVideoToAudio(resp, "audio.mp3");
    rl.close();
  });
};

const convertVideoToAudio = (caminho, fileName) => {
  ffmpeg(caminho)
    .toFormat("mp3")
    .on("start", () => {
      console.log(verde, "começou a conversão", reset);
    })
    .on("end", () => {
      console.log(
        `terminou a conversão\nO arquivo está em ${red}${
          output + fileName
        }${reset}`
      );
      console.log(legal);
    })
    .on("error", (error) => {
      console.log(error);
    })
    .saveToFile(output + fileName);
};

const baixarPlaylist = () => {
  rl.question(`${red}URL da playlist:\n${reset}`, (url) => {
    rl.question(
      `${red}Você quer baixar todos os itens da playlist em qual formato?${ciano}\n[1]video\n[2]audio\n${reset}`,
      (resp) => {
        ytpl(url).then((d) => {
          d.items.forEach((videoItem) => {
            console.log(`${verde}baixando ${videoItem.title}...${reset}`);
            ytdl(videoItem.url, {
              filter: resp == 1 ? "audioandvideo" : "audio",
            }).pipe(fs.createWriteStream(output + `${videoItem.title}.mp4`));
            rl.close();
          });
          console.log("terminou");
        });
      }
    );
  });
};

information();
