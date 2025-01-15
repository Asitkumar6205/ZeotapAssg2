require('dotenv').config({ path: '../.env' });
const express = require('express');
const OpenAi = require("openai")
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
app.use(cors());
app.use(express.json());

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY
})

const bot_id = process.env.BOT_ID

let thread = null;

app.post("/fetch-openai-response", async (req, res) => {
  try {

    const value = req.body.msg;


    if (!value){
      throw new Error("No value for msg")
    }

     thread = await openai.beta.threads.create()
    const msg = await openai.beta.threads.messages.create(thread.id , {
      role : 'user',
      content :value,
    })

    const run = await openai.beta.threads.runs.createAndPoll(thread.id , {
      assistant_id: bot_id,
    })

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(
        run.thread_id
      );

      res.json({
        msg : JSON.parse(messages.data[0].content[0].text.value)
      })
    }else{
      res.json({
        ok : ""
      })
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching response from OpenAI API");
  }
});

// Add a default route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});