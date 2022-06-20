import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
  const userInfo = req.body;
  const { username, avatar } = userInfo;

  if (!username || !avatar) {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }

  users.push(userInfo);
  res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
  const username = req.headers.user;
  const { tweet } = req.body;

  if (!username || !tweet) {
    res.status(400).send("Todos os campos são obrigatórios!");
    return;
  }

  const tweetInfo = {
    username,
    tweet
  };

  tweets.unshift(tweetInfo);
  res.status(201).send("OK");
});

const ONE = 1;
const TEN = 10;
app.get("/tweets", (req, res) => {
  const page = parseInt(req.query.page);
  const lastTenTweets = tweets
    .filter((tweetInfo, index) => (index >= (page - ONE) * TEN) && (index < page * TEN))
    .map(tweetInfo => ({
      username: tweetInfo.username,
      avatar: users.find(user => user.username === tweetInfo.username).avatar,
      tweet: tweetInfo.tweet
    }));

    console.log(page);
  
  if(lastTenTweets.length === 0 && page !== 1) {
    res.status(400).send("Informe uma página válida!");
    return;
  }
  
  res.send(lastTenTweets);
});

app.get("/tweets/:USERNAME", (req, res) => {
  const username = req.params.USERNAME;
  const userTweets = tweets.filter((tweet) => tweet.username === username);
  const userTweetsWithAvatar = userTweets
    .map(tweetInfo => ({
      username: tweetInfo.username,
      avatar: users.find(user => user.username === tweetInfo.username).avatar,
      tweet: tweetInfo.tweet
    }));

  res.send(userTweetsWithAvatar);
});

app.listen(5000);