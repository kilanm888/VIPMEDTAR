async function handler(m, { command, text, conn }) {
    global.xoGames ??= {};
    const game = global.xoGames[m.chat];
    const [cmd] = text.trim().toLowerCase().split(' ');
    const isDelete = cmd === 'delete' || cmd === 'حذف';
    const isJoin = cmd === 'join' || cmd === 'انضمام';

    if (isDelete) {
        if (!game) return m.reply("❌ لا توجد لعبة نشطة للحذف!");
        if (game.player1 !== m.sender && game.player2 !== m.sender)
            return m.reply("❌ فقط اللاعبين يمكنهم حذف اللعبة!");

        delete global.xoGames[m.chat];
        return m.reply(`
╭━━━〔 🗑️ حذف اللعبة 〕━━━╮
┃ تم حذف اللعبة بنجاح
╰━━━━━━━━━━━━━━━━━━━━╯`);
    }

    if (!command || isJoin) {
        if (!game) return m.reply("❌ لا توجد لعبة للانضمام! اكتب *.xo* لإنشاء لعبة.");
        if (game.status === 'playing') return m.reply("❌ اللعبة بدأت بالفعل!");
        if (game.player1 === m.sender) return m.reply("❌ لا يمكنك اللعب ضد نفسك!");

        game.player2 = m.sender;
        game.status = 'playing';

        return conn.sendMessage(m.chat, {
            text: `
╭━━━〔 🎮 بدء لعبة XO 〕━━━╮
┃ تم الانضمام بنجاح
╰━━━━━━━━━━━━━━━━━━━━╯

${drawBoard(game.board)}

❌ @${game.player1.split('@')[0]}
⭕ @${game.player2.split('@')[0]}

╭━━━〔 البداية 〕━━━╮
┃ دور اللاعب الأول
┃ @${game.player1.split('@')[0]}
╰━━━━━━━━━━━━━━━━━━━━╯`,
            mentions: [game.player1, game.player2]
        });
    }

    if (game) {
        return m.reply(
            game.status === 'waiting'
                ? `❌ @${game.player1.split('@')[0]} ينتظر خصماً.\n\nاكتب *.xo* للانضمام`
                : "❌ توجد لعبة نشطة بالفعل!",
            null,
            game.status === 'waiting'
                ? { mentions: [game.player1] }
                : undefined
        );
    }

    global.xoGames[m.chat] = {
        player1: m.sender,
        player2: null,
        board: Array(9).fill(null),
        turn: 'X',
        status: 'waiting'
    };

    return m.reply(`
╭━━━〔 🎮 XO Game 〕━━━╮
┃ تم إنشاء اللعبة
╰━━━━━━━━━━━━━━━━━━━━╯

@${m.sender.split('@')[0]} ينتظر خصماً

اكتب *.xo* للانضمام!`, null, { mentions: [m.sender] });
}

handler.before = async (m, { conn }) => {
    if (!m.text || !global.xoGames?.[m.chat]) return false;

    const game = global.xoGames[m.chat];
    if (game.status !== 'playing') return false;

    const currentPlayer = game.turn === 'X' ? game.player1 : game.player2;
    if (m.sender !== currentPlayer) return false;

    const move = parseInt(m.text.trim()) - 1;
    if (move < 0 || move > 8 || isNaN(move)) return false;

    if (game.board[move] !== null)
        return !await m.reply("❌ هذا المربع مشغول بالفعل!");

    game.board[move] = game.turn;
    const winner = checkWinner(game.board);

    if (winner || game.board.every(cell => cell)) {
        let text, winnerJid;

        if (winner) {
            winnerJid = winner === 'X' ? game.player1 : game.player2;

            text = `
╭━━━〔 🏆 نهاية اللعبة 〕━━━╮
${drawBoard(game.board)}
╰━━━━━━━━━━━━━━━━━━━━╯

🎉 @${winnerJid.split('@')[0]} فاز!`;

            if (global.db?.users[winnerJid]) {
                global.db.users[winnerJid].xp =
                    (global.db.users[winnerJid].xp || 0) + 500;
                global.db.users[winnerJid].cookies =
                    (global.db.users[winnerJid].cookies || 0) + 10;

                text += `\n\n🏆 +500 XP | 🍪 +10 كوكيز`;
            }
        } else {
            text = `
╭━━━〔 🤝 تعادل 〕━━━╮
${drawBoard(game.board)}
╰━━━━━━━━━━━━━━━━━━━━╯`;
        }

        await conn.sendMessage(m.chat, {
            text,
            mentions: winnerJid ? [winnerJid] : undefined
        });

        delete global.xoGames[m.chat];
        return true;
    }

    game.turn = game.turn === 'X' ? 'O' : 'X';
    const nextPlayer = game.turn === 'X' ? game.player1 : game.player2;

    await conn.sendMessage(m.chat, {
        text: `
${drawBoard(game.board)}

╭━━━〔 🎯 الدور التالي 〕━━━╮
┃ @${nextPlayer.split('@')[0]} (${game.turn})
╰━━━━━━━━━━━━━━━━━━━━╯`,
        mentions: [nextPlayer]
    });

    return true;
};

handler.usage = ["اكس"];
handler.category = "games";
handler.command = ['اكس', 'xo'];
handler.usePrefix = true;

export default handler;

/* ───── اللوحة ───── */

const drawBoard = b =>
    [0, 3, 6]
        .map(i =>
            b
                .slice(i, i + 3)
                .map((c, idx) =>
                    c ? (c === 'X' ? '❌' : '⭕') : `${i + idx + 1}️⃣`
                )
                .join(' | ')
        )
        .join('\n');

/* ───── الفائز ───── */

const checkWinner = b => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, c, d] of lines)
        if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];

    return null;
};