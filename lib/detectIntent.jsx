export default function detectIntent(message) {
    const text = message.toLowerCase();

    const scores = {
        recommend: 0,
        search: 0,
        watchlist: 0,
        profile: 0,
        chat: 0,
    };

    // Recommendation
    if (/\brecommend\b/.test(text)) scores.recommend += 3;
    if (/\bsuggest\b/.test(text)) scores.recommend += 3;
    if (/what should i watch/.test(text)) scores.recommend += 4;
    if (/watch next/.test(text)) scores.recommend += 4;
    if (/similar to/.test(text)) scores.recommend += 3;
    if (/looking for/.test(text)) scores.recommend += 2;
    if (/suggest me/.test(text)) scores.recommend += 3;
    if (/give me/.test(text)) scores.recommend += 2;
    if (/any anime/.test(text)) scores.recommend += 2;
    if (/something like/.test(text)) scores.recommend += 4;
    if (/similar anime/.test(text)) scores.recommend += 4;
    if (/worth watching/.test(text)) scores.recommend += 3;

    // Search
    if (/\bsearch\b/.test(text)) scores.search += 3;
    if (/\bfind\b/.test(text)) scores.search += 2;
    if (/tell me about/.test(text)) scores.search += 2;
    if (/information on/.test(text)) scores.search += 2;
    if (/who is/.test(text)) scores.search += 2;
    if (/what is/.test(text)) scores.search += 2;
    if (/plot of/.test(text)) scores.search += 3;
    if (/synopsis/.test(text)) scores.search += 3;
    if (/episodes/.test(text)) scores.search += 2;

    // Watchlist
    if (/watchlist/.test(text)) scores.watchlist += 4;
    if (/completed/.test(text)) scores.watchlist += 2;
    if (/watching/.test(text)) scores.watchlist += 2;
    if (/plan to watch/.test(text)) scores.watchlist += 2;
    if (/rated/.test(text)) scores.watchlist += 2;
    if (/finished/.test(text)) scores.watchlist += 2;
    if (/have i watched/.test(text)) scores.watchlist += 3;
    if (/my list/.test(text)) scores.watchlist += 3;
    if (/highest rated/.test(text)) scores.watchlist += 3;

    // Profile
    if (/my taste/.test(text)) scores.profile += 4;
    if (/my profile/.test(text)) scores.profile += 4;
    if (/favorite genre/.test(text)) scores.profile += 3;
    if (/top genre/.test(text)) scores.profile += 3;
    if (/anime taste/.test(text)) scores.profile += 3;
    if (/why did you recommend/.test(text)) scores.profile += 4;
    if (/what do i like/.test(text)) scores.profile += 4;
    if (/my preferences/.test(text)) scores.profile += 3;

    // Greetings / General chat
    if (/^(hi|hello|hey|yo|good morning|good evening)$/.test(text.trim()))
        scores.chat += 5;

    if (/(thanks|thank you|how are you|who are you)/.test(text))
        scores.chat += 3;

    const maxScore = Math.max(...Object.values(scores));

    if (maxScore === 0) return "chat";

    const bestIntent = Object.entries(scores).find(
        ([, score]) => score === maxScore
    );
    return bestIntent[0];

}