const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const readline = require("readline");
const { exec } = require("child_process");
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
  console.clear();
  console.log(asciiIMG);
  const msg = `${red}Você quer?\n${ciano}[1]Baixar\n[2]Converter\n${reset}`;
  rl.question(msg, (resp) => {
    if (resp == 1) {
      baixar();
    }
    if (resp == 2) {
      converter();
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
          exec(`youtube-dl.exe ${resp}`).on("close", () => {
            console.log(
              `terminou de baixar o video\nO arquivo está em ${red}${
                output + "video.mp4"
              }${reset}`
            );
            console.log(legal);
          });
          rl.close();
        });
      } else {
        rl.question(msgLink, (resp) => {
          console.log(verde, "Baixando o audio...", reset);
          exec(`youtube-dl.exe -f bestaudio ${resp}`).on("close", () => {
            console.log(
              `terminou de baixar o audio\nO arquivo está em ${red}${
                output + "audio.mp3"
              }${reset}`
            );
            console.log(legal);
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

information();
