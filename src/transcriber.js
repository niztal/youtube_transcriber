const axios = require('axios');
var parseString = require('xml2js').parseString;
const config = require('../config.js');

const {youtubeBaseUrl, videoSuffixUrl} = config;

const transcribe = async (videoId) => {
    let words = [];
    const defaultLanguage = await getDefaultTranscriptionLanguage(videoId);
    const videoUrl = `${youtubeBaseUrl}${videoSuffixUrl}?v=${videoId}&&lang=${defaultLanguage.lang_code}`;
    const response = await axios.get(videoUrl);
    parseString(response.data, (err, result) => {
        const {transcript} = result;
        const {text} = transcript;
        text.forEach(sentence => {
            const {start} = sentence.$;
            sentence._.split(" ").forEach((w) => {
                words.push({
                    start,
                    value: w.toLowerCase()
                });
            });
        });
    });
    return {
        language: defaultLanguage.lang_code,
        words
    };
}

const getDefaultTranscriptionLanguage = async (videoId) => {
    let defaultLanguage;
    const videoUrl = `${youtubeBaseUrl}${videoSuffixUrl}?type=list&&v=${videoId}`;
    const response = await axios.get(videoUrl);
    parseString(response.data, (err, result) => {
        const {transcript_list} = result;
        const {track} = transcript_list;
        defaultLanguage = track.find((t) => {
            return t.$.lang_default;
        })
    });
    return defaultLanguage.$ || {lang_code: config.defaultLanguage};
}

module.exports = transcribe;

