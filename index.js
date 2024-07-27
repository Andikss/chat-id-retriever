import express from 'express';
import { Telegraf } from 'telegraf';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Welcome! Use /reg <username> to register your account.');
});

bot.command('reg', (ctx) => {
    const input = ctx.message.text.split(' ');
    const username = input[1];
    const chatId = ctx.chat.id;

    if (username) {
        const data = `${chatId},${username}\n`;
        fs.appendFile('users.csv', data, (err) => {
            if (err) {
                console.error('Error writing to CSV:', err);
                ctx.reply('Failed to register. Please try again.');
            } else {
                ctx.reply('Registration successful!');
            }
        });
    } else {
        ctx.reply('Invalid input. Please use /reg <username>.');
    }
});

bot.catch((err, ctx) => {
    console.error('Error occurred:', err);
    ctx.reply('An error occurred. Please try again later.');
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});