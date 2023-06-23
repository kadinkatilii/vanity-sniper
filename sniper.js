console.clear();
console.log(
"AQU SNIPER"
console.log("");

const readline = require("readline");
const request = require("request");
const delay = require("delay");

const TOKEN =
  "Token";
const WEBHOOK =
  "WEBHOOK";
const GUILD_ID = "URL SUNUCU ID";
let VANITY_URL = "ALINACAK URL";

const headers = {
  authorization: TOKEN,
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function checkVanity() {
  while (true) {
    if (VANITY_URL === "") {
      console.log(
        "\x1b[36m%s\x1b[0m",
        "Vanity URL boş, yeni bir URL bekleniyor..."
      );
    } else {
      request.get(
        {
          url: `https://discord.com/api/v9/invites/${VANITY_URL}?with_counts=true&with_expiration=true`,
          headers: headers,
        },
        (error, response, body) => {
          if (response && response.statusCode == 404) {
            console.log(
              "\x1b[36m%s\x1b[0m",
              `Vanity URL değiştiriliyor: ${VANITY_URL}`
            );
            changeVanity();
          } else {
            console.log(
              "\x1b[36m%s\x1b[0m",
              `Vanity URL hala aktif: ${VANITY_URL}`
            );
          }
        }
      );
    }
    await delay(200);
  }
}

function changeVanity() {
  const payload = { code: VANITY_URL };
  request.patch(
    {
      url: `https://discord.com/api/v10/guilds/${GUILD_ID}/vanity-url`,
      headers: headers,
      json: payload,
    },
    (error, response, body) => {
      if (response.statusCode == 200) {
        console.log("\x1b[36m%s\x1b[0m", `URL değiştirildi: ${VANITY_URL}`);
        const data = {
          content: `@everyone discord.gg/${VANITY_URL} artık senin!`,
          username: "Aqu",
          avatar_url:
            "https://cdn.discordapp.com/attachments/1078000713914921043/1084384416228454460/lol.png",
        };
        request.post(
          {
            url: WEBHOOK,
            json: data,
          },
          () => {
            process.exit();
          }
        );
      } else {
        console.log(
          "\x1b[36m%s\x1b[0m",
          `Vanity URL değiştirilemedi, hata kodu: ${response.statusCode}`
        );
      }
    }
  );
}

rl.question("\x1b[36mİstediğiniz Vanity URL'yi girin:\x1b[0m ", (answer) => {
  VANITY_URL = answer;
  checkVanity();
});
