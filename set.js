const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYURrVG9MdlBMNHBCR3JhNEcxNi94bFB6azRuek5ReDJUNldnZnZNNUNsST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK2ovNmxld0FNeW1USVB2L3hKMjNraWpLdW10cDlpcllNcGcwQURjNnhtTT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1QmFxRVk5VFYvUlFnbFNrdXFnQXJRaEhaeFhyb3EvTTJUOUxvUlp6UWtZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJIQnV3dHhrWnk2aWRZOGoyNDd4dzZTNElpdytqakFTTytUZ2J6d3FTSWdrPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjJEdWdTWmdKOTE0bHhNZ09oLzRBOEwrN1hnWlh4V29ON2M0cFJzQk5TRzg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik45NWZURGx0eW5UU1IxZmE2STJLZFg1bC9pY3hEL0pwQnFXNXZuTnNnbW89In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWVBkTkZ0SGRhdU95dlZ6NTNueGl1Uldja2VoQlMvSk9raHFSdkZTWEEwaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVkZCSFdQVktJb2JvOE1XMnJNWG5INDNlK1k1L1lSd2s0YVVlbzhnajdoMD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZhMHN6UGJ5ZGoybzA0Q3RHZ2VqcGx3Y1Z1eG1mT2pBWHVOUE94ajI1WE5IUjFFcWlhRldyR2k0dnFTR1cvaGdWUlFscG44VnVHay9XSDVUUkZpcGhBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTMsImFkdlNlY3JldEtleSI6InJpSjZpd3ljNDYzbGNmclhtVm5rTE1lazZyNEZ2S085dnovM0pITVdobmM9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6ImpFLXNveTVRUlFDblRKRHFJMnZWNXciLCJwaG9uZUlkIjoiMDRmM2ZlMjEtM2Y0YS00NzAwLWFiMmMtY2E2OTJiYjY0Y2Y5IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im5wV1ZjZzRtQUZkOEtibER2REFqalpSOE9nWT0ifSwicmVnaXN0ZXJlZCI6ZmFsc2UsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUy9SNDdybnlpdlowV1VPN2tlVkdSVmlGbUVJPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT1NlcHMwREVQN2p3Ym9HR0JNZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiZ3R2c1BxZWJ0bFVGS0RIelI0dlNBdVRnMmpQMnNkMmhESk9DQ1d4aERBUT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiSlNEc0NBYitwQ0lPaXNXdXBuTFZOa1lPc1M2NzFyMWhvN1pGdDYxUDJTdU5iZnhnYmFhOTR1Slpwb3ZUdnJSZkFJVjhxM2huaWNlVjVqVmpLZytaQ2c9PSIsImRldmljZVNpZ25hdHVyZSI6ImlNVXIrS0p4NVJ2bGQ3ZkprbXhGcjJLZnpNQmo3d1ZwRUxENHFrbmoxZ20vSWVmM2RyKys0WTE1MWJVTlJoc3U2UGkzM25FRVVtWjZhNnh2VFdYQWpRPT0ifSwibWUiOnsiaWQiOiIyNTQ3MDg1ODM4MTM6MThAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiS09PS1kifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzA4NTgzODEzOjE4QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQllMYjdENm5tN1pWQlNneDgwZUwwZ0xrNE5vejlySGRvUXlUZ2dsc1lRd0UifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzMzMjUzMTMsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQWFlIn0=',
    PREFIXES: (process.env.PREFIX || '.').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "𝒦𝑜𝑜𝓀𝓎",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "254114930429",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    L_S: process.env.STATUS_LIKE || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'off',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
